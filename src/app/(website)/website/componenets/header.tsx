import Link from "next/link";


export default async function Header() {
    return (
        <header className=" py-4 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" 
           className="font-bold text-3xl bg-gradient-to-r from-orange-600 to-orange-300 text-transparent bg-clip-text hover:cursor-pointer ">
            MenuRapide 
          </Link>
        </div>
      </header>
    );
  }