"use client";
import getScrollAnimation from "@/app/utils/getScrollAnimation";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "./ui/button";
import light from "/public/votremenu.png";
import dark from "/public/votremenu_dark.png";

const features = [
  "QR Code Généré Automatiquement.",
  "Aperçu en Temps Réel sur Téléphone Mobile.",
  "Menu Responsive pour Tous les Écrans",
  "Interface Conviviale pour Remplir les Menus.",
];

const Feature = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);
  const {  theme } = useTheme()
  const logoToUse = theme === "dark" ? dark : light;
  return (
    <div
      className="max-w-screen-xl mt-8 mb-6 sm:mt-20 sm:mb-20 px-6 sm:px-8 lg:px-16 mx-auto"
      id="feature"
    >
      <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8 p  y-8 my-12">
        <div className="flex w-full justify-end">
          <motion.div
            className="-mt-10 w-full h-full"
            variants={scrollAnimation}
          >
            <div className="relative mx-auto border-gray-800 dark:border-gray-300 bg-gray-300 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] ">
              <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-300 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-300 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-300 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-300 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
              <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-300">
                <Image
                  src={logoToUse}
                  className="absolute lg:w-52 left-56 -top-24 select-none hidden sm:block lg:hidden xl:block"
                  alt=""
                />
                <iframe
                  name="deviceFrame"
                  className=" w-[282px] h-[572px]"
                  src="https://www.menurapide.tn/website/726f4840-01df-430f-b753-892af40a136c"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
        <div>
          <motion.div
            className="flex flex-col items-end justify-center ml-auto w-full lg:w-9/12"
            variants={scrollAnimation}
          >
            <h1 className="text-3xl lg:text-4xl font-medium leading-relaxed text-black-600">
              Nous offrons de nombreuses fonctionnalités
            </h1>
            <p className="my-2 text-black-500">
              Vous pouvez explorer ces fonctionnalités avec plaisir et chacune
              dentre elles possède ses propres fonctions.
            </p>
            <ul className="text-black-500 self-start list-inside ml-8">
              {features.map((feature, index) => (
                <motion.li
                  className="relative circle-check custom-list"
                  custom={{ duration: 2 + index }}
                  variants={scrollAnimation}
                  key={feature}
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            custom={{ duration: 4 }}
            className="flex flex-col items-center justify-center p-6 "
            variants={scrollAnimation}
          >
            <Button className="text-xl sm:text-2xl bg-gradient-to-r from-orange-600 to-orange-300 gap-2 ">
              <Link href="https://www.menurapide.tn/website/726f4840-01df-430f-b753-892af40a136c">
                Aperçu en direct
              </Link>
              <Star />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
