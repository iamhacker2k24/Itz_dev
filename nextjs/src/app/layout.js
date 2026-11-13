import "./globals.css";

export const metadata = {
  title: "Hi I am Debabrata Paul, Thanks For visiting my website",
  description: "Debabrata Paul — a passionate developer skilled in Web Development, App Development, IoT, and UI/UX Design.",
  icons: {
    icon: "/favicon.png",
  },
  verification: {
    google: "ygKQftjbPqNJXI6WYUHM0KhY1EPXZsHEBjpusZ-Ppg4",
  },
  openGraph: {
    title: "Debabrata Paul | Software Engineer",
    description: "Software Engineer skilled in Web Development, App Development, IoT, and Gen AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Debabrata Paul | Software Engineer",
    description: "Software Engineer skilled in Web Development, App Development, IoT, and Gen AI.",
  },
  other: {
    "darkreader-lock": "true",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased selection:bg-orange-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
