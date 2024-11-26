"use client";
import Link from "next/link";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { motion } from "framer-motion";

const HeroSectionButton = () => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link href={"/global"}>
      <button
        onMouseEnter={e => setIsHover(true)}
        onMouseLeave={e => setIsHover(false)}
        className="relative flex flex-row w-fit h-12 items-center justify-between bg-white px-4 mt-3 
            border-none rounded-full overflow-clip"
      >
        <motion.p
          animate={{
            color: isHover ? "white" : "black"
          }}
          className="block font-satoshi font-medium z-20"
        >
          Get Started
        </motion.p>
        <motion.div
          animate={{
            scale: isHover ? 22 : 1
          }}
          transition={{
            duration: 0.15,
            ease: "easeIn"
          }}
          className="grid place-items-center ml-4 w-3 h-3 bg-black text-white rounded-full z-10"
        />
        <motion.div
          animate={{
            opacity: isHover ? 1 : 0
          }}
          className="absolute right-3 z-20"
        >
          <ArrowTopRightIcon className="w-6 h-6 text-white" />
        </motion.div>
      </button>
    </Link>
  );
};

export default HeroSectionButton;
