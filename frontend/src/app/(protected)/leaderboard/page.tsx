"use client";

import React, { useEffect, useState } from 'react'
import Standing from "@/components/Standing"
import axios from 'axios';

interface BoardType {
	GC: number;
	GS: number;
	MP: number;
	W: number;
	L: number;
	level_P: number;
	userName: string;
	picture: string;
	id: string;
}

export default function Page() {
	const [board, SetBoard] = useState<BoardType[]>([]);
	let colorArray = [
		"bg-[#FFD700]",
		"bg-[#C0C0C0]",
		"bg-[#CD7F32]",
		"bg-[#6A6666]",
	];

	useEffect(() => {
		const getLeaderBoard = async () => {
			try {
				const res = await axios.get("http://localhost:4000/getLeaderboard", {
					withCredentials: true,
				})
				SetBoard(res.data);
			} catch (error) {
			}
		}
		getLeaderBoard();
	}, [])

	return (
	  <div className="flex flex-col p-8 py-16 h-full w-full overflow-hidden">
		<div className="flex justify-between h-12">
			<div className="flex gap-3 items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 35 35" fill="none">
					<path d="M5.46897 1.09375C5.46897 0.803669 5.5842 0.52547 5.78932 0.320352C5.99444 0.115234 6.27264 0 6.56272 0L28.4377 0C28.7278 0 29.006 0.115234 29.2111 0.320352C29.4162 0.52547 29.5315 0.803669 29.5315 1.09375C29.5315 2.27062 29.5052 3.39062 29.4571 4.45375C30.3214 4.59688 31.1484 4.91164 31.8892 5.37946C32.6299 5.84728 33.2695 6.45869 33.7702 7.17764C34.2709 7.8966 34.6226 8.70853 34.8045 9.56556C34.9864 10.4226 34.9949 11.3074 34.8294 12.1677C34.6639 13.0281 34.3278 13.8466 33.8409 14.575C33.354 15.3033 32.7262 15.9269 31.9945 16.4088C31.2628 16.8906 30.442 17.2211 29.5806 17.3808C28.7191 17.5404 27.8344 17.5259 26.9787 17.3381C25.2505 21.4178 22.8705 23.4128 20.7815 23.9247V28.6781L23.8987 29.4569C24.323 29.5619 24.7233 29.7522 25.0733 30.0147L29.094 33.0312C29.2776 33.169 29.4133 33.361 29.4817 33.5801C29.5502 33.7992 29.5479 34.0343 29.4753 34.2521C29.4027 34.4699 29.2635 34.6593 29.0772 34.7935C28.891 34.9278 28.6673 35 28.4377 35H6.56272C6.33316 35 6.10942 34.9278 5.92319 34.7935C5.73697 34.6593 5.59769 34.4699 5.5251 34.2521C5.4525 34.0343 5.45027 33.7992 5.51872 33.5801C5.58717 33.361 5.72282 33.169 5.90647 33.0312L9.9271 30.0147C10.2771 29.7522 10.6774 29.5619 11.1018 29.4569L14.219 28.6781V23.9247C12.1299 23.4128 9.74991 21.4178 8.02178 17.3359C7.16557 17.5247 6.2802 17.54 5.41798 17.3809C4.55576 17.2218 3.73416 16.8915 3.00172 16.4096C2.26927 15.9276 1.64082 15.3038 1.15348 14.5749C0.666148 13.8461 0.329809 13.0269 0.164329 12.1659C-0.0011508 11.3049 0.00758437 10.4194 0.190019 9.56186C0.372453 8.70427 0.724887 7.89193 1.22651 7.17282C1.72813 6.45371 2.36876 5.84241 3.11057 5.37502C3.85239 4.90763 4.68034 4.59363 5.54553 4.45156C5.49403 3.33303 5.46851 2.21346 5.46897 1.09375ZM5.68553 6.65C4.54407 6.85886 3.53232 7.51261 2.87286 8.46743C2.21341 9.42226 1.96027 10.5999 2.16913 11.7414C2.37798 12.8829 3.03173 13.8946 3.98656 14.5541C4.94138 15.2135 6.11907 15.4667 7.26053 15.2578C6.53209 12.9609 5.97428 10.1259 5.68553 6.65ZM27.7421 15.2578C28.8836 15.4667 30.0612 15.2135 31.0161 14.5541C31.9709 13.8946 32.6246 12.8829 32.8335 11.7414C33.0424 10.5999 32.7892 9.42226 32.1298 8.46743C31.4703 7.51261 30.4586 6.85886 29.3171 6.65C29.0262 10.1281 28.4683 12.9609 27.7421 15.2578Z" fill="white"/>
				</svg>
				<h1 className="text-center text-2xl">Leaderboard</h1>
			</div>
		</div>
		<div className="flex-1 flex flex-col w-full">
			<div className="h-[7.5%] w-full rounded-t-xl bg-primecl flex">
				<div className="w-1/4 flex items-center justify-around gap-3">
					<p>#</p>
					<p>Playername</p>
				</div>
				<div className="w-1/2 flex items-center justify-evenly pl-10">
					<p>MP</p>
					<p>W</p>
					<p>L</p>
					<p>LV</p>
				</div>
				<a className="w-1/4 flex items-center justify-center">FORM</a>
			</div>
			<div className="flex-1 rounded-b-xl bg-segundcl">
				{board && board.map((rank, index) => (
					<div key={index} className='h-[10%]'>
						<Standing
							place={index + 1}
							color={colorArray[index]}
							picture={rank.picture}
							name={rank.userName}
							mp={rank.MP}
							wins={rank.W}
							losses={rank.L}
							level={rank.level_P}
							id={rank.id}
						/>
					</div>
				))}
			</div>
		</div>
	  </div>
	)
  }
  