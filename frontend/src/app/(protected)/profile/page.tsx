"use client"

import React, { useContext, useEffect, useState } from 'react'
import HistoryForm from '@/components/HistoryForm'
import { StatsType, useStats } from '@/hooks/useStats';
import { UserContext } from '@/context/userContext';

export type ResultType = {
	result: string;
	color: string;
}

export default function Page() {
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
	let hiddenArray: ResultType[] = [
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"},
		{result: "?", color: "bg-[#848788]"}
	];


	useEffect(() => {
		if (user.user && user.user.id) {
			getStats(user.user.id);
			getStatsByMode(user.user.id, "simple", SetLive);
			getStatsByMode(user.user.id, "reverse", SetReverse);
			getStatsByMode(user.user.id, "hidden", SetHidden);
		}
	}, []);

	if (reverse) {
		reverse?.gamestats.map((game, index) => {
			if (game.winnerId === user.user?.id) {
				revArray[index] = Win;
			} else {
				revArray[index] = Loss;
			}
		})
	}
	if (live) {
		live?.gamestats.map((game, index) => {
			if (game.winnerId === user.user?.id) {
				liveArray[index] = Win;
			} else {
				liveArray[index] = Loss;
			}
		})
	}
	if (hidden) {
		hidden?.gamestats.map((game, index) => {
			if (game.winnerId === user.user?.id) {
				hiddenArray[index] = Win;
			} else {
				hiddenArray[index] = Loss;
			}
		})
	}

  return (
	<div className='py-6 px-16 text-xl h-full 2xl:text-4xl'>
		<div className='h-1/4 flex items-center justify-evenly border-b-4 border-primecl'>
			<h4 className='w-1/4 w-1/2'>Mode</h4>
			<div className='flex items-center justify-evenly w-1/2 w-1/2'>
				<h4>MP</h4>
				<h4>W</h4>
				<h4>L</h4>
				<h4>GS</h4>
				<h4>GC</h4>
			</div>
			<h4 className='w-1/4 text-center w-1/2'>Form</h4>
		</div>
		<div className='h-1/4 flex items-center justify-evenly border-b-4 border-primecl'>
		<h4 className='w-1/4 w-1/2'>Default Mode</h4>
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
			<h4 className='w-1/4 w-1/2'>Reverse Mode</h4>
			<div className='flex items-center justify-evenly w-1/2 w-1/2'>
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
			<h4 className='w-1/4 w-1/2'>Hidden Mode</h4>
			<div className='flex items-center justify-evenly w-1/2 w-1/2'>
				<h4>{hidden?.stats.MP}</h4>
				<h4>{hidden?.stats.W}</h4>
				<h4>{hidden?.stats.L}</h4>
				<h4>{hidden?.stats.GS}</h4>
				<h4>{hidden?.stats.GC}</h4>
			</div>
			<h4 className='w-1/4'>
				<HistoryForm first={hiddenArray[0]} second={hiddenArray[1]} third={hiddenArray[2]} fourth={hiddenArray[3]} fifth={hiddenArray[4]}/>
			</h4>
		</div> 
	</div>
  )
}
