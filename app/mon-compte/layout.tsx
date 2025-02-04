// ...
import Header from "@/components/Header";
// ...
 
export default function CompteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}