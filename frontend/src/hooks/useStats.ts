"use client"

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from '@/context/userContext';

interface GameType {
	createdAt: string;
	id: string;
	loserId: string;
	mode: string; 
	player1Id: string;
	player1Score: number;
	player2Id: string;
	player2Score: number;
	updatedAt: string;
	winnerId: string;
}

export interface StatsType {
	gamestats: GameType[];
	stats: {
		GC: number;
		GS: number;
		L: number;
		MP: number;
		W: number;
	}
}

export const useStats = () => {
	const [stats, SetStats] = useState<StatsType | null>(null);

		const getStats = async (userId: string) => {
			if (userId) {
				try {
					const res = await axios.post("http://localhost:4000/getStats", {id : userId}, {
						withCredentials: true,
					})
					SetStats(res.data);
				} catch (error) {
				}
			}
		};
		const getStatsByMode = async (userId:string, mode: string, SetData: any) => {
			try {
				const res = await axios.post("http://localhost:4000/getStats", {id: userId, mode}, {
					withCredentials: true,
				})
				SetData(res.data);
			} catch (error) {
			}
		}
	
	return {stats, SetStats, getStats, getStatsByMode};
}
