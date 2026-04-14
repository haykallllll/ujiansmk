import './globals.css';

export const metadata = {
  title: 'SMK Prima Unggul - Online Exam',
  description: 'Aplikasi Ujian Online SMK Prima Unggul',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
