import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { perfilAtual } from "@/lib/dados";
import Checklist from "@/components/Checklist";
import Quiz, { type Pergunta } from "@/components/Quiz";
import Concluir from "@/components/Concluir";

type Material = { titulo: string; descricao?: string; arquivo: string; tipo?: string };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase } = await perfilAtual();
  const { data } = await supabase.from("aulas").select("numero, titulo").eq("slug", slug).single();
  return { title: data ? `${data.numero} ${data.titulo}` : "Aula" };
}

export default async function AulaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user, perfil } = await perfilAtual();
  const caminho = perfil?.caminho ?? null;

  const { data: aula } = await supabase
    .from("aulas")
    .select("id, slug, numero, titulo, minutos, situacao, essencial, desfecho, pratica, missao, materiais, modulo_id, ordem, modulos(titulo, ordem)")
    .eq("slug", slug)
    .single();
  if (!aula) notFound();

  const [{ data: perguntas }, { data: prog }, { data: cards }, { data: todas }] = await Promise.all([
    supabase.from("quiz_perguntas").select("id, pergunta, opcoes, correta, explicacao").eq("aula_id", aula.id).order("ordem"),
    supabase.from("progresso").select("concluida_em, checklist, acertos").eq("aula_id", aula.id).eq("user_id", user.id).maybeSingle(),
    supabase.from("cards").select("slug, titulo, categoria, resumo").eq("aula_id", aula.id).order("titulo"),
    supabase.from("aulas").select("slug, numero, titulo, ordem, caminho, modulos(ordem)"),
  ]);

  const modulo = aula.modulos as unknown as { titulo: string; ordem: number } | null;
  const pratica = (aula.pratica as string[]) ?? [];
  const materiais = (aula.materiais as Material[]) ?? [];

  // próxima aula do caminho do aluno, seguindo para o próximo módulo quando este acabar
  type Item = { slug: string; numero: string; titulo: string; ordem: number; caminho: string; modulos: { ordem: number } | null };
  const sequencia = ((todas ?? []) as unknown as Item[])
    .filter((a) => a.caminho === "ambos" || !caminho || a.caminho === caminho)
    .sort((a, b) => (a.modulos?.ordem ?? 0) - (b.modulos?.ordem ?? 0) || a.ordem - b.ordem);
  const posicao = sequencia.findIndex((a) => a.slug === aula.slug);
  const seguinte = posicao >= 0 ? sequencia[posicao + 1] : undefined;
  const proxima = seguinte ? { slug: seguinte.slug, numero: seguinte.numero, titulo: seguinte.titulo } : null;

  return (
    <article className="pagina">
      <Link href="/trilha" className="voltar">
        ← Trilha
      </Link>

      <header className="aula-cabeca">
        <div className="modulo-nome">{modulo ? `Módulo ${modulo.ordem}: ${modulo.titulo}` : null}</div>
        <div className="carimbo" aria-hidden="true">
          {aula.numero}
        </div>
        <h1>{aula.titulo}</h1>
        {aula.minutos && <div className="tempo">{aula.minutos} minutos de leitura</div>}
      </header>

      {aula.situacao && (
        <section className="bloco">
          <h2>Situação real</h2>
          <div className="situacao leitura">
            <p>{aula.situacao}</p>
          </div>
        </section>
      )}

      {aula.essencial && (
        <section className="bloco">
          <h2>O essencial</h2>
          <div className="leitura">
            <Markdown>{aula.essencial}</Markdown>
          </div>
          {aula.desfecho && (
            <div className="desfecho">
              <b>De volta à situação: </b>
              {aula.desfecho}
            </div>
          )}
        </section>
      )}

      {pratica.length > 0 && (
        <section className="bloco">
          <h2>Na prática</h2>
          <Checklist aulaId={aula.id} itens={pratica} marcadosIniciais={(prog?.checklist as number[]) ?? []} />
        </section>
      )}

      {materiais.length > 0 && (
        <section className="bloco">
          <h2>Material de apoio</h2>
          <div className="materiais">
            {materiais.map((m) => (
              <a key={m.arquivo} href={m.arquivo} className="material" target="_blank" rel="noopener">
                <span className="material-icone" aria-hidden="true">
                  {m.tipo ?? "PDF"}
                </span>
                <span className="material-texto">
                  <b>{m.titulo}</b>
                  {m.descricao && <span>{m.descricao}</span>}
                </span>
                <span className="material-acao">Abrir</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {perguntas && perguntas.length > 0 && (
        <section className="bloco">
          <h2>Teste rápido</h2>
          <Quiz aulaId={aula.id} perguntas={perguntas as Pergunta[]} />
        </section>
      )}

      {aula.missao && (
        <section className="bloco">
          <h2>Missão</h2>
          <div className="missao">
            <p>{aula.missao}</p>
          </div>
        </section>
      )}

      {cards && cards.length > 0 && (
        <section className="bloco">
          <h2>Para consultar depois</h2>
          <div className="cards-relacionados">
            {cards.map((c) => (
              <Link key={c.slug} href={`/consulta/${c.slug}`} className="ficha">
                <span className="cat">{c.categoria}</span>
                <h3>{c.titulo}</h3>
                <p>{c.resumo}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Concluir aulaId={aula.id} slug={aula.slug} concluida={!!prog?.concluida_em} proxima={proxima} />
    </article>
  );
}
