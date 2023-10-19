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
		  <p className="p-1">{text}</p>
		  <p className="self-end px-2 text-xs">{time}</p>
	  </div>
	)
}

export default Chatmsg;
