import Image from 'next/image';
import HistoryForm from './HistoryForm';
import { useEffect } from 'react';
import { ResultType } from '@/app/(protected)/profile/page';
import { useStats } from '@/hooks/useStats';

export interface BxForm {
	result: string;
	color: string;
}

interface StandingProps {
	place: number;
	picture: string;
	name: string;
	mp: number;
	wins: number;
	losses: number;
	level: number;
	color: string;
	id: string
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
	id,
}) => {

	let Win = { result: "W", color: "bg-[#00A83F]" };
	let Loss = { result: "L", color: "bg-[#DC0000]" };
	const { stats, getStats } = useStats();
	let resArray: ResultType[] = [
		{ result: "?", color: "bg-[#848788]" },
		{ result: "?", color: "bg-[#848788]" },
		{ result: "?", color: "bg-[#848788]" },
		{ result: "?", color: "bg-[#848788]" },
		{ result: "?", color: "bg-[#848788]" }
	];

	useEffect(() => {
		if (id) {
			getStats(id);
		}
	}, []);

	if (stats) {
		stats?.gamestats.map((game, index) => {
			if (game.winnerId === id) {
				resArray[index] = Win;
			} else {
				resArray[index] = Loss;
			}
		})
	}

	if (place >= 4)
		color = "bg-[#6A6666]";

	if (place <= 10) {
		return (
			<div className='h-full flex items-center border-t-2 border-primecl py-1'>
				<div className='flex w-1/4 items-center justify-around pl-6 h-full'>
					<div className={`${color} rounded-lg w-8 text-center flex items-center justify-center h-8 2xl:w-12 2xl:h-12 2xl:text-xl 2xl:ml-10`}>{place}</div>
					<Image
						loader={() => picture || "/placeholder.jpg"}
						src={picture || "/placeholder.jpg"}
						alt="player pic"
						width={35}
						height={35}
						className="rounded-full aspect-square w-9 h-9 2xl:w-14 2xl:h-14 object-cover"
						unoptimized
					/>
					<div className='flex w-[42%] 2xl:text-2xl'>{name}</div>
				</div>
				<div className='w-1/2 h-full text-gray-200 flex items-center justify-evenly pl-10 2xl:text-3xl'>
					<p>{mp}</p>
					<p>{wins}</p>
					<p>{losses}</p>
					<p>{level}</p>
				</div>
				<div className='w-1/4 h-full flex items-center justify-center'>
					<HistoryForm first={resArray[0]} second={resArray[1]} third={resArray[2]} fourth={resArray[3]} fifth={resArray[4]} />
				</div>
			</div>
		)
	}
}

export default Standing;