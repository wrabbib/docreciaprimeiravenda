"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  // Links de convite/nova senha no formato antigo chegam com a sessão no "#" da URL.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    const tipo = hash.get("type");
    if (new URLSearchParams(window.location.search).get("erro") === "link") {
      setErro("Esse link expirou ou já foi usado. Peça um novo.");
    }
    if (hash.get("error_description")) {
      setErro("Esse link expirou ou já foi usado. Peça um novo convite ou use “Esqueci minha senha”.");
      return;
    }
    if (!access_token || !refresh_token) return;
    createClient()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) return setErro("Esse link expirou ou já foi usado. Peça um novo.");
        window.history.replaceState(null, "", window.location.pathname);
        router.replace(tipo === "invite" || tipo === "recovery" ? "/definir-senha" : "/");
        router.refresh();
      });
  }, [router]);
  const [ok, setOk] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setOk(null);
    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) {
      setErro("E-mail ou senha não conferem. Confira e tente de novo.");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  async function esqueci() {
    setErro(null);
    setOk(null);
    if (!email) {
      setErro("Digite seu e-mail no campo acima para receber o link de nova senha.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/definir-senha`,
    });
    if (error) setErro("Não foi possível enviar o e-mail agora. Tente de novo em alguns minutos.");
    else setOk("Se esse e-mail tiver acesso, você vai receber um link para criar uma nova senha.");
  }

  return (
    <div className="login-wrap">
      <section className="login-lado">
        <h1 className="grande">
          Do CRECI
          <span className="seta">à primeira venda</span>
        </h1>
        <p>O guia do corretor de imóveis: tudo que você precisa saber, de direitos e deveres a documentos, comissão e cada etapa da venda.</p>
      </section>
      <form className="login-form" onSubmit={entrar}>
        <h2 className="titulo-pagina" style={{ fontSize: 28 }}>Entrar</h2>
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        {erro && <p className="aviso" role="alert">{erro}</p>}
        {ok && <p className="aviso aviso-ok" role="status">{ok}</p>}
        <button className="botao" type="submit" disabled={carregando}>
          {carregando ? "Entrando…" : "Entrar"}
        </button>
        <button type="button" className="botao botao-sec" onClick={esqueci}>
          Esqueci minha senha
        </button>
      </form>
    </div>
  );
}
