"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DefinirSenha() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 8) return setErro("A senha precisa ter pelo menos 8 caracteres.");
    if (senha !== confirma) return setErro("As duas senhas não são iguais.");
    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: senha });
    setCarregando(false);
    if (error) {
      setErro("O link expirou ou já foi usado. Peça um novo na tela de entrada, em “Esqueci minha senha”.");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="login-wrap">
      <section className="login-lado">
        <h1 className="grande">
          Bem-vindo.
          <span className="seta">Crie sua senha.</span>
        </h1>
        <p>Você vai usar ela, junto com seu e-mail, para entrar no guia sempre que precisar.</p>
      </section>
      <form className="login-form" onSubmit={salvar}>
        <h2 className="titulo-pagina" style={{ fontSize: 28 }}>Sua senha</h2>
        <div className="campo">
          <label htmlFor="senha">Nova senha</label>
          <input id="senha" type="password" autoComplete="new-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="confirma">Repita a senha</label>
          <input id="confirma" type="password" autoComplete="new-password" required value={confirma} onChange={(e) => setConfirma(e.target.value)} />
        </div>
        {erro && <p className="aviso" role="alert">{erro}</p>}
        <button className="botao" type="submit" disabled={carregando}>
          {carregando ? "Salvando…" : "Salvar senha e entrar"}
        </button>
      </form>
    </div>
  );
}
