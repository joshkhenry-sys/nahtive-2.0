import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nahtive — Learn Spanish. Actually use it.",
  description: "A structured Spanish course built for real conversations, confident sentence-building, and lasting progress.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
