import { getServerSession } from "next-auth";
import SignInForm from "./SignInForm";
import Navbar from "./navbar";
import { authOptions } from "@/app/utils/auth";
import DropDown from "./DropDown";

export default async function Header() {
    const session = await getServerSession(authOptions);
    return (
        <header className="fixed  w-full  z-10  transition-all bg-background shadow-md pt-0">
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