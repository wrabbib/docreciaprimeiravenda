import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { perfilAtual } from "@/lib/dados";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase } = await perfilAtual();
  const { data } = await supabase.from("cards").select("titulo").eq("slug", slug).single();
  return { title: data?.titulo ?? "Consulta" };
}

export default async function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase } = await perfilAtual();
  const { data: card } = await supabase
    .from("cards")
    .select("titulo, categoria, resumo, conteudo, tags, aulas(slug, numero, titulo)")
    .eq("slug", slug)
    .single();
  if (!card) notFound();

  const aula = card.aulas as unknown as { slug: string; numero: string; titulo: string } | null;

  return (
    <div className="pagina">
      <Link href="/consulta" className="voltar">
        ← Consulta
      </Link>
      <article className="card-detalhe">
        <span className="cat">{card.categoria}</span>
        <h1>{card.titulo}</h1>
        <p className="resumo">{card.resumo}</p>
        {card.conteudo && (
          <div className="leitura">
            <Markdown>{card.conteudo}</Markdown>
          </div>
        )}
        {card.tags?.length > 0 && (
          <div className="tags">
            {card.tags.map((t: string) => (
              <Link key={t} href={`/consulta?q=${encodeURIComponent(t)}`} className="tag">
                {t}
              </Link>
            ))}
          </div>
        )}
        {aula && (
          <Link href={`/aula/${aula.slug}`} className="link-aula">
            Ver a aula completa: {aula.numero} {aula.titulo}
          </Link>
        )}
      </article>
    </div>
  );
}
