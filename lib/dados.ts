import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Caminho = "imobiliaria" | "solo";

export async function perfilAtual() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: perfil } = await supabase
    .from("profiles")
    .select("id, nome, caminho, is_admin")
    .eq("id", user.id)
    .single();
  return { supabase, user, perfil };
}

export const NOME_CAMINHO: Record<Caminho, string> = {
  imobiliaria: "Numa imobiliária",
  solo: "Corretor solo",
};
