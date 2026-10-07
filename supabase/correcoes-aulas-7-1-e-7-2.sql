-- Correções das aulas 7.1 e 7.2 (comissão)
-- Cole tudo no SQL Editor do Supabase e clique em "Run".

update public.aulas set
situacao = $s$Seu Mário pediu R$ 500 mil pela casa. A corretora anunciou por R$ 500 mil e, três semanas depois, fechou a venda exatamente por esse valor. Na hora de assinar, Seu Mário fez as contas e travou: "Eu disse que queria 500. Agora vou receber 470?" Ninguém tinha mostrado a ele, no dia da captação, quanto ficava para a comissão.$s$,
essencial = $e$- **Na venda de imóvel usado, a comissão geralmente é de 6%, paga pelo vendedor.** É ele quem contrata o corretor pela autorização de venda. A tabela de honorários do CRECI da sua região é a referência; sem nada combinado, vale o costume do lugar (Código Civil, art. 724).
- **Precifique o imóvel já mostrando a comissão.** Na captação, deixe claro para o proprietário quanto ele recebe de verdade:
  - Valor de venda: **R$ 500.000**
  - Comissão de 6%: **R$ 30.000**
  - Valor líquido para o vendedor: **R$ 470.000**
  - Se ele precisa receber R$ 500 mil líquidos, o preço de venda tem que ser outro. Essa conversa acontece antes de anunciar, nunca na hora de assinar.
- **A comissão é calculada sobre o valor efetivo da venda.** Se o imóvel for vendido por R$ 480 mil, a comissão é 6% de R$ 480 mil, ou seja, R$ 28.800, e o vendedor recebe R$ 451.200. Escreva isso na autorização.
- **Comissão paga pelo comprador, só se for combinado no início da negociação.** Por escrito, antes da proposta. Nunca como surpresa no fechamento.
- **Lançamentos e imóveis em construção: quem paga é a construtora**, geralmente **5%**. Se a construtora quiser repassar a comissão ao comprador, ele precisa ser informado antes, com o valor da comissão destacado do preço do imóvel (STJ, Tema 938).
- **Permuta com construtora (imóvel ou carro como parte do pagamento).** As construtoras normalmente pagam comissão **só sobre o valor que entra em dinheiro**, não sobre o imóvel ou o carro dado na permuta. Cobrar ou não uma comissão do comprador sobre esses bens é algo que o corretor combina em cada negociação, sempre por escrito e antes de fechar.
- **Permuta entre imóveis (troca).** Em geral, a comissão é devida **sobre cada imóvel negociado**. Em alguns negócios, combina-se pagar apenas a comissão do imóvel de maior valor. Quem paga cada parte também é acertado entre os envolvidos. Exemplo: uma casa de R$ 600 mil trocada por um apartamento de R$ 400 mil mais R$ 200 mil em dinheiro:
  - comissão sobre cada imóvel (6%): R$ 36.000 + R$ 24.000 = **R$ 60.000**;
  - comissão só sobre o de maior valor: **R$ 36.000**.
- **Regra de ouro:** quem paga, quanto e sobre qual valor, sempre por escrito, antes da primeira visita.$e$,
desfecho = $d$Seu Mário não estava errado: ninguém tinha feito a conta com ele. Se, no dia da captação, a corretora tivesse mostrado "R$ 500 mil de venda, R$ 30 mil de comissão, R$ 470 mil para o senhor", ele teria decidido o preço sabendo exatamente o que ia receber, e o fechamento seria só uma assinatura.$d$,
pratica = '["Na próxima captação, mostrar ao proprietário a conta: valor de venda, comissão e valor líquido","Escrever na autorização que a comissão incide sobre o valor efetivo da venda","Combinar por escrito, no início, se alguma parte da comissão será paga pelo comprador","Em lançamentos, confirmar com a construtora o percentual e o que acontece com as permutas","Em permutas, combinar por escrito antes de fechar como e sobre quais bens a comissão será paga"]'::jsonb,
missao = 'Pegue um imóvel da sua carteira e monte a conta para o proprietário: valor de venda, comissão de 6% e valor líquido. Depois, refaça a conta com um desconto de 4% no preço.'
where slug = 'calculo-da-comissao';

update public.quiz_perguntas q set pergunta = v.pergunta, opcoes = v.opcoes::jsonb, correta = v.correta, explicacao = v.explicacao
from (values
(1,'Imóvel usado vendido por R$ 500 mil, com 6% de comissão paga pelo vendedor. Quanto o vendedor recebe?',
 '[{"id":"a","texto":"R$ 500.000"},{"id":"b","texto":"R$ 470.000"},{"id":"c","texto":"R$ 494.000"},{"id":"d","texto":"R$ 530.000"}]','b',
 'R$ 500.000 menos R$ 30.000 de comissão. Mostre essa conta ao proprietário já na captação.'),
(2,'Num lançamento, quem normalmente paga a comissão do corretor?',
 '[{"id":"a","texto":"O comprador, sempre"},{"id":"b","texto":"A construtora, geralmente em torno de 5%"},{"id":"c","texto":"O banco que financia"},{"id":"d","texto":"Ninguém"}]','b',
 'Se a construtora repassar ao comprador, ele precisa ser informado antes, com o valor destacado (STJ, Tema 938).'),
(3,'O comprador dá um carro como parte do pagamento de um apartamento da construtora. Sobre o que a construtora costuma pagar comissão?',
 '[{"id":"a","texto":"Sobre o valor total, incluindo o carro"},{"id":"b","texto":"Só sobre o valor que entra em dinheiro"},{"id":"c","texto":"Só sobre o carro"},{"id":"d","texto":"Não paga comissão em permuta"}]','b',
 'Comissão sobre o carro ou imóvel da permuta é algo que o corretor combina, ou não, com o comprador, por escrito.')
) as v(ordem, pergunta, opcoes, correta, explicacao)
where q.ordem = v.ordem and q.aula_id = (select id from public.aulas where slug = 'calculo-da-comissao');

update public.aulas set essencial = replace(replace(replace(essencial,
  '  - corretor que captou, 20%: R$ 6.000;', '  - corretor que captou, 10%: R$ 3.000;'),
  '  - corretor que vendeu, 30%: R$ 9.000.', '  - corretor que vendeu, 40%: R$ 12.000.'),
  '- **Exemplo ilustrativo** (os percentuais variam de casa para casa).', '- **Exemplo de divisão** (cada imobiliária define a sua regra).')
where slug = 'divisao-da-comissao';

update public.quiz_perguntas set
  pergunta = 'Venda de R$ 500 mil, 6% de comissão. Com a divisão 50% imobiliária, 10% captação e 40% vendedor, quanto recebe o corretor que vendeu?',
  opcoes = '[{"id":"a","texto":"R$ 3.000"},{"id":"b","texto":"R$ 12.000"},{"id":"c","texto":"R$ 15.000"},{"id":"d","texto":"R$ 30.000"}]'::jsonb,
  correta = 'b',
  explicacao = '40% de R$ 30.000 = R$ 12.000. Se ele também captou, soma mais R$ 3.000.'
where aula_id = (select id from public.aulas where slug = 'divisao-da-comissao') and ordem = 1;

-- Conferência: as duas linhas devem mostrar "true"
select slug, position('R$ 470.000' in essencial) > 0 as atualizado from public.aulas where slug = 'calculo-da-comissao'
union all
select slug, position('40%: R$ 12.000' in essencial) > 0 from public.aulas where slug = 'divisao-da-comissao';
