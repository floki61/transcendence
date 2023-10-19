import Settinput from "@/components/SettInput"
import Button from "@/components/Button"
import Image from "next/image"

export default function page() {
  return (
    <div className="flex rounded-2xl bg-segundcl h-[90%] m-8">
      <div className="flex flex-col w-1/2 border-r-4 border-primecl justify-center items-center my-6 gap-6">
        <div className="flex flex-col items-center gap-3 h-1/2 w-full mt-4">
          <Image
            src={"/oel-berh.jpeg"}
            alt={"profile pic"}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="flex flex-col h-full w-full items-center gap-8 justify-center mt-4">
            <Button
              text="CHOOSE AN AVATAR"
              className="border border-white rounded-3xl w-2/5 p-2 h-12 opacity-80 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]"
            />
            <Button
              text="UPLOAD A PHOTO"
              className="border border-white rounded-3xl w-2/5 p-2 h-12 opacity-80 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]"
            />
          </div>
        </div>
        <div className="w-2/3 border-t-4 border-primecl mt-4">
          <h3 className="my-4 text-lg">SECURITY</h3>
        </div>
          <div className="flex flex-col items-center gap-8 h-1/2 w-full">
            <Button
              text="CHANGE THE PASSWORD"
              className="border border-white rounded-3xl w-2/5 p-2 h-12 opacity-80 cursor-pointer bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]"
            />
            <Button
              text="DELETE THE ACCOUNT"
              className="rounded-3xl w-2/5 p-2 h-12 opacity-80 cursor-pointer bg-red-700"
            />
          </div>
      </div>
      <div className="flex flex-col w-1/2 items-center gap-6 mt-16 px-10">
        <Settinput
          holder="Full Name"
          type="text"
        />
        <Settinput
          holder="Username"
          type="text"
        />
        <Settinput
          holder="Email"
          type="text"
        />
        <Settinput
          holder="Country"
          type="text"
        />
        <Settinput
          holder="Phone Number"
          type="text"
        />
        <Button
          text="Save"
          className="border border-white rounded-3xl w-[25%] h-12 my-auto opacity-95 cursor-pointer justify-self-end self-end bg-primecl shadow-[0px 4px 4px 0px rgba(0, 0, 0, 0.25)]"
        />
      </div>
    </div>
  )
}
