
import Footer from "@/components/Footer";
import Feature from "@/components/feature";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Pricing from "@/components/pricing";
import Whyus from "@/components/whyus";

export default async function Home() {
  return (
    
    <main>
      <Header />
       <div className="flex flex-col items-center justify-center ">
        <Hero />
        <Feature />
        <Whyus />
        <Pricing />
        <Footer />
       </div> 
       </main>
  );
}
