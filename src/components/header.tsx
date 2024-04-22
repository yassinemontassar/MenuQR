
import SignInForm from "./SignInForm";
import Navbar from "./navbar";
import DropDown from "./DropDown";
import { auth } from "@/app/utils/auth";

export default async function Header() {
  const session = await auth()
    return (
        <header className="fixed  w-full  z-10  transition-all bg-background shadow-md p-4 pt-3">
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