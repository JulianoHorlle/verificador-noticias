import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verificador de Notícias | Ponto de Checagem",
  description: "Verifique a veracidade de notícias com inteligência artificial e busca em tempo real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
