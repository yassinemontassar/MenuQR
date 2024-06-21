
import { auth } from "@/app/utils/auth";
import DropDown from "./DropDown";
import SignInForm from "./SignInForm";
import Navbar from "./navbar";

export default async function Header() {
  const session = await auth()
    return (
      <header className="sticky z-[100] inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all p-4 pt-3 dark:bg-gray-800/20 dark:border-gray-700">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex-1">
            <Navbar />
          </div>
          <div className="flex-none">
            {session ? 
              <>
                <DropDown />
              </>
              : <SignInForm />}
          </div>
        </div>
      </header>
    );
  }