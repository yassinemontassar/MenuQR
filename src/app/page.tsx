
import Feature from "@/components/feature";
import Header from "@/components/header";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main>
      <Header />
       <div className="flex flex-col items-center justify-center py-3">
        <Hero />
        <Feature />
       </div> 
       </main>
  );
}
