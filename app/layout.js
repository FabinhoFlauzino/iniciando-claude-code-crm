import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Manrope para textos; JetBrains Mono para números, contadores e etiquetas técnicas.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Meu CRM",
  description: "CRM para organizar contatos e oportunidades de negócio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
