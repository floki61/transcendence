import { userType } from '@/context/userContext'
import React from 'react'
import { Participant } from './Participant';

interface ChatFeaturesProps {
	users: userType[] | undefined;
	title: string;
	button?: string;
	checkbox: boolean;
}

export const ChatFeatures: React.FC<ChatFeaturesProps> = ({
	users,
	title,
	button,
	checkbox,
}) => {
  return (
	<div className='bg-segundcl rounded-lg h-full py-4 flex justify-center'>
	<section className='h-full w-1/2 flex flex-col rounded-md'>
	  <h2 className='h-[10%] flex items-center justify-center capitalize bg-primecl rounded-t-md'>{title}</h2>
	  <div className='flex-1 bg-terserocl overflow-scroll'>
		{users && users.map((user, index) => 
			<div key={index} className='h-[15%] border-b-2 border-primecl'>
			  <Participant
				name={user.userName}
				picture={user.picture}
				checkbox={checkbox}
			  />
			</div>
		)}
	  </div>
	  <div className='h-[10%] flex justify-center items-center bg-primecl rounded-b-md'>
		{button && (
			<button type='submit' className='border w-1/3 h-1/2 rounded-lg bg-segundcl cursor-pointer  transition ease-in-out delay-150 hover:scale-105 duration-300'>
			{button}
			</button>
		)}
	  </div>
	</section>
  </div>
  )
}
