import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export const Carousel = () => {

  // const [currentSlide, setCurrentSlide] = useState(0);

  // const slides = [
  //   {
  //     title: 'Live Mode',
  //     image: '/livemode.jpeg',
  //   },
  //   {
  //     title: 'Slide 2',
  //     image: 'url-to-image-2',
  //   },
  //   {
  //     title: 'Slide 3',
  //     image: 'url-to-image-3',
  //   },
  // ];

  // const handleSlideChange = (index) => {
  //   setCurrentSlide(index);
  // };


  return (
    <div className="h-full w-full flex gap-2">
      {/* <div className="w-1/3 flex flex-col items-center justify-between rounded-xl bg-gradient-to-t from-[#0B2931] from-0% to-[#000000] to-20%">
        <div className="flex justify-between w-full px-4">
          <Image
            src={"/livemode.jpeg"}
            alt="live mode"
            height={253}
            width={253}
          />
          <div className="flex flex-col justify-center items-center gap-2">
            <h2 className="">LIVE MODE</h2>
            <p className="text-sm px-2">Face random players around the globe, and prove that you are on the master of ping pong</p>
          </div>
        </div>
        <div className="w-full h-[30%] flex justify-center">
          <Link
            href={"game?type=Live&mode=simple"}
            className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
          >
            Play
          </Link>
        </div>
      </div>
      <div className="w-1/3 h-full flex flex-col items-center justify-between rounded-xl bg-gradient-to-t from-[#0B2931] from-0% to-[#000000] to-20%">
        <div className="flex justify-between w-full px-4">
          <Image
            src={"/reverse.png"}
            alt="reverse mode"
            height={190}
            width={190}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="">REVERSE MODE 2</h2>
            <p className="text-sm px-2">Bored of the default mode, why don't you try a game with different rules. Start a game to find out !!</p>
          </div>
        </div>
        <div className="flex h-[30%] justify-center w-full">
          <Link
            href={"game?type=Live&mode=reverse"}
            className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
          >
            Play
          </Link>
        </div>
      </div>
      <div className="w-1/3 h-full flex flex-col items-center justify-between rounded-xl bg-gradient-to-t from-[#0B2931] from-0% to-[#000000] to-20%">
        <div className="flex justify-between w-full">
          <Image
            src={"/blackhole.jpg"}
            alt="live mode"
            width={250}
            height={300}
            className="rounded-tl-xl"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="">HIDDEN MODE</h2>
            <p className="text-xs px-2">If you can't see it, this doesn't mean that it doesn't exist. Let's see if you can match a mode that challenge your senses</p>
          </div>
        </div>
        <div className="w-full h-[30%] flex justify-center">
          <Link
            href={"game?type=Live&mode=hidden"}
            className="border flex items-center justify-center border-white text-center rounded-3xl w-[30%] h-12 opacity-95 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)] transition ease-in-out delay-150 hover:scale-105 duration-300"
          >
            Play
          </Link>
        </div>
      </div> */}
      {/* {slides.map((slide, index) => (
        <div
          key={index}
          className={` ${index === currentSlide ? 'active' : ''}`}
          // style={{ backgroundImage: `url(${slide.image})` }}
        >
          <h2>{slide.title}</h2>
        </div>
      ))} */}
    </div>
  );
};
