import Header from "@/components/header";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main>
      <Header />
       <div className="flex items-center justify-center py-3">
        <Hero />
       </div>
       </main>
  );
}
