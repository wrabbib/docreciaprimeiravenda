"use client";

import { useTransition } from "react";
import { escolherCaminho } from "@/lib/actions";

const OPCOES = [
  {
    id: "imobiliaria" as const,
    titulo: "Numa imobiliária",
    texto: "Você vai atuar junto com uma equipe, usando a estrutura e a carteira de imóveis de uma empresa.",
    itens: ["Contrato de corretor associado", "Como funciona a divisão de comissão", "O que é seu e o que é da imobiliária"],
  },
  {
    id: "solo" as const,
    titulo: "Corretor solo",
    texto: "Você vai trabalhar por conta própria, cuidando de tudo: captação, documentos, contratos e marketing.",
    itens: ["CNPJ e registro da empresa no CRECI", "Ferramentas e contratos próprios", "A quem recorrer quando der problema"],
  },
];

export default function EscolhaCaminho({ atual }: { atual: string | null }) {
  const [pendente, iniciar] = useTransition();

  return (
    <div className="caminhos">
      {OPCOES.map((o) => (
        <button
          key={o.id}
          className="caminho"
          disabled={pendente}
          onClick={() => iniciar(() => escolherCaminho(o.id))}
          aria-pressed={atual === o.id}
          style={atual === o.id ? { borderColor: "var(--selo)" } : undefined}
        >
          <h2>{o.titulo}</h2>
          <p>{o.texto}</p>
          <ul>
            {o.itens.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </button>
      ))}
    </div>
  );
}
