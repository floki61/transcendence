import Image from 'next/image';
import Link from 'next/link';


export default function Notfound() {
	return (
		<div className="flex h-screen justify-between bg-diyali overflow-hidden">
			<div className='font-extrabold flex-1 flex flex-col items-center justify-center gap-4 mb-32 text-white'>
				<h1 className="text-7xl my-24">OOPS !!!</h1>
				<p className='text-2xl text-center px-32 mb-4 max-lg:text-lg max-lg:px-16'>Error 404 - Page Not Found<br/>The page you are looking for is not found we are working on it !</p>
				<div className='flex justify-center items-center gap-4 text-black text-base font-medium'>
					<Link href="/" className='px-8 my-8 h-8 border-2 bg-white rounded-xl flex justify-center items-center'>Go Back</Link>
					<Link href="/" className='px-8 my-8 h-8 border-2 bg-white rounded-xl flex justify-center items-center'>Go to Home</Link>
				</div>
			</div>
			<Image
				src="/404.jpeg"
				alt="Not-found"
				width={600}
				height={400}
				className='object-cover max-lg:hidden'
			/>
		</div>
	);
}