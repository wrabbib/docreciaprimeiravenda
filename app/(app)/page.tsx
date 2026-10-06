import { redirect } from "next/navigation";
import { perfilAtual } from "@/lib/dados";
import EscolhaCaminho from "@/components/EscolhaCaminho";

export default async function Inicio({ searchParams }: { searchParams: Promise<{ trocar?: string }> }) {
  const { perfil } = await perfilAtual();
  const { trocar } = await searchParams;
  if (perfil?.caminho && !trocar) redirect("/trilha");

  const primeiroNome = perfil?.nome?.split(" ")[0];

  return (
    <div className="pagina">
      <h1 className="titulo-pagina">{primeiroNome ? `${primeiroNome}, onde você vai começar?` : "Onde você vai começar?"}</h1>
      <p className="sub">
        A base é a mesma para todo corretor, mas algumas aulas mudam conforme o seu caminho. Você pode trocar depois.
      </p>
      <EscolhaCaminho atual={perfil?.caminho ?? null} />
    </div>
  );
}
