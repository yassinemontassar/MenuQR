"use client"
import LogoVPN from "@/assets/avatar.png";
import { QrCode } from "lucide-react";
import Image from "next/image";
import { FaInstagram, FaSquareFacebook } from "react-icons/fa6";
const Footer = () => {
  return (
    <div className=" pt-44 pb-24">
      <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
        <Image
            src="/images/gif/scan.gif"
            alt="gif"
            quality={100}
            height={50}
            width={50}
            className='rounded-xl'
          />
          <p className="mb-4 mt-4 ">
            <strong className="text-lg font-medium bg-gradient-to-r from-orange-600 to-orange-300 text-transparent bg-clip-text p-2 ">MenuRapide</strong> 
            La solution simple et rapide pour créer des menus dynamiques et générer des QR codes. Simplifiez la gestion de vos menus dès aujourdhui !
          </p>
          <div className="flex w-full mt-2 mb-8 -mx-2">
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <FaSquareFacebook className="h-6 w-6 text-blue-600 hover:text-blue-800"/>
            </div>
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <FaInstagram className="h-6 w-6 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-1" />
            </div>
          </div>
          <p className="text-gray-400">©{new Date().getFullYear()} - MenuRapide</p>
        </div>

      </div>
    </div>
  );
};

export default Footer;