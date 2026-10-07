-- Correção do texto da aula 8.4 (sinal e compromisso)
-- Cole tudo no SQL Editor do Supabase e clique em "Run".

update public.aulas set essencial = $e$- **O sinal (arras) confirma o negócio.** É o valor pago no começo para mostrar que o acordo é sério. O Código Civil (arts. 417 a 420) define o que acontece se alguém desistir:
  - **Arras confirmatórias (a regra):** se quem pagou o sinal desistir, perde o valor. Se quem recebeu desistir, devolve o sinal mais o mesmo valor, ou seja, em dobro, com correção (art. 418). Pode haver ainda indenização por prejuízo maior.
  - **Arras penitenciais:** quando o contrato prevê expressamente o direito de arrependimento. Quem desiste perde o sinal ou devolve em dobro, e não há indenização além disso (art. 420).
- **Escreva qual é o tipo de sinal** e o que acontece em caso de desistência. Recibo vago gera disputa.
- **Antes de assinar, confira tudo.** Documentos do vendedor, do comprador e do imóvel, e as pesquisas e certidões em nome do vendedor (use o checklist da aula 2.3). Problema descoberto depois da assinatura vira briga. O módulo 9, Documentos, aprofunda cada caso.
- **O compromisso de compra e venda** é o contrato que formaliza o acordo até a escritura. Ele deve ter:
  - qualificação completa das partes e descrição do imóvel conforme a matrícula;
  - preço, forma e datas de pagamento;
  - condições, como a aprovação do financiamento, e o que acontece se ela não vier;
  - declarações do vendedor sobre dívidas, ações e problemas do imóvel;
  - prazo para a escritura e para a entrega da posse;
  - quem paga cada despesa;
  - multa por descumprimento e regras de desistência;
  - a comissão de corretagem (aula 7.3).
- **Um bom contrato protege os dois lados.** O comprador precisa de garantias (imóvel livre de dívidas, devolução do sinal se o banco negar sem culpa dele, escritura garantida). O vendedor precisa de segurança (sinal confirmatório, prazo para o financiamento, chaves só depois do pagamento, multa por atraso). O modelo em Material de apoio mostra quem cada cláusula protege.
- **Quem paga as despesas.** Pela regra geral, escritura e registro ficam com o comprador, e as despesas da entrega do imóvel com o vendedor (Código Civil, art. 490). Na prática, **o comprador paga ITBI, escritura e registro, e o vendedor paga as certidões e as dívidas do imóvel até a entrega**. Deixe escrito.
- **Quem faz o contrato.** Confirme se a imobiliária tem um setor específico para a confecção dos contratos e siga o processo dela. Em imóveis na planta, geralmente quem faz o contrato é a construtora. **Em qualquer caso, leia o contrato inteiro antes de repassar ao cliente para assinar**, com atenção especial à cláusula da comissão, e também aos prazos, à forma de pagamento, à correção e às regras de desistência.
- **Use modelos revisados por advogado** e, em negócios complexos, peça que um advogado redija o contrato.$e$
where slug = 'sinal-e-compromisso';

-- Conferência: deve mostrar "true"
select position('setor específico' in essencial) > 0 as atualizado from public.aulas where slug = 'sinal-e-compromisso';
