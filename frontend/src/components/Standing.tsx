"use client";

import React from 'react'
import Image from 'next/image';
import HistoryForm from './HistoryForm';

export interface BxForm {
	result: string;
	color: string;
}

interface StandingProps {
	place?: string;
	picture?: string;
	name?: string;
	mp?: string;
	wins?: string;
	losses?: string;
	level?: string;
	color: string;
}

const Standing: React.FC<StandingProps> = ({
	place,
	picture,
	name,
	mp,
	wins,
	losses,
	level,
	color = "",
}) => {

	let Win = {result: "W", color: "bg-[#00A83F]"};
	let Loss = {result: "L", color: "bg-[#DC0000]"};

	return (
	  <div className='h-[10%] flex items-center border-t-2 border-primecl'>
		  <div className='flex w-1/4 items-center justify-around pl-6 h-full'>
			  <div className={`${color} rounded-lg w-8 text-center flex items-center justify-center h-10`}>{place}</div>
			  <Image
				  src="/oel-berh.jpeg"
				  alt="player pic"
				  width={35}
				  height={35}
				  className='rounded-full'
			  />
			  <div className='pr-9'>playername</div>
		  </div>
		  <div className='w-1/2 h-full text-gray-200 flex items-center justify-evenly pl-10'>
			<p>42</p>
			<p>37</p>
			<p>5</p>
			<p>10</p>
		  </div>
		  <div className='w-1/4 h-full flex items-center justify-center'>
			<HistoryForm first={Win} second={Win} third={Win} fourth={Loss} fifth={Win}/>
		  </div>
	  </div>
	)
}

export default Standing;