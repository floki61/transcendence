"use client"

import React from 'react';
import { useEffect, useState, createContext } from 'react';
import axios from 'axios';

export interface userType {
	id: string;
	email: string;
	picture: string;
	firstName: string;
	fullName: string;
	lastName: string;
	userName: string;
	phoneNumber: string;
	level: number;
	country: string;
	isTwoFactorAuthenticationEnabled: boolean;
}

type UserContextType = {
	user: userType | undefined | null;
	setUser: React.Dispatch<React.SetStateAction<userType | undefined | null>>;
  };

export const UserContext = createContext<UserContextType>({
	user: null,
	setUser: () => null,
});

export const UserProvider = ({ children }: any ) => {
	const [user, setUser] = useState<userType | undefined | null>();
  
	useEffect(() => {
		const fetchData = async () => {
		  try {
			const res = await axios.get("http://localhost:4000/getUser", {
			  withCredentials: true,
			});
			setUser(res.data);
		  } catch (error) {
			console.error(error);
		  }
		}
	
		fetchData();
	  }, []);
  
	if (user)
	  user.fullName = user.firstName + " " + user.lastName;

	const contextValue: UserContextType = {
		user,
		setUser,
	  };

	return (
	  <UserContext.Provider value={contextValue}>
		{children}
	  </UserContext.Provider>
	);
  };
  