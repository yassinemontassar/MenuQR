
import Feature from "@/components/feature";
import Header from "@/components/header";
import HeaderTest from "@/components/headerTest";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main>
      <HeaderTest />
       <div className="flex flex-col items-center justify-center ">
        <Hero />
        <Feature />
       </div> 
       </main>
  );
}
