import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CarouselProps {
  slide: {
    title: string;
    text: string;
    image: string;
  }
}

export const Carousel: React.FC<CarouselProps> = ({slide}) => {

  return (
    <div>
      <h2>{slide.title}</h2>
      <Link
        href={"game?type=Live&mode=hidden"}
        className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
      >
        Play
      </Link>
    </div>
  );
};
