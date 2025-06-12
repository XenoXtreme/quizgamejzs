"use client";
import React from "react";
import { Button, Card } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";

const features = [
	{
		title: "Annual Quiz Competition",
		description:
			"Participate in the prestigious annual quiz competition of Jalpaiguri Zilla School. Open for both intra and interschool teams.",
		image: "/assets/static/banner.jpg",
		link: "/quiz",
		cta: "Explore Quiz",
	},
	{
		title: "Register Your Team",
		description:
			"Form your team and register to compete. Open for students from class IX to XII.",
		image: "/assets/static/register.png",
		link: "/register",
		cta: "Register Now",
	},
	{
		title: "Learn About Us",
		description:
			"Discover the legacy and vision of Jalpaiguri Zilla School, celebrating 150 years of excellence.",
		image: "/assets/static/jzs.png",
		link: "https://jzs1876.wixsite.com/zillaschool/about",
		cta: "About School",
	},
];

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-2 transition-colors duration-300 relative overflow-x-hidden">
			{/* Decorative Blobs */}
			<div className="pointer-events-none absolute z-0 opacity-30 dark:opacity-20">
				<div className="absolute top-0 -left-16 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
				<div className="absolute top-0 -right-16 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-16 left-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
			</div>
			{/* Hero Section */}
			<section className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 py-12">
				<div className="flex-1 flex flex-col items-start">
					<h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-yellow-300 mb-4 drop-shadow-lg tracking-tight">
						Welcome to{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-pink-500 to-purple-600 dark:from-yellow-400 dark:via-pink-400 dark:to-purple-400 animate-gradient-x">
							Quizdom
						</span>
					</h1>
					<h2 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-200 mb-4 tracking-tight">
						Jalpaiguri Zilla School Quiz Portal
					</h2>
					<p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
						Join us in celebrating{" "}
						<span className="font-semibold text-yellow-700 dark:text-yellow-400">
							150 years
						</span>{" "}
						of academic excellence and vibrant competition.
						<br />
						<span className="text-pink-600 dark:text-pink-400 font-semibold">
							Test your knowledge, compete with the best, and be a part of our
							legacy!
						</span>
					</p>
					<div className="flex gap-6">
						<Button
							as={Link}
							href="/quiz"
							color="warning"
							className="font-bold px-8 py-3 rounded-xl shadow-xl hover:scale-110 hover:shadow-2xl transition-all text-lg tracking-wide bg-gradient-to-r from-yellow-400 to-pink-400 dark:from-yellow-500 dark:to-pink-600 border-0"
						>
							Start Quiz
						</Button>
						<Button
							as={Link}
							href="/register"
							color="dark"
							className="font-bold px-8 py-3 rounded-xl shadow-xl hover:scale-110 hover:shadow-2xl transition-all text-lg tracking-wide bg-gradient-to-r from-gray-900 to-purple-900 dark:from-gray-800 dark:to-purple-800 border-0"
						>
							Register Team
						</Button>
					</div>
				</div>
				<div className="flex-1 flex justify-center">
					<div className="relative">
						<div className="absolute -top-8 -left-8 w-40 h-40 bg-yellow-200 dark:bg-yellow-700 rounded-full blur-2xl opacity-60 animate-blob"></div>
						<Image
							src="/assets/static/jzs.png"
							alt="Jalpaiguri Zilla School"
							width={340}
							height={340}
							className="rounded-3xl shadow-2xl border-4 border-yellow-200 dark:border-yellow-700 bg-white dark:bg-gray-900 z-10"
							priority
						/>
						<div className="absolute -bottom-8 -right-8 w-32 h-32 bg-pink-200 dark:bg-pink-700 rounded-full blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 py-12">
				{features.map((feature, idx) => (
					<Card
						key={idx}
						className="flex flex-col items-center bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300 rounded-2xl p-6 group"
					>
						<div className="w-full flex justify-center mb-6">
							<div className="relative">
								<Image
									src={feature.image}
									alt={feature.title}
									width={340}
									height={340}
									className="rounded-xl shadow-lg object-cover bg-white dark:bg-gray-800 border-2 border-yellow-100 dark:border-gray-800 group-hover:scale-105 transition-transform duration-300"
								/>
								<div className="absolute -top-4 -right-4 w-10 h-10 bg-pink-200 dark:bg-pink-700 rounded-full blur-xl opacity-40"></div>
							</div>
						</div>
						<h3 className="text-2xl font-extrabold text-gray-800 dark:text-yellow-300 mb-3 text-center tracking-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition">
							{feature.title}
						</h3>
						<p className="text-gray-700 dark:text-gray-200 text-center mb-6 text-lg">
							{feature.description}
						</p>
						<Button
							as={Link}
							href={feature.link}
							color="warning"
							className="font-bold px-6 py-2 rounded-lg shadow hover:scale-110 hover:shadow-xl transition-all text-base bg-gradient-to-r from-yellow-400 to-pink-400 dark:from-yellow-500 dark:to-pink-600 border-0"
						>
							{feature.cta}
						</Button>
					</Card>
				))}
			</section>

			{/* Footer Banner */}
			<section className="relative z-10 max-w-4xl mx-auto mt-16 text-center">
				<div className="rounded-2xl bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-10 px-8 shadow-2xl border border-yellow-200 dark:border-yellow-700">
					<h2 className="text-3xl font-extrabold text-yellow-800 dark:text-yellow-400 mb-3 tracking-tight">
						🎉 Celebrating 150 Years of Jalpaiguri Zilla School 🎉
					</h2>
					<p className="text-gray-700 dark:text-gray-200 mb-6 text-lg">
						Since{" "}
						<span className="font-semibold">26th May 1876</span>, nurturing minds
						and building leaders.
						<br />
						<span className="text-pink-600 dark:text-pink-400 font-semibold">
							Be a part of our epic journey!
						</span>
					</p>
					<Button
						as={Link}
						href="/about"
						color="dark"
						className="font-bold px-8 py-3 rounded-xl shadow-xl hover:scale-110 hover:shadow-2xl transition-all text-lg bg-gradient-to-r from-gray-900 to-purple-900 dark:from-gray-800 dark:to-purple-800 border-0"
					>
						Learn More
					</Button>
				</div>
			</section>
		</div>
	);
}
