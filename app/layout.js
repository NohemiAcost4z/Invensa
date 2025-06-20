export default function GeneralLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

export const metadata = {
  title: {
    template: '%s | Invensa',
    default: 'Invensa',
  },
  description: 'Gestión de inventario',
  generator: 'Next.js',
  applicationName: 'Invensa',
  referrer: 'origin-when-cross-origin',
  keywords: ['Gestión', 'Inventario', 'Belleza', 'Maquillaje', 'Cosméticos'],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  cathegory: "management",
}