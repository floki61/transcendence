import { IconType } from "react-icons";
import React from "react";

interface ProfileButtonProps {
	color: string;
	text: string;
	icon: IconType;
	action?(): any;
	classname?: string;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
	color,
	text,
	icon,
	action,
	classname,
}) => {

	return (
		<div className={`${classname} flex justify-end`} onClick={action}>
			<button className={`${color} rounded-lg w-full text-lg flex items-center justify-center gap-3`}>
				{React.createElement(icon, {size: 22})}
				{text}
			</button>
		</div>
	)
}
