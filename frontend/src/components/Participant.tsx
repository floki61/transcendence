import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface ParticipantProps {
	name: string;
	picture: string;
	checkbox: boolean;
	button?: boolean;
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
	button,
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

	const Challenge = async () => {
		try {
			const res = await axios.post("http://localhost:4000/sendPlaydRequest", {friendId: id}, {
				withCredentials: true,
			});
			console.log("success Challenge");
		} catch (error) {
			console.log("Challenge failed", error);
		}
	}

	const handleSingleSelection = (userId: string) => {
		if (selected && SetSelected && SetChecked) {
			SetChecked(userId);
			console.log("ana hna")
			SetSelected([userId]);
		}
	}
	console.log(many)
  return (
	<div className='flex items-center justify-between gap-6 h-full px-4'>
		<div className='flex items-center gap-3'>
			<Image
				src={picture || "/placeholder.jpg"}
				alt={"user pic"}
				width={50}
				height={50}
				className="rounded-full aspect-square w-12 h-12 object-cover"
			/>
			<p className='text-white text-xl'>{name}</p>
		</div>
		{button && (
			<div className='flex items-center justify-between gap-3 w-1/2 h-full text-sm'>
				<Link href={`/${id}`} as={`/${id}`} className='border w-1/2 flex justify-center items-center rounded-lg bg-primecl h-1/2'>View Profile</Link>
				<button className='w-1/2 rounded-lg bg-primecl h-1/2 border' onClick={Challenge}>Challenge</button>
			</div>
		)}
		{checkbox && !many && (
			<input type='checkbox' checked={checked} className='ml-auto w-4 h-4' onChange={() => {handleSingleSelection(id)}}></input>
		)}
		{checkbox && many && (
			<input type='checkbox' className='ml-auto w-4 h-4' onChange={() => {handleCheckedBox(id)}}></input>
		)}
	</div>
  )
}
