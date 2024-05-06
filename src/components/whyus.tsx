"use client"
import { CheckIcon } from "lucide-react";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";

const Whyus = () => {
  const words = [
    {
      text: "Pourquoi",
      className:"text-2xl sm:text-4xl"
    },
    {
      text: "choisir",
      className:"text-2xl sm:text-4xl"
    },
    {
      text: "MenuRapide!",
      className: "text-3xl sm:text-5xl text-3xl underline text-orange-500 dark:text-orange-200",
    },
  ];
  return (
      <>
      <div  id="whyus" className="flex flex-col items-center justify-center overflow-hidden rounded-none">
      
      <TypewriterEffectSmooth  words={words}   />
      
    </div>
        <div
      className="max-w-screen-xl p-8 mt-8 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
     
    >       

        <div className="flex-1 space-y-6">
          <h1 className="text-2xl  font-bold leading-tight ">
            Suivez les nouvelles recommandations sanitaires.
          </h1>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <CheckIcon className="text-green-500" />
              <span>Sans contact : moins de risque.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckIcon className="text-green-500" />
              <span>Moins de papier : plus écolo.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckIcon className="text-green-500" />
              <span>Moins d&apos;encre : moins de produits chimiques néfastes pour la nature.</span>
            </li>
          </ul>
          <h2 className="text-2xl font-bold leading-tight ">Faites gagner du temps à vos équipes.</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <CheckIcon className="text-green-500" />
              <span>Vos équipes ne perdent plus de temps pour distribuer les menus ou les désinfecter.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckIcon className="text-green-500" />
              <span>Vos clients feront leur choix/commandes avant même l&apos;arrivée du serveur.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckIcon className="text-green-500" />
              <span>Vos équipes ont plus de temps pour conseiller les clients lors de la prise de commande.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckIcon className="text-green-500" />
              <span>Le temps moyen passé à table est réduit pour optimiser au maximum vos tables.</span>
            </li>
          </ul>
          <h2 className="text-2xl font-bold leading-tight ">Soyez libre et flexible dépensez moins.</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <CheckIcon  className="text-green-500" />
              <span>
                Finissez avec les contraintes financières ; changer la carte suivant les saisons ou les événements, vous
                n&apos;êtes plus obligé d&apos;imprimer tout un menu pour chaque nouvelle carte.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckIcon className="text-green-500" />
              <span>
                Adaptez vos offres et promotions en temps réel avec un accès direct et instantanée à votre menu via une
                interface dédiée.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckIcon className="text-green-500" />
              <span>Modifiez votre menu, vos articles, les ingrédients ou même les prix en quelques clics.</span>
            </li>
          </ul>
        </div>

      </div>
</>
  )
}

export default Whyus;