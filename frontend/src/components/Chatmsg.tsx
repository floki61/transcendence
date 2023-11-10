"use client"

interface StylingProps {
	className?: string;
}

interface MsgProps extends StylingProps {
  // Other props specific to your component
  	text: string;
	time: string;
}

const Chatmsg:React.FC<MsgProps> = ({ text, time, className}) => {
	const classes = `${className}`;

	return (
	  <div className={classes}>
		  <p className="py-1 px-2">{text}</p>
		  <p className="self-end px-1 pt-1 text-[10px] text-slate-300">{time}</p>
	  </div>
	)
}

export default Chatmsg;
