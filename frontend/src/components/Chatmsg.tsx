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
		  <p className="self-end px-2 pb-1 text-xs">{time}</p>
	  </div>
	)
}

export default Chatmsg;
