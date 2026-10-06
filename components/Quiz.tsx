"use client";

import { useState } from "react";
import { salvarQuiz } from "@/lib/actions";

export type Pergunta = {
  id: string;
  pergunta: string;
  opcoes: { id: string; texto: string }[];
  correta: string;
  explicacao: string | null;
};

export default function Quiz({ aulaId, perguntas }: { aulaId: string; perguntas: Pergunta[] }) {
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [fim, setFim] = useState(false);

  const p = perguntas[indice];

  function responder(id: string) {
    if (escolha) return;
    setEscolha(id);
    if (id === p.correta) setAcertos((a) => a + 1);
  }

  function avancar() {
    if (indice + 1 < perguntas.length) {
      setIndice(indice + 1);
      setEscolha(null);
    } else {
      setFim(true);
      salvarQuiz(aulaId, acertos);
    }
  }

  function refazer() {
    setIndice(0);
    setEscolha(null);
    setAcertos(0);
    setFim(false);
  }

  if (fim) {
    const tudo = acertos === perguntas.length;
    return (
      <div className="quiz quiz-final" role="status">
        <div className="placar">
          {acertos}/{perguntas.length}
        </div>
        <p>{tudo ? "Tudo certo. Pode seguir." : "Vale reler o essencial e tentar de novo."}</p>
        <button className="botao botao-sec" onClick={refazer}>
          Refazer o teste
        </button>
      </div>
    );
  }

  const acertou = escolha === p.correta;

  return (
    <div className="quiz">
      <div className="quiz-topo">
        <span>
          Pergunta {indice + 1} de {perguntas.length}
        </span>
      </div>
      <h3>{p.pergunta}</h3>
      <div className="opcoes">
        {p.opcoes.map((o) => {
          let classe = "opcao";
          if (escolha) {
            if (o.id === p.correta) classe += " certa";
            else if (o.id === escolha) classe += " errada";
          }
          return (
            <button key={o.id} className={classe} disabled={!!escolha} onClick={() => responder(o.id)}>
              {o.texto}
            </button>
          );
        })}
      </div>
      {escolha && (
        <>
          <p className="explicacao" role="status">
            <b>{acertou ? "Isso mesmo. " : "Não é essa. "}</b>
            {p.explicacao}
          </p>
          <div className="quiz-acoes">
            <button className="botao" onClick={avancar}>
              {indice + 1 < perguntas.length ? "Próxima pergunta" : "Ver resultado"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
