"use client"

interface StylingProps {
	className?: string;
}

interface ButtonProps extends StylingProps {
  // Other props specific to your component
  text: string;
    children?: React.ReactNode

}

const Button: React.FC<ButtonProps> = ({ text, className ,children }) => {
	const classes = `${className}`;

	return (
		<button type="submit" className={classes}>
			{children}
			{text}</button>
	);
};

export default Button;
