"use client"

import React from 'react'
import BoxForm from './BoxForm';
import { BxForm } from './Standing';

interface HistoryFormProps {
	first: BxForm;
	second: BxForm;
	third: BxForm;
	fourth: BxForm;
	fifth: BxForm;
}

const HistoryForm: React.FC<HistoryFormProps> = ({
	first,
	second,
	third,
	fourth,
	fifth,

}) => {
  return  (
	<div className="flex justify-center items-center gap-3 w-full h-full">
		<BoxForm result={first.result} color={first.color}/>
		<BoxForm result={second.result} color={second.color}/>
		<BoxForm result={third.result} color={third.color}/>
		<BoxForm result={fourth.result} color={fourth.color}/>
		<BoxForm result={fifth.result} color={fifth.color}/>
	</div>
  )
}

export default HistoryForm;
