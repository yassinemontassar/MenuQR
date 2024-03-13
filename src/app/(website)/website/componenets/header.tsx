import Link from "next/link";


export default async function Header() {
    return (
        <header className=" py-4 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/"
          className="text-2xl sm:text-3xl font-bold text-[#fa4a0c]" >
            MenuRapide 
          </Link>
          <button className="bg-[#fa4a0c] text-white px-2 py-2 rounded-full">Commencer</button>
        </div>
      </header>
    );
  }