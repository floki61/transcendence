"use client"

import React, { useContext, useEffect, useState } from 'react'
import HistoryForm from '@/components/HistoryForm'
import { StatsType, useStats } from '@/hooks/useStats';
import { UserContext } from '@/context/userContext';

type ResultType = {
	result: string;
	color: string;
}

export default function page() {
	let Win = {result: "W", color: "bg-[#00A83F]"};
	let Loss = {result: "L", color: "bg-[#DC0000]"};
	let Unset = {result: "?", color: "bg-[#848788]"};

	const {stats, SetStats, getStats, getStatsByMode} = useStats();
	const user = useContext(UserContext);
	const [live, SetLive] = useState<StatsType>();
	const [reverse, SetReverse] = useState<StatsType>();
	const [hidden, SetHidden] = useState<StatsType>();
	let revArray: ResultType[] = [
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"}
	];
	let liveArray: ResultType[] = [
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"}
	];


	useEffect(() => {
		if (user.user && user.user.id) {
			getStats(user.user.id);
			getStatsByMode(user.user.id, "Live", SetLive);
			getStatsByMode(user.user.id, "reverse", SetReverse);
			// getStatsByMode(user.user.id, "hidden", SetHidden);
		}
	}, []);

	console.log({live})
	console.log({reverse})

	if (reverse) {
		reverse?.gamestats.map((game, index) => {
			if (game.winnerId === user.user?.id) {
				revArray[index] = Win;
			} else {
				revArray[index] = Loss;
			}
		})
		console.log({revArray});
	}
	if (live) {
		live?.gamestats.map((game, index) => {
			if (game.winnerId === user.user?.id) {
				liveArray[index] = Win;
			} else {
				liveArray[index] = Loss;
			}
		})
		console.log({liveArray});
	}


  return (
	<div className='py-6 px-16 text-xl h-full'>
		<div className='h-1/4 flex items-center justify-evenly border-b-4 border-primecl'>
			<h4 className='w-1/4'>Mode</h4>
			<div className='flex items-center justify-evenly w-1/2'>
				<h4>MP</h4>
				<h4>W</h4>
				<h4>L</h4>
				<h4>GS</h4>
				<h4>GC</h4>
			</div>
			<h4 className='w-1/4 text-center'>Form</h4>
		</div>
		<div className='h-1/4 flex items-center justify-evenly border-b-4 border-primecl'>
		<h4 className='w-1/4'>Default Mode</h4>
			<div className='flex items-center justify-evenly w-1/2'>
				<h4>{live?.stats.MP}</h4>
				<h4>{live?.stats.W}</h4>
				<h4>{live?.stats.L}</h4>
				<h4>{live?.stats.GS}</h4>
				<h4>{live?.stats.GC}</h4>
			</div>
			<h4 className='w-1/4'>
					<HistoryForm first={liveArray[0]} second={liveArray[1]} third={liveArray[2]} fourth={liveArray[3]} fifth={liveArray[4]}/>
			</h4>
		</div>
		<div className='h-1/4 flex items-center justify-evenly border-b-4 border-primecl'>
			<h4 className='w-1/4'>Reverse Mode</h4>
			<div className='flex items-center justify-evenly w-1/2'>
				<h4>{reverse?.stats.MP}</h4>
				<h4>{reverse?.stats.W}</h4>
				<h4>{reverse?.stats.L}</h4>
				<h4>{reverse?.stats.GS}</h4>
				<h4>{reverse?.stats.GC}</h4>
			</div>
			<h4 className='w-1/4'>
				<HistoryForm first={revArray[0]} second={revArray[1]} third={revArray[2]} fourth={revArray[3]} fifth={revArray[4]}/>
			</h4>
		</div>
		<div className='h-1/4 flex items-center justify-evenly'>
			<h4 className='w-1/4'>Hidden Mode</h4>
			<div className='flex items-center justify-evenly w-1/2'>
				<h4>0</h4>
				<h4>0</h4>
				<h4>0</h4>
				<h4>0</h4>
				<h4>0</h4>
			</div>
			<h4 className='w-1/4'>
				<HistoryForm first={Unset} second={Unset} third={Unset} fourth={Unset} fifth={Unset}/>
			</h4>
		</div> 
	</div>
  )
}
