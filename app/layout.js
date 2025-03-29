import ClientLayout from "./ClientLayout"

export const metadata = {
  title: "Collaborative Drawing Board",
  description: "Real-time collaborative drawing board application",
  manifest: "/manifest.json",
  // themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "BoardCast",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
}

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>
}

