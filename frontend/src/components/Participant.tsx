import React from 'react'
import Image from 'next/image';

interface ParticipantProps {
	name: string;
	picture: string;
}

export const Participant: React.FC<ParticipantProps> = ({
	name,
	picture,
}) => {
  return (
	<div className='flex items-center gap-6 h-full px-4'>
		<Image
			src={picture || "/placeholder.jpg"}
			alt={"user pic"}
			width={50}
			height={50}
			className='rounded-full'
		/>
		<p className='text-white text-xl'>{name}</p>
		<input type='checkbox' className='ml-auto w-4 h-4'></input>
	</div>
  )
}
