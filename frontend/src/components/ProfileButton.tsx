import { IconType } from "react-icons";
import React from "react";
import { MdPeopleAlt, MdGroupAdd } from "react-icons/md";

interface ProfileButtonProps {
	color: string;
	text: string;
	icon: IconType;
	action?(): any;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
	color,
	text,
	icon,
	action,
}) => {

	return (
		<div className="w-1/5 flex justify-end" onClick={action}>
			<button className={`${color} rounded-lg w-full text-lg flex items-center justify-center gap-3 mb-2`}>
				{React.createElement(icon, {size: 22})}
				{text}
			</button>
		</div>
	)
}
