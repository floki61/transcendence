"use client"

import React from 'react'
import Image from 'next/image'
import Button from './Button'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface QrcodeProps {
	state: boolean;
	OnClick(e: boolean): any;
}

const QrcodeDiv: React.FC<QrcodeProps> = ({
	state,
	OnClick,
}) => {

	const [qrcode, setQrCode] = useState<string>();

	useEffect(() => {
	  const fetchData = async () => {
		try {
		  const res = await axios.get("http://localhost:4000/2fa/generate", {
			withCredentials: true,
		  });
		  console.log("qrcode :" ,res.data);
		  setQrCode(res.data);
		} catch (error) {
		  console.error(error);
		}
	  };
  
	  fetchData();
	}, []);

	const sendQrCode = async () => {

	if (input.length === 6) {
		try {
			await axios.post("http://localhost:4000/2fa/turn-on",
				{twoFactorAuthenticationCode: input} , {
				withCredentials: true,
				}); // backend API endpoint
			} catch (error) {
				console.error("error a turning on 2fa");
			}
		}
		else
		  console.log("rah masiftch")
	};

	  const [input, setInput] = useState('');

	  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Ensure that the value is a 6-digit number
		if (Number(value) || value === "" || value === '0') {
		  setInput(value);
		}
	  };

	  const handleQrCode = () => {
		OnClick(!state);
	  }

	return (
		<div className='h-full'>
			{state && (
				<div className="flex flex-col justify-around items-center border-2 border-quatrocl absolute top-[20%] left-1/3 w-1/3 h-2/3 bg-segundcl rounded-lg text-primecl">
					{qrcode && (
						<Image 
							src={qrcode as string}
							alt="qrCode"
							width={200}
							height={200}
						/>
					)}
					<div className="flex flex-col justify-center items-center w-1/2">
				 		<input className="text-center py-2 w-full h-10 rounded-md outline-quatrocl" type="text" maxLength={6} onChange={handleInputChange} value={input}/>
					</div>
					<div className="flex justify-center items-center gap-4 w-full">
				 		<Button
				 			text="Cancel"
				 			className=" text-primecl rounded-3xl w-1/3 p-2 h-12 opacity-80 cursor-pointer bg-white shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]  transition ease-in-out delay-150 hover:scale-105 duration-300"
				 			onClick={handleQrCode}
				 		/>
				 		<Button
				 			text="Send"
				 			className="border border-white text-white rounded-3xl w-1/3 p-2 h-12 opacity-80 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]  transition ease-in-out delay-150 hover:scale-105 duration-300"
				 			onClick={sendQrCode}
				 		/>
					</div>
				</div>
			)}
		</div>
	);

};

export default QrcodeDiv;