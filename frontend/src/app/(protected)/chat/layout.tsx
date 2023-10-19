import Chatbar from "@/components/Chatbar"
import Link from "next/link"

export default function ChatLayout({
	children,
  }: {
	children: React.ReactNode
  }) {
	return (
		<div className="flex h-full text-white">
			<div className="h-full w-1/3 flex flex-col items-center gap-4 py-8 border-r-2 border-primecl">
				<Chatbar
				name="Floki"
				text="3wej rwayda"
				time="20:40"
				image="/oel-berh.jpeg"
				/>
				<Chatbar
				name="Achraf"
				text="hhhhhhhhhhh"
				time="14:20"
				image="/ael-fadi.jpeg"
				/>
				<Chatbar
				name="Qli"
				text="Haslas o chefar"
				time="00:30"
				image="/abayar.jpeg"
				/>
				<Chatbar
				name="Floki"
				text="dir lkit"
				time="Yesterday"
				image="/mbaioumy.jpeg"
				/>
				<Chatbar
				name="Leda"
				text="jib meak garo"
				time="Yesterday"
				image="/mamali.jpeg"
				/>
				<Chatbar
				name="Jojo"
				text="chi smita ?"
				time="2 days ago"
				image="/mait-si-.jpeg"
				/>
				<Chatbar
				name="Yayba"
				text="nwa9es"
				time="month ago"
				image="/melkarmi.jpeg"
				/>
      		</div>
			<div className="flex flex-1 overflow-hidden">
				<main className="flex-1 overflow-x-hidden overflow-auto">
					{children}
				</main>
			</div>
		</div>
	)
  }
