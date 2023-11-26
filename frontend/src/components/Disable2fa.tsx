"use client"

import React from 'react'
import Button from './Button';
import axios from 'axios';

interface Disable2faProps {
	state: boolean;
	OnClick(e: boolean): any;
}

const Disable2fa : React.FC<Disable2faProps> = ({
	state,
	OnClick,
}) => {

	const handleQrCode = () => {
		OnClick(!state);
	}

	const turnOff = async () => {
		try {
			await axios.post("http://10.12.1.6:4000/2fa/turn-off", 0, {
					withCredentials: true,
				});
			} catch (error) {
			}
		};

	const handleDisable = () => {
		turnOff();
		handleQrCode();
	}

	return (
		<div className='h-full'>
			{state && (
				<div className="flex flex-col justify-center items-center gap-16 border-2 border-quatrocl absolute top-[20%] left-1/3 w-1/3 h-2/3 bg-segundcl rounded-lg text-primecl">
					<div>
						<h2 className='text-center text-white text-xl px-3'>Two Factor Authentication improves the security of your account, to turn it off click on <span className='text-red-700'>Disable</span> .</h2>
					</div>
					<div className="flex justify-center items-center gap-4 w-full">
				 		<Button
				 			text="Cancel"
				 			className=" text-primecl rounded-3xl w-1/3 p-2 h-12 opacity-80 cursor-pointer bg-white shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]  transition ease-in-out delay-150 hover:scale-105 duration-300"
				 			onClick={handleQrCode}
				 		/>
				 		<button
				 			className="text-white rounded-3xl w-1/3 p-2 h-12 opacity-80 cursor-pointer bg-red-700 shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]  transition ease-in-out delay-150 hover:scale-105 duration-300"
				 			onClick={handleDisable}
				 		> Disable </button>
					</div>
				</div>
			)}
		</div>
	)
}


export default Disable2fa