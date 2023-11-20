import Image from "next/image";

interface AwardProps {
  picture?: string;
  name?: string;
  filled?: boolean;
}

export const Award: React.FC<AwardProps> = ({ picture, filled, name }) => {
  return (
    <div className={`${filled ? "" : "opacity-75 blur-sm"} shadow-xl flex items-center justify-center border-4 border-yellow-950 rounded-lg bg-primecl`}>
      {picture && (
        <Image
          src={picture}
          alt="award"
          height={180}
          width={180}
          title={"Award earned after " + (name ? name : "???")}
        />
      )}
    </div>
  );
};
