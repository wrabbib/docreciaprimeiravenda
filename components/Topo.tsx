"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sair } from "@/lib/actions";

function Selo() {
  return (
    <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="26" fill="none" stroke="#7fc2a8" strokeWidth="6" />
      <path d="M21 33l8 8 15-17" fill="none" stroke="#7fc2a8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Topo() {
  const path = usePathname();
  const atual = (p: string) => (path === p || path.startsWith(p + "/") ? "page" : undefined);
  const naTrilha = path === "/trilha" || path.startsWith("/aula/") ? "page" : undefined;

  return (
    <header className="topo">
      <div className="topo-inner">
        <Link href="/trilha" className="marca" aria-label="Início">
          <Selo />
          <span>Do CRECI à primeira venda</span>
        </Link>
        <nav className="nav" aria-label="Principal">
          <Link href="/trilha" aria-current={naTrilha}>
            Trilha
          </Link>
          <Link href="/consulta" aria-current={atual("/consulta")}>
            Consulta
          </Link>
          <form action={sair}>
            <button type="submit">Sair</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
