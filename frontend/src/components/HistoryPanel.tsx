import { useFriend } from '@/hooks/useFriend';
import BoxForm from './BoxForm';
import { userType } from '@/context/userContext';
import Image from 'next/image';

interface HistoryPanelProps {
	user: userType | null | undefined;
	mode: string;
	index: number;
	opp: string;
	userScore: number;
	oppScore: number;
	winner: string;
	iter: number;
	SetIter(e: number): any;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
	user,
	mode,
	opp,
	userScore,
	oppScore,
	winner,
	iter,
	SetIter,
	index,
}) => {
	console.log("rah kandkhel")
	SetIter(index);

	let result, color, oppResult, oppColor;
	const {friend, SetFriend} = useFriend(opp);

	(winner === opp) ? result = "L" : result = "W";
	(winner === opp) ? color = "bg-[#DC0000]" : color = "bg-[#00A83F]";
	(winner === opp) ? oppResult = "W" : oppResult = "L";
	(winner === opp) ? oppColor = "bg-[#00A83F]" : oppColor = "bg-[#DC0000]";
	
	return (
		<div className='w-full h-full'>
			{friend && user && (
				<div className='w-full h-full flex items-center gap-8 border-b-4 border-primecl'>
					<h4 className='capitalize text-2xl text-center w-[20%]'>{mode} Mode</h4>
					<BoxForm  result={result} color={color}/>
					<Image
						src={user.picture || "/placeholder.jpg"}
						alt="user pic"
						height={75}
						width={75}
						className='rounded-full p-2'
					/>
					<div className='flex h-full w-[20%] items-center justify-evenly text-4xl'>
						<p>{userScore}</p>
						<p>Vs</p>
						<p>{oppScore}</p>
					</div>
					<Image
						src={friend.user.picture || "/placeholder.jpg"}
						alt="user pic"
						height={75}
						width={75}
						className='rounded-full p-2'
					/>
					<BoxForm result={oppResult} color={oppColor}/>
					<p className='text-3xl text-center w-[15%]'>{result === "W" ? "+" : "-"}50xp</p>
				</div>
			)}
		</div>
	)
}
