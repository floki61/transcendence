import Image from "next/image";

interface AwardProps {
  picture?: string;
  filled?: boolean
}

export const Award: React.FC<AwardProps> = ({ picture, filled }) => {
  return (
	<div>
		{filled && picture && (
			<div className="relative">
			<svg
			xmlns="http://www.w3.org/2000/svg"
			width="190"
			height="166"
			viewBox="0 0 190 166"
			fill="none"
			>
			<g filter="url(#filter0_d_958_7)">
				<path
				d="M160 125L84.5 142L10 125V35L84.5 16L160 35V125Z"
				fill="url(#paint0_linear_958_7)"
				shapeRendering="crispEdges"
				/>
			</g>
			<defs>
				<filter
				id="filter0_d_958_7"
				x="0"
				y="0"
				width="190"
				height="166"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
				>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feOffset dx="10" dy="4" />
				<feGaussianBlur stdDeviation="10" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
				/>
				<feBlend
					mode="normal"
					in2="BackgroundImageFix"
					result="effect1_dropShadow_958_7"
				/>
				<feBlend
					mode="normal"
					in="SourceGraphic"
					in2="effect1_dropShadow_958_7"
					result="shape"
				/>
				</filter>
				<linearGradient
				id="paint0_linear_958_7"
				x1="85"
				y1="140.5"
				x2="85"
				y2="17.5"
				gradientUnits="userSpaceOnUse"
				>
				<stop stopColor="#2C4B55" />
				<stop offset="1" stopColor="white" stopOpacity="0.75" />
				</linearGradient>
			</defs>
			</svg>
			<div className="absolute top-[30px] left-[26px]">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="117"
				height="98"
				viewBox="0 0 117 98"
				fill="none"
			>
				<path
				d="M0 13.2222L58.7223 0L116.667 13.2222V83.2223L58.7223 98L0 83.2223L0 13.2222Z"
				fill="url(#paint0_linear_958_9)"
				/>
				<defs>
				<linearGradient
					id="paint0_linear_958_9"
					x1="58.3334"
					y1="1.16667"
					x2="58.3334"
					y2="96.8334"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#2C4B55" />
					<stop offset="1" stopColor="white" stopOpacity="0.75" />
				</linearGradient>
				</defs>
			</svg>
			</div>
			<Image
				src={picture}
				alt="award"
				height={30}
				width={30}
				className="absolute top-[40%] left-[30%]"
			/>
			</div>
		)}
		{!filled && (
			<svg xmlns="http://www.w3.org/2000/svg" width="190" height="166" viewBox="0 0 190 166" fill="none">
  <g filter="url(#filter0_d_958_19)">
    <path d="M160 125L84.5 142L10 125V35L84.5 16L160 35V125Z" fill="#151515"/>
  </g>
  <defs>
    <filter id="filter0_d_958_19" x="0" y="0" width="190" height="166" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="10" dy="4"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_958_19"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_958_19" result="shape"/>
    </filter>
  </defs>
			</svg>
		)}
	</div>
  );
};
