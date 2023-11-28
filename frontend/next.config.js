/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
module.exports = {
	images: {
		domains: [process.env.NEXT_PUBLIC_HOST, 'cdn.intra.42.fr',
			'lh3.googleusercontent.com'],  // Add your domain here

	},
};
