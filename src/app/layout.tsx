import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme.provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  metadataBase: new URL('https://menu-qr-cycd.vercel.app/'),
  title: {
    default: 'MenuRapide - Créez Facilement le Menu de Votre Restaurant ou Café',
    template: '%s - MenuRapide - Créez Facilement le Menu de Votre Restaurant ou Café'
  },
  description:  'MenuRapide - Votre solution pour créer et personnaliser facilement les menus des restaurants et cafés. Concevez votre menu en ligne et mettez en valeur vos offres.',
  keywords: 'Créateur de menu, Créateur de menu de restaurant, Conception de menu de café, Créateur de menu en ligne, Conception de menu personnalisé, Panneau de menu numérique, Logiciel de conception de menu, Générateur de modèles de menu, Constructeur de menu de restaurant, Outil de personnalisation de menu, Outil de conception de menu, Logiciel de menu de restaurant, Créateur de menu de café, QR code menu',
  twitter: {
    card: 'summary_large_image'
  }, 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html > 
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        <Toaster />
        </ThemeProvider>
        </body>
    </html>
  );
}
