import Link from "next/link";
import { perfilAtual } from "@/lib/dados";

export const metadata = { title: "Consulta" };

type Busca = { q?: string; cat?: string };

function limpar(texto: string) {
  return texto.replace(/[,()%*\\:]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

export default async function Consulta({ searchParams }: { searchParams: Promise<Busca> }) {
  const { q = "", cat = "" } = await searchParams;
  const { supabase } = await perfilAtual();
  const termo = limpar(q);

  let consulta = supabase.from("cards").select("slug, titulo, categoria, resumo").order("titulo");
  if (cat) consulta = consulta.eq("categoria", cat);
  if (termo) {
    consulta = consulta.or(
      `titulo.ilike.%${termo}%,resumo.ilike.%${termo}%,conteudo.ilike.%${termo}%,busca.wfts(portuguese).${termo}`
    );
  }

  const [{ data: cards }, { data: todas }] = await Promise.all([consulta, supabase.from("cards").select("categoria")]);
  const categorias = Array.from(new Set((todas ?? []).map((c) => c.categoria))).sort();

  const link = (c: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (c) p.set("cat", c);
    const s = p.toString();
    return s ? `/consulta?${s}` : "/consulta";
  };

  return (
    <div className="pagina-larga">
      <h1 className="titulo-pagina">Consulta</h1>
      <p className="sub">O essencial de cada assunto, para quando você precisar lembrar no meio de uma negociação.</p>

      <form className="busca" action="/consulta" role="search">
        {cat && <input type="hidden" name="cat" value={cat} />}
        <label htmlFor="q" className="sr-only" style={{ position: "absolute", left: -9999 }}>
          Buscar na consulta
        </label>
        <input id="q" name="q" type="search" defaultValue={q} placeholder="Busque por anuidade, matrícula, comissão…" />
        <button className="botao" type="submit">
          Buscar
        </button>
      </form>

      {categorias.length > 1 && (
        <nav className="filtros" aria-label="Categorias">
          <Link href={link("")} className="filtro" aria-current={!cat ? "true" : undefined}>
            Todas
          </Link>
          {categorias.map((c) => (
            <Link key={c} href={link(c)} className="filtro" aria-current={cat === c ? "true" : undefined}>
              {c}
            </Link>
          ))}
        </nav>
      )}

      {cards && cards.length > 0 ? (
        <div className="grade-cards">
          {cards.map((c) => (
            <Link key={c.slug} href={`/consulta/${c.slug}`} className="ficha">
              <span className="cat">{c.categoria}</span>
              <h3>{c.titulo}</h3>
              <p>{c.resumo}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="vazio">
          {termo ? (
            <>
              Nada encontrado para “{q}”. Tente outra palavra ou <Link href="/consulta">veja todos os cards</Link>.
            </>
          ) : (
            "Os cards de consulta aparecem aqui conforme as aulas são publicadas."
          )}
        </div>
      )}
    </div>
  );
}
