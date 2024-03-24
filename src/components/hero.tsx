"use client"

import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { QrCode } from "lucide-react";


export default  function Herro() {
    return (
        <>
        <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
          <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
            <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
              <div className=" md:w-1/2">
                <h4 className="mb-4.5 text-lg font-medium text-black dark:text-white">
                    <div className="flex p-2 gap-2">
                  <QrCode className="text-orange-500" /> MenuRapide -  Créez Votre Menu en un Clic
                  </div>
                </h4>
            
                <p>
                MenuRapide - Doté de toutes les fonctionnalités essentielles pour simplifier la création de menus pour votre restaurant ou café. Interface intuitive, génération de code QR inclus, et plus encore.
                </p>
  
                <div className="mt-10">
                
                  <p className="mt-5 text-black dark:text-white">
                    <Button size="lg">
                        <Link href="/">
                        Commencer 
                        </Link>
                        </Button>
                  </p>
                </div>
              </div>
  
              <div className="animate_right hidden md:w-1/2 lg:block">
                <div className="relative 2xl:-mr-7.5">
                  <Image
                    src="/images/shape/shape-01.png"
                    alt="shape"
                    width={46}
                    height={246}
                    className="absolute -left-20 -top-20 animate-pulse"
                  />
                  <Image
                    src="/images/shape/shape-02.svg"
                    alt="shape"
                    width={36.9}
                    height={36.7}
                    className="absolute -bottom-10 right-0 z-10 animate-pulse"
                  />
                  <Image
                    src="/images/shape/shape-03.svg"
                    alt="shape"
                    width={21.64}
                    height={21.66}
                    className="absolute -right-6.5 -bottom-10 z-10 animate-pulse"
                  />
                  <div className=" relative aspect-[700/444] w-full">
                    <Image
                      className="shadow-solid-l rounded-md"
                      src="/images/hero/hero.jpg"
                      alt="Hero"
                      fill
                      priority
                    />
                
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>  
    );
  }