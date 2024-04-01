"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import getScrollAnimation from "@/app/utils/getScrollAnimation";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { SessionProvider } from "next-auth/react";
import { PlanButton } from "./PlanButton";
import { Headset, PhoneCall } from "lucide-react";
import { FaQuestionCircle } from "react-icons/fa";

const Pricing = () => {
  const [selectedOption, setSelectedOption] = useState("monthly");
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);
  const buttonBaseStyles =
    "px-4 py-2 font-semibold  transition-colors duration-300";
  const buttonSelectedStyles =
    "bg-gradient-to-r from-orange-600 to-orange-300 border-orange-700 hover:from-orange-700 hover:to-orange-400";
  const buttonUnselectedStyles =
    "bg-gray-200 dark:bg-gray-600  hover:bg-gray-300 border-gray-400";
  const discount = 0.15; // 15% discount

  return (
    <div
      className="bg-gradient-to-b from-white-300 to-white-500 w-full py-14"
      id="pricing"
    >
      <div className="max-w-screen-xl  px-6 sm:px-8 lg:px-16 mx-auto flex flex-col w-full text-center justify-center">
        <div className="flex flex-col w-full">
          <ScrollAnimationWrapper>
            <motion.h3
              variants={scrollAnimation}
              className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black-600 leading-relaxed"
            >
              Choisissez votre forfait
            </motion.h3>
            <motion.p
              variants={scrollAnimation}
              className="leading-normal w-10/12 sm:w-7/12 lg:w-6/12 mx-auto my-2 text-center"
            >
              Choisissons le forfait qui vous convient le mieux et explorez-le
              joyeusement et avec entrain.
            </motion.p>
            <motion.div className="mt-9" variants={scrollAnimation}>
              <div className="flex flex-col items-center">
                <div className="flex">
                  <button
                    className={`${buttonBaseStyles} ${
                      selectedOption === "monthly"
                        ? buttonSelectedStyles
                        : buttonUnselectedStyles
                    } rounded-l-lg`}
                    onClick={() => setSelectedOption("monthly")}
                  >
                    Mensuel
                  </button>
                  <button
                    className={`${buttonBaseStyles} ${
                      selectedOption === "annually"
                        ? buttonSelectedStyles
                        : buttonUnselectedStyles
                    } rounded-r-lg`}
                    onClick={() => setSelectedOption("annually")}
                  >
                    Annuel
                  </button>
                </div>
                {selectedOption === "annually" && (
                  <span className="mt-2 inline-block px-3 py-1.5 text-base font-bold text-orange-600 bg-orange-200 rounded-full animate-pulse">
                    -15%
                  </span>
                )}
              </div>
            </motion.div>
          </ScrollAnimationWrapper>
          <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-12 py-8 lg:py-12 px-6 sm:px-0 lg:px-6">
            <SessionProvider>
              <ScrollAnimationWrapper className="flex justify-center">
                <motion.div
                  variants={scrollAnimation}
                  className="flex flex-col justify-center items-center border-2 border-gray-500 rounded-xl py-4 px-6 lg:px-12 xl:px-16"
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  <div className="p-4 lg:p-0 mt-6 lg:mt-16">
                    <Image
                      src="/images/pricing/Free.png"
                      width={145}
                      height={165}
                      alt="Free Plan"
                    />
                  </div>
                  <p className="text-lg text-black-600 font-medium capitalize my-2 sm:my-7">
                    Gratuit
                  </p>
                  <ul className="flex flex-col list-inside pl-6 xl:pl-0 items-start justify-start text-left text-black-500 flex-grow">
                    <li className="relative check custom-list my-2">
                      <div className="flex items-center gap-1">
                        Limité à un seul menu
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2" />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                            Vous pouvez créer un seul menu
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative check custom-list my-2">
                      <div className="flex items-center gap-1">
                        Limité à 6 catégories
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2" />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                            Vous pouvez ajouter jusquà 6 catégories dans votre
                            menu.
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative check custom-list my-2">
                      <div className="flex items-center gap-1">
                        Limité à 10 éléments
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2" />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                            Vous pouvez inclure jusquà 10 éléments dans chaque
                            catégorie de votre menu.
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative notcheck custom-list my-2">
                      <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <Headset /> Support 24/7
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2 " />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Assistance essentielle pour vous aider dans lutilisation quotidienne de nos services, offrant des réponses rapides à vos questions courantes.
                          </div>
                        </div>
                      </div>
                      </div>
                    </li>
                    <li className="relative notcheck custom-list my-2">
                      <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        Support téléphonique
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2 " />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Nos experts sont disponibles pour vous aider à créer lintégralité de votre menu par téléphone.
                          </div>
                        </div>
                      </div>
                      </div>
                    </li>
                    
                  </ul>

                  <div className="flex flex-col w-full justify-center mb-8 flex-none mt-12">
                    <p>Essai gratuit de 7 jours</p>
                  </div>
                </motion.div>
              </ScrollAnimationWrapper>
              <ScrollAnimationWrapper className="flex justify-center">
                <motion.div
                  variants={scrollAnimation}
                  className="flex flex-col justify-center items-center border-2 border-orange-700 rounded-xl py-4 px-6 lg:px-12 xl:px-16"
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  <div className="p-4 lg:p-0 mt-6 lg:mt-16">
                    <Image
                      src="/images/pricing/Standard.png"
                      width={145}
                      height={165}
                      alt="Standard Plan"
                    />
                  </div>
                  <p className="text-lg text-black-600 font-medium capitalize my-2 sm:my-7">
                    Standard{" "}
                  </p>
                  <ul className="flex flex-col list-inside pl-6 xl:pl-0 items-start justify-start text-left text-black-500 flex-grow">
                    <li className="relative check custom-list my-2">
                      <div className="flex items-center gap-1">
                      Limité à 2 menus
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2" />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Vous pouvez créer seulement 2 menus
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative check custom-list my-2">
                      <div className="flex items-center gap-1">
                        Limité à 15 catégories
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2" />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                            Vous pouvez ajouter jusquà 15 catégories dans votre
                            menu.
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative check custom-list my-2">
                      <div className="flex items-center gap-1">
                        Limité à 20 éléments
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2" />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                            Vous pouvez inclure jusquà 20 éléments dans chaque
                            catégorie de votre menu.
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative check custom-list my-2">
                      <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <Headset /> Support 24/7
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2 " />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Assistance essentielle pour vous aider dans lutilisation quotidienne de nos services, offrant des réponses rapides à vos questions courantes.
                          </div>
                        </div>
                      </div>
                      </div>
                    </li>
                    <li className="relative notcheck custom-list my-2">
                      <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        Support téléphonique
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2 " />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Nos experts sont disponibles pour vous aider à créer lintégralité de votre menu par téléphone.
                          </div>
                        </div>
                      </div>
                      </div>
                    </li>
                    
                  </ul>
                  <div className="flex flex-col w-full justify-center mb-8 flex-none mt-12">
                    <p className="text-2xl text-black-600 text-center mb-4 ">
                      {selectedOption === "monthly"
                        ? "30 TND / mois"
                        : `${30 * 12 * (1 - discount)} TND / an`}{" "}
                      {selectedOption === "annually" && (
                        <div>
                          <span className="text-sm text-orange-600">
                            (15% de réduction)
                          </span>
                        </div>
                      )}
                    </p>

                    <PlanButton type="Standard" period={selectedOption} />
                  </div>
                </motion.div>
              </ScrollAnimationWrapper>
              <ScrollAnimationWrapper className="flex justify-center">
                <motion.div
                  variants={scrollAnimation}
                  className="flex flex-col justify-center items-center border-2 border-gray-500 rounded-xl py-4 px-6 lg:px-12 xl:px-16"
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  <div className="p-4 lg:p-0 mt-6 lg:mt-18">
                    <Image
                      src="/images/pricing/Premium.png"
                      width={145}
                      height={165}
                      alt="Premium Plan"
                    />
                  </div>
                  <p className="text-lg text-black-600 font-medium capitalize my-2 sm:my-7">
                    Pro{" "}
                  </p>
                  <ul className="flex flex-col list-inside pl-6 xl:pl-0 items-start justify-start text-left text-black-500 flex-grow">
                    <li className="relative check custom-list my-2">
                      <div className="flex items-center gap-1">
                      Limité à 5 menus
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2" />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Vous pouvez créer seulement 5 menus
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative check custom-list my-2">
                      <div className="flex items-center gap-1">
                      Catégories illimitées
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2" />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Vous pouvez ajouter autant de catégories que nécessaire dans vos menus.
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative check custom-list my-2">
                      <div className="flex items-center gap-1">
                      Éléments illimités
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2" />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Vous pouvez inclure autant déléments que nécessaire dans chaque menu.
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="relative check custom-list my-2">
                      <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <Headset /> Support 24/7
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2 " />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Assistance essentielle pour vous aider dans lutilisation quotidienne de nos services, offrant des réponses rapides à vos questions courantes.
                          </div>
                        </div>
                      </div>
                      </div>
                    </li>
                    <li className="relative check custom-list my-2">
                      <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        Support téléphonique
                        <div className="group">
                          <FaQuestionCircle className="inline-block mb-2 " />
                          <div className="z-10 absolute hidden text-sm bg-gray-700 text-white px-2 py-1 rounded group-hover:block  whitespace-break-spaces">
                          Nos experts sont disponibles pour vous aider à créer lintégralité de votre menu par téléphone.
                          </div>
                        </div>
                      </div>
                      </div>
                    </li>
                  </ul>
                  <div className="flex flex-col w-full justify-center mb-8 flex-none mt-12">
                    <p className="text-2xl text-black-600 text-center mb-4 ">
                      {selectedOption === "monthly"
                        ? "80 TND / mois"
                        : `${80 * 12 * (1 - discount)} TND / an`}{" "}
                      {selectedOption === "annually" && (
                        <div>
                          <span className="text-sm text-orange-600">
                            (15% de réduction)
                          </span>
                        </div>
                      )}
                    </p>

                    <PlanButton type="Pro" period={selectedOption}  />
                  </div>
                </motion.div>
              </ScrollAnimationWrapper>
            </SessionProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
