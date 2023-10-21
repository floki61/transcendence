import Loginput from "@/components/Loginput";
import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Image
        src={"/login.gif"}
        alt={"loginpage"}
        width={500}
        height={400}
        className="object-cover max-md:hidden"
      />
      <form className="flex py-12 max-md:py-3  max-md:px-3 flex-col flex-1 h-full items-center gap-5 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 75 75"
          fill="none"
        >
          <path
            d="M17.8688 40.9336C21.3797 52.4789 9.83204 57.0047 1.79767 65.0414C3.64454 71.2313 3.58829 71.2852 9.83439 73.0781C17.8711 65.0414 21.8883 52.9899 33.9422 57.007L17.8711 40.936L17.8688 40.9336ZM66.3399 56.8524C66.3399 62.4047 61.7836 66.9094 56.1586 66.9094C50.5336 66.9094 45.975 62.4094 45.975 56.8547C45.975 56.8524 45.975 56.8524 45.975 56.85C45.975 51.2977 50.5313 46.793 56.1563 46.793C61.7813 46.793 66.3399 51.293 66.3399 56.8477C66.3399 56.85 66.3399 56.85 66.3399 56.8524ZM45.0281 56.2969C45.0281 56.2945 45.0281 56.2945 45.0281 56.2922C45.0281 50.4797 49.7977 45.7664 55.6828 45.7664C58.0781 45.7664 60.2906 46.5469 62.0695 47.8641C72.757 38.6789 79.1016 24.6234 64.6758 10.1977C36.5508 -17.9273 9.83439 32.8992 17.8688 40.9336L33.9399 57.0024C35.8242 58.8867 40.0617 58.8586 45.0797 57.3516C45.0445 57.0047 45.0258 56.6508 45.0258 56.2945L45.0281 56.2969Z"
            fill="black"
          />
        </svg>
        <div className="text-black text-center">
          <h1 className="text-5xl font-bold tracking-wider">WELCOME BACK</h1>
          <h3 className="text-xl font-light">Please enter your details</h3>
        </div>
        <div className="flex mt-12 flex-col w-5/12 max-xl:w-2/3 max-md:w-full gap-16 text-black ">
          <Loginput holder="Email" type="text" />
          <Loginput holder="Password" type="password" />
        </div>
        <div className="flex mb-14 text-black w-5/12 max-xl:w-2/3 max-md:w-full justify-between ">
          <div className="flex gap-1">
            <input
              className="bg-slate-300 flex gap-1"
              type="checkbox"
              name={"Remember me"}
              value={"checked"}
            ></input>
            <label htmlFor={String("Remember me")}>Remember me</label>
          </div>
          <Link href={"forgotps"} className="cursor-pointer underline">
            Forgot password ?
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col max-md:w-full items-center text-2xl gap-4 max-md:text-xl">
            <Button
              text="Log in"
              className="bg-black rounded-3xl w-96 max-md:w-[70%]  h-14 cursor-pointer text-white"
            />
            <Link
              href={process.env.NEXT_PUBLIC_SERVER_URL + "/login"}
              className="flex items-center justify-center gap-3 text-black bg-white border rounded-3xl w-96 max-md:w-[70%] max-md:p-4 h-14 cursor-pointer"
            >
              <Image
                src={"/42.png"}
                alt={"42"}
                width={46}
                height={46}
                className=""
              />
              Log in with 42
            </Link>
          </div>

          <div className="text-black text-center">
            <p>
              Don't you have an account ?
              <Link href={"signup"}>
                <span className="cursor-pointer underline font-semibold">
                  Sign up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}