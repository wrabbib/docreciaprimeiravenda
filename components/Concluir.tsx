"use client";

import Link from "next/link";
import { useTransition } from "react";
import { concluirAula } from "@/lib/actions";

type Proxima = { slug: string; numero: string; titulo: string } | null;

export default function Concluir({ aulaId, slug, concluida, proxima }: { aulaId: string; slug: string; concluida: boolean; proxima: Proxima }) {
  const [pendente, iniciar] = useTransition();

  return (
    <div className="concluir">
      {concluida ? (
        <>
          <span className="concluida-selo">✓ Aula concluída</span>
          {proxima ? (
            <Link href={`/aula/${proxima.slug}`} className="botao">
              Ir para a aula {proxima.numero}
            </Link>
          ) : (
            <Link href="/trilha" className="botao">
              Voltar para a trilha
            </Link>
          )}
          <button className="botao botao-sec" disabled={pendente} onClick={() => iniciar(() => concluirAula(aulaId, slug, false))}>
            Desmarcar
          </button>
        </>
      ) : (
        <button className="botao botao-selo" disabled={pendente} onClick={() => iniciar(() => concluirAula(aulaId, slug, true))}>
          {pendente ? "Salvando…" : "Marcar aula como concluída"}
        </button>
      )}
    </div>
  );
}
