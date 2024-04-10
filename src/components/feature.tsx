"use client";
import Image from "next/image";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import getScrollAnimation from "@/app/utils/getScrollAnimation";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
const features = [
  "QR Code Généré Automatiquement.",
  "Aperçu en Temps Réel sur Téléphone Mobile.",
  "Menu Responsive pour Tous les Écrans",
  "Interface Conviviale pour Remplir les Menus.",
];

const Feature = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div
      className="max-w-screen-xl mt-8 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
      id="feature"
    >
      <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8 p  y-8 my-12">
        <ScrollAnimationWrapper className="flex w-full justify-end">
          <motion.div className="h-full w-full p-4" variants={scrollAnimation}>
            <Image
              src="/images/feature/Illustration2.png"
              alt="feature_logo"
              quality={100}
              height={414}
              width={508}
            />
          </motion.div>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <motion.div
            className="flex flex-col items-end justify-center ml-auto w-full lg:w-9/12"
            variants={scrollAnimation}
          >
            <h3 className="text-3xl lg:text-4xl font-medium leading-relaxed text-black-600">
              Nous offrons de nombreuses fonctionnalités
            </h3>
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
            <Link href="https://menu-qr-cycd.vercel.app/website/726f4840-01df-430f-b753-892af40a136c">
            Aperçu en direct
          </Link>
            <Star />
            </Button>
          </motion.div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
};

export default Feature;
