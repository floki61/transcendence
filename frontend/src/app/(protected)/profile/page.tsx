import React from 'react'
import HistoryForm from '@/components/HistoryForm'

export default function page() {
	let Win = {result: "W", color: "bg-[#00A83F]"};
	let Loss = {result: "L", color: "bg-[#DC0000]"};
	let Unset = {result: "?", color: "bg-[#848788]"}

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
		<h4 className='w-1/4'>Fast Mode</h4>
			<div className='flex items-center justify-evenly w-1/2'>
				<h4>15</h4>
				<h4>9</h4>
				<h4>6</h4>
				<h4>89</h4>
				<h4>54</h4>
			</div>
			<h4 className='w-1/4'>
			<HistoryForm first={Loss} second={Win} third={Win} fourth={Win} fifth={Win}/>
			</h4>
		</div>
		<div className='h-1/4 flex items-center justify-evenly border-b-4 border-primecl'>
			<h4 className='w-1/4'>Another Mode</h4>
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
		<div className='h-1/4 flex items-center justify-evenly'>
			<h4 className='w-1/4'>Default Mode</h4>
			<div className='flex items-center justify-evenly w-1/2'>
				<h4>15</h4>
				<h4>9</h4>
				<h4>6</h4>
				<h4>89</h4>
				<h4>54</h4>
			</div>
			<h4 className='w-1/4'>
				<HistoryForm first={Win} second={Win} third={Loss} fourth={Win} fifth={Loss}/>
			</h4>
		</div> 
	</div>
  )
}
