"use client";

import getScrollAnimation from "@/app/utils/getScrollAnimation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { YouTubeEmbed } from "@next/third-parties/google";
import { motion } from "framer-motion";
import { VideoIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "./ui/button";
import heroImg from "/public/images/hero/hero.webp";
const Hero = ({
  listUser = [
    {
      name: "Profils",
      number: "22",
      icon: "/images/icon/heroicons_sm-user.svg",
    },
    {
      name: "Lieus",
      number: "20",
      icon: "/images/icon/gridicons_location.svg",
    },
    {
      name: "Menus",
      number: "6",
      icon: "/images/icon/menu-icon.svg",
    },
  ],
}) => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);
  return (
    <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto" id="about">
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className=" flex flex-col justify-center items-start row-start-2 sm:row-start-1">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-medium text-black-600 leading-normal">
              Créez Votre <strong>Menu</strong> en Quelques Clics
            </h1>

            <p className="text-black-500 mt-4 mb-6">
              Doté de toutes les fonctionnalités essentielles pour simplifier la
              création de menus pour votre restaurant ou café. Interface
              intuitive, génération de code QR inclus, et plus encore...
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-xl sm:text-2xl bg-gradient-to-r from-orange-600 to-orange-300 gap-2 ">
                  Regarder la Démo
                  <VideoIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Découvrez comment créer votre menu en quelques étapes
                    simples !{" "}
                  </DialogTitle>
                </DialogHeader>
                <div className="aspect-video">
                  <YouTubeEmbed
                    videoid="vSZNlyx7hgI"
                    params="controls=1"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex w-full">
            <motion.div className="h-full w-full">
              <Image
                src={heroImg}
                alt="logo_menurapide"
                placeholder="blur"
                priority={true}
                className="rounded-xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </div>
        </motion.div>
      <div className="relative w-full flex">
        <div className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 py-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-100 bg-white-500">
          {listUser.map((listUsers, index) => (
            <motion.div
              className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
              key={index}
              custom={{ duration: 2 + index }}
              variants={scrollAnimation}
            >
              <div className="flex mx-auto w-40 sm:w-auto">
                <div className="flex items-center justify-center bg-orange-100 w-12 h-12 mr-6 rounded-full">
                  <Image
                    alt="icon"
                    width="50"
                    height="50"
                    src={listUsers.icon}
                    className="h-6 w-6"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl text-black-600 font-bold">
                    {listUsers.number}+
                  </p>
                  <p className="text-lg text-black-500">{listUsers.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div
          className="absolute bg-black-600 opacity-5 w-11/12 roudned-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0"
          style={{ filter: "blur(114px)" }}
        ></div>
      </div>
    </div>
  );
};

export default Hero;
