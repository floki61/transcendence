import React from 'react'
import Image from 'next/image';

interface ParticipantProps {
	name: string;
	picture: string;
	checkbox: boolean;
	selected: string[];
	SetSelected?(e: any): any;
	id: string;
	many: boolean;
	checked?: boolean;
	SetChecked?(e: string): any;
}

export const Participant: React.FC<ParticipantProps> = ({
	name,
	picture,
	checkbox,
	selected,
	SetSelected,
	id,
	many,
	checked,
	SetChecked,
}) => {

	
	// selected.shift();
	const handleCheckedBox = (userId: string) => {
		if (selected && SetSelected) {
			const isSelected = selected.includes(userId);
	
			// Update the selectedUsers array based on checkbox change
			SetSelected((prevSelected: any) => {
				if (isSelected) {
					// If user is already selected, remove them
					console.log("remove : ", selected);
					return prevSelected.filter((id: any) => id !== userId);
				} else {
					// If user is not selected, add them
				return [...prevSelected, userId];
			  }
			});
		}
	};

	const handleSingleSelection = (userId: string) => {
		if (selected && SetSelected && SetChecked) {
			SetChecked(userId);
			console.log("ana hna")
			SetSelected([userId]);
		}
	}
	console.log(many)
  return (
	<div className='flex items-center gap-6 h-full px-4'>
		<Image
			src={picture || "/placeholder.jpg"}
			alt={"user pic"}
			width={50}
			height={50}
			className="rounded-full aspect-square w-12 h-12 object-cover"
		/>
		<p className='text-white text-xl'>{name}</p>
		{checkbox && !many && (
			<input type='checkbox' checked={checked} className='ml-auto w-4 h-4' onChange={() => {handleSingleSelection(id)}}></input>
		)}
		{checkbox && many && (
			<input type='checkbox' className='ml-auto w-4 h-4' onChange={() => {handleCheckedBox(id)}}></input>
		)}
	</div>
  )
}
