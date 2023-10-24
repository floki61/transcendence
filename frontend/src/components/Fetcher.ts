"use client"

import { useState, useEffect } from "react"
import axios from "axios"


const Fetcher = () => {
	const [data, setData] = useState(null);
  
	useEffect(() => {
	  const fetchData = async () => {
		try {
		  const response = await axios.get('http://localhost:4000/getUser');
		  setData(response.data);
		  console.log(response.data);
		} catch (error) {
		  console.error('Error fetching data', error);
		}
	  };
  
	  fetchData();
	}, []);
  
	if (!data) {
		console.log("HADCHI MAKHDAMCH");
	}
}
 
export default Fetcher;