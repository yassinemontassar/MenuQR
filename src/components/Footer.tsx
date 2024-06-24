"use client";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaSquareFacebook } from "react-icons/fa6";
const Footer = () => {
  return (
    <div className=" pt-20 pb-20 border-t">
      <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-1 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
          <Image
            src="/images/gif/scan.gif"
            alt="gif"
            quality={100}
            height={50}
            width={50}
            priority
            className="rounded-xl"
            unoptimized
          />
          <p className="mb-4 mt-4 ">
            <strong className="text-lg font-medium bg-gradient-to-r from-orange-600 to-orange-300 text-transparent bg-clip-text ">
              MenuRapide{" "}
            </strong>
            La solution simple et rapide pour créer des menus dynamiques et
            générer des QR codes. Simplifiez la gestion de vos menus dès
            aujourdhui !
          </p>
          <div className="flex w-full mt-2 mb-8 -mx-2">
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <Link href="https://www.facebook.com/menu.rapide" target="_blank" aria-label="FaceBook">
                <FaSquareFacebook className="h-6 w-6 text-blue-600 hover:text-blue-800" />
              </Link>
            </div>
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <FaInstagram className="h-6 w-6 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-1" />
            </div>
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <Link
                href="mailto:menurapide600@gmail.com"
                target="_blank"
                aria-label="Email"
              >
                <Mail className="h-6 w-6  text-gray-600 hover:text-gray-800 rounded-2xl dark:text-gray-300" />
              </Link>
            </div>
          </div>
            ©{new Date().getFullYear()} - MenuRapide
            <Link href="https://www.menurapide.tn/terms"  className="text-blue-600 underline">
              Politique de Confidentialité
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
