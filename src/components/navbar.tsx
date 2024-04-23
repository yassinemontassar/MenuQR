"use client";
import { Popover } from "@headlessui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Link as LinkScroll } from "react-scroll";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("");
  const [scrollActive, setScrollActive] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);
  return (
    <div>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between  lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <span className="sr-only"></span>
          <Link
            href={"/"}
            className="font-bold text-xl sm:text-3xl bg-gradient-to-r from-orange-600 to-orange-300 text-transparent bg-clip-text hover:cursor-pointer "
          >
            MenuRapide
          </Link>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <LinkScroll
            activeClass="active"
            to="about"
            spy={true}
            smooth={true}
            duration={1000}
            onSetActive={() => {
              setActiveLink("about");
            }}
            className={
              "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
              (activeLink === "about"
                ? " text-orange-500 animation-active "
                : " text-black-500 hover:text-orange-500 a")
            }
          >
            À propos
          </LinkScroll>
          <LinkScroll
            activeClass="active"
            to="feature"
            spy={true}
            smooth={true}
            duration={1000}
            onSetActive={() => {
              setActiveLink("feature");
            }}
            className={
              "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
              (activeLink === "feature"
                ? " text-orange-500 animation-active "
                : " text-black-500 hover:text-orange-500 ")
            }
          >
            Fonctionnalités
          </LinkScroll>
          <LinkScroll
            activeClass="active"
            to="pricing"
            spy={true}
            smooth={true}
            duration={1000}
            onSetActive={() => {
              setActiveLink("pricing");
            }}
            className={
              "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
              (activeLink === "pricing"
                ? " text-orange-500 animation-active "
                : " text-black-500 hover:text-orange-500 ")
            }
          >
            Tarification
          </LinkScroll>
          {/* <LinkScroll
            activeClass="active"
            to="testimoni"
            spy={true}
            smooth={true}
            duration={1000}
            onSetActive={() => {
              setActiveLink("testimoni");
            }}
            className={
              "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
              (activeLink === "testimoni"
                ? " text-orange-500 animation-active "
                : " text-black-500 hover:text-orange-500 ")
            }
          >
            Témoignages
          </LinkScroll> */}
        </Popover.Group>
        <div className=" lg:flex lg:mr-0 lg:flex-1 lg:justify-end mr-5">
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
