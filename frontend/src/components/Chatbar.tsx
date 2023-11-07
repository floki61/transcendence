"use client"

import Image from "next/image"

interface ChatProps {
  	name: string;
  	text: string;
	time: string;
	image: string;
	OnClick?(name: string, image: string, status: string): void;
}

const Chatbar:React.FC<ChatProps> = ({name, text, time, image, OnClick }) => {

	// const changeDisplay = () => {
	// 	// OnClick(name, image, "online");
	// 	console.log(name);
	// 	console.log(image);
	// }
	let msg;

	if (text.length > 30)
		msg = text.substring(0, 29) + "...";
	else
		msg = text;

	return (
	  <div className="w-5/6 flex justify-between border-b-2 border-primecl">
		  <div className="flex items-center gap-4 p-2">
			  <Image
				  src={image}
				  alt={"floki lherban"}
				  width={50}
				  height={50}
				  className="rounded-full"
			  />
			  <div className="flex flex-col justify-center">
				  <h2 className="text-xl">{name}</h2>
				  <p className="font-light">{msg}</p>
			  </div>
		  </div>
		  <p className="text-sm font-light pt-3">{time}</p>
	  </div>
	)
}

export default Chatbar;
