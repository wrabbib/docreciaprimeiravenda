"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function usuario() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function escolherCaminho(caminho: "imobiliaria" | "solo") {
  const { supabase, user } = await usuario();
  const { error } = await supabase.from("profiles").update({ caminho }).eq("id", user.id);
  if (error) throw new Error("Não foi possível salvar sua escolha. Tente de novo.");
  revalidatePath("/", "layout");
  redirect("/trilha");
}

export async function salvarChecklist(aulaId: string, marcados: number[]) {
  const { supabase, user } = await usuario();
  await supabase
    .from("progresso")
    .upsert(
      { user_id: user.id, aula_id: aulaId, checklist: marcados, atualizado_em: new Date().toISOString() },
      { onConflict: "user_id,aula_id" }
    );
}

export async function salvarQuiz(aulaId: string, acertos: number) {
  const { supabase, user } = await usuario();
  await supabase
    .from("progresso")
    .upsert(
      { user_id: user.id, aula_id: aulaId, acertos, atualizado_em: new Date().toISOString() },
      { onConflict: "user_id,aula_id" }
    );
}

export async function concluirAula(aulaId: string, slug: string, concluida: boolean) {
  const { supabase, user } = await usuario();
  await supabase.from("progresso").upsert(
    {
      user_id: user.id,
      aula_id: aulaId,
      concluida_em: concluida ? new Date().toISOString() : null,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: "user_id,aula_id" }
  );
  revalidatePath("/trilha");
  revalidatePath(`/aula/${slug}`);
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
