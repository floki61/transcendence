"use client"

import React from 'react'

interface BoxFormPros {
	result: string;
	color: string;
}

const BoxForm: React.FC<BoxFormPros> = ({
	result,
	color,
}) => {
  return (
	<div className={`${color} w-9 h-9 rounded-[10px] text-center text-2xl flex items-center justify-center 2xl:w-12 2xl:h-12 2xl:text-4xl`}>
		{result}
	</div>
  )
}


export default BoxForm;