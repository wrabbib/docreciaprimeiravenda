"use client";

import { useState, useTransition } from "react";
import { salvarChecklist } from "@/lib/actions";

export default function Checklist({ aulaId, itens, marcadosIniciais }: { aulaId: string; itens: string[]; marcadosIniciais: number[] }) {
  const [marcados, setMarcados] = useState<number[]>(marcadosIniciais);
  const [, iniciar] = useTransition();

  function alternar(i: number) {
    const novo = marcados.includes(i) ? marcados.filter((x) => x !== i) : [...marcados, i];
    setMarcados(novo);
    iniciar(() => salvarChecklist(aulaId, novo));
  }

  return (
    <ul className="checklist">
      {itens.map((texto, i) => (
        <li key={i}>
          <label>
            <input type="checkbox" checked={marcados.includes(i)} onChange={() => alternar(i)} />
            <span>{texto}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
