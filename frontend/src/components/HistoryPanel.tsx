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
	loser: string;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
	user,
	mode,
	opp,
	userScore,
	oppScore,
	winner,
	loser,
	index,
}) => {

	let result, color, oppResult, oppColor, lScore, rScore;
	(winner === user?.id) ? opp = loser : opp = winner;
	const {friend, SetFriend} = useFriend(opp);

	(loser === user?.id) ? result = "L" : result = "W";
	(loser === user?.id) ? color = "bg-[#DC0000]" : color = "bg-[#00A83F]";
	(loser === user?.id) ? oppResult = "W" : oppResult = "L";
	(loser === user?.id) ? oppColor = "bg-[#00A83F]" : oppColor = "bg-[#DC0000]";
	if (userScore < oppScore) {
		(loser === user?.id) ? lScore = userScore : lScore = oppScore;
		(loser === user?.id) ? rScore = oppScore : rScore = userScore;
	}
	if (userScore > oppScore) {
		(loser !== user?.id) ? lScore = userScore : lScore = oppScore;
		(loser !== user?.id) ? rScore = oppScore : rScore = userScore;
	}
	
	if (index < 4) {
		return (
			<div className='w-full h-full'>
				{friend && user && (
					<div className={`${index != 3 ? "border-b-4 border-primecl" : ""} w-full h-full flex items-center gap-8`}>
						<h4 className='capitalize text-2xl text-center w-[20%]'>{mode} Mode</h4>
						<BoxForm  result={result} color={color}/>
						<Image
							src={user.picture || "/placeholder.jpg"}
							alt="user pic"
							height={75}
							width={75}
							className='rounded-full p-2 aspect-square w-16 h-16 object-cover'
						/>
						<div className='flex h-full w-[20%] items-center justify-evenly text-4xl'>
							<p>{lScore}</p>
							<p>Vs</p>
							<p>{rScore}</p>
						</div>
						<Image
							src={friend.user.picture || "/placeholder.jpg"}
							alt="user pic"
							height={75}
							width={75}
							className='rounded-full p-2 aspect-square w-16 h-16 object-cover'
						/>
						<BoxForm result={oppResult} color={oppColor}/>
						<p className='text-3xl text-center w-[15%]'>{result === "W" ? "+" : "-"}30xp</p>
					</div>
				)}
			</div>
		)
	}
}
