"use client"

interface StylingProps {
	className?: string;
}

interface ButtonProps extends StylingProps {
  // Other props specific to your component
	text: string;
	children?: React.ReactNode
	onClick?(e:any) : any,
	disabled?: boolean,
}

const Button: React.FC<ButtonProps> = ({ text, className ,children, onClick, disabled }) => {
	const classes = `${className}`;

	return (
		<button type="submit" className={classes} onClick={onClick} disabled={disabled}>
			{children}
			{text}</button>
	);
};

export default Button;
