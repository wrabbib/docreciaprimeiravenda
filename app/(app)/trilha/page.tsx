import Link from "next/link";
import { redirect } from "next/navigation";
import { NOME_CAMINHO, perfilAtual, type Caminho } from "@/lib/dados";

export const metadata = { title: "Trilha" };

type Aula = { id: string; slug: string; numero: string; titulo: string; ordem: number; minutos: number | null; caminho: string };
type Modulo = { id: string; slug: string; titulo: string; descricao: string | null; ordem: number; aulas: Aula[] };

export default async function Trilha() {
  const { supabase, user, perfil } = await perfilAtual();
  if (!perfil?.caminho) redirect("/");
  const caminho = perfil.caminho as Caminho;

  const [{ data: modulos }, { data: progresso }] = await Promise.all([
    supabase
      .from("modulos")
      .select("id, slug, titulo, descricao, ordem, aulas(id, slug, numero, titulo, ordem, minutos, caminho)")
      .order("ordem")
      .order("ordem", { referencedTable: "aulas" }),
    supabase.from("progresso").select("aula_id, concluida_em").eq("user_id", user.id),
  ]);

  const concluidas = new Set((progresso ?? []).filter((p) => p.concluida_em).map((p) => p.aula_id));
  const lista = ((modulos ?? []) as Modulo[]).map((m) => ({
    ...m,
    aulas: m.aulas.filter((a) => a.caminho === "ambos" || a.caminho === caminho),
  }));
  const total = lista.reduce((s, m) => s + m.aulas.length, 0);
  const feitas = lista.reduce((s, m) => s + m.aulas.filter((a) => concluidas.has(a.id)).length, 0);
  const pct = total ? Math.round((feitas / total) * 100) : 0;

  // primeiro módulo com aula pendente fica destacado
  const ativoId = lista.find((m) => m.aulas.some((a) => !concluidas.has(a.id)))?.id;

  return (
    <div className="pagina">
      <h1 className="titulo-pagina">Sua trilha</h1>
      <p className="sub">
        Seu caminho: {NOME_CAMINHO[caminho].toLowerCase()}. <Link href="/?trocar=1">Trocar caminho</Link>
      </p>

      <div className="progresso-geral">
        <div className="barra" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso na trilha">
          <i style={{ width: `${pct}%` }} />
        </div>
        <span>
          {feitas} de {total} {total === 1 ? "aula" : "aulas"}
        </span>
      </div>

      <ol className="trilha">
        {lista.map((m) => {
          const completo = m.aulas.length > 0 && m.aulas.every((a) => concluidas.has(a.id));
          const classe = ["modulo", completo ? "feito" : "", m.id === ativoId ? "ativo" : ""].join(" ");
          return (
            <li key={m.id} className={classe}>
              <span className="modulo-num" aria-hidden="true">
                {completo ? "✓" : m.ordem}
              </span>
              <h2>{m.titulo}</h2>
              {m.descricao && <p>{m.descricao}</p>}
              {m.aulas.length > 0 ? (
                <ul className="aulas">
                  {m.aulas.map((a) => {
                    const feita = concluidas.has(a.id);
                    return (
                      <li key={a.id} className={`aula-item${feita ? " concluida" : ""}`}>
                        <Link href={`/aula/${a.slug}`}>
                          <span className="n">{a.numero}</span>
                          <span className="t">{a.titulo}</span>
                          <span className="meta">{feita ? "Concluída" : a.minutos ? `${a.minutos} min` : ""}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="em-breve">Aulas em produção.</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
