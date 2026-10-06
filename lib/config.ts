// Chaves públicas do Supabase (seguras para o navegador; a proteção dos dados é feita pelas regras de acesso do banco).
// Podem ser sobrescritas por variáveis de ambiente no Vercel.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://pdzycpfnljjywvowmksa.supabase.co";

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_X8iCHwPUrSk5khx7WY79KQ_h0Ze1n7_";

export const NOME_GUIA = "Do CRECI à primeira venda";
