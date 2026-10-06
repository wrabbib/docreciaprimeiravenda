import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NOME_GUIA } from "@/lib/config";

export const metadata: Metadata = {
  title: { default: NOME_GUIA, template: `%s · ${NOME_GUIA}` },
  description: "O guia para quem acabou de tirar o CRECI: direitos, deveres, documentos, comissão e cada etapa da venda.",
};

export const viewport: Viewport = { themeColor: "#16233b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..800&family=Literata:opsz,wght@7..72,400..700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
