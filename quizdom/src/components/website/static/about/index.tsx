import React from "react";
import CustomCarousel, { type ImageProps } from "@/components/utils/carousel";

// Test Data for the carousel
const images: ImageProps[] = [
  {
    src: "https://static.wixstatic.com/media/bbabb2_29dfb17f56ec450cae2b65efd2dcc67c~mv2.jpg/v1/fill/w_1178,h_662,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/15%20AUGUST%2C%202017.jpg",
    alt: "Independence",
  },
  {
    src: "https://static.wixstatic.com/media/bbabb2_36a542fc09624868875eddafeaab5144~mv2_d_6000_4000_s_4_2.jpg/v1/fill/w_965,h_643,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Annual%20Sports%202015.jpg",
    alt: "School Awards",
  },
  {
    src: "https://static.wixstatic.com/media/bbabb2_473d62aa23674373b5c095634bd194db~mv2_d_3264_1836_s_2.jpg/v1/fill/w_1144,h_643,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/23rd%20January%2C%202017.jpg",
    alt: "School Building",
  },
  {
    src: "https://static.wixstatic.com/media/bbabb2_885b2c25104e443d81d2263cd2c284c8~mv2.jpg/v1/fill/w_720,h_406,al_c,lg_1,q_80,enc_auto/15th%20August%2C%202017.jpg",
    alt: "Students",
  },
  {
    src: "https://static.wixstatic.com/media/bbabb2_30de0bb21a5a4c90b9825381880b5771~mv2_d_4608_3072_s_4_2.jpg/v1/fill/w_994,h_663,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Group%20Photo%20DAY%20Section_JPG.jpg",
    alt: "Teachers",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffbe6] via-[#f5e9c8] to-[#e6d7b6] px-1 py-8 transition-colors duration-300 sm:px-2 sm:py-16 dark:from-[#232323] dark:via-[#2d2d2d] dark:to-[#3a2d1a]">
      <div className="mx-auto w-11/12 max-w-5xl rounded-[2.5rem] border border-yellow-100/70 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl sm:w-3/4 sm:p-12 dark:border-yellow-900/40 dark:bg-gray-900/80">
        <div className="flex flex-col items-center">
          <div className="mb-6 w-full sm:mb-10">
            {/* Custom Carousel */}
            <CustomCarousel images={images} />
          </div>
          <h1 className="mb-5 bg-gradient-to-tr from-yellow-700 via-yellow-600 to-yellow-400 bg-clip-text text-center text-3xl font-extrabold text-transparent drop-shadow sm:mb-8 sm:text-5xl dark:from-yellow-300 dark:via-yellow-200 dark:to-yellow-100">
            About Jalpaiguri Zilla School
          </h1>
          <p className="mb-6 text-center text-lg font-medium text-gray-700 sm:mb-8 sm:text-xl dark:text-gray-200">
            <span className="font-bold text-yellow-700 dark:text-yellow-400">
              Celebrating 150 Years of Excellence!
            </span>
            <br />
            Jalpaiguri Zilla School, established on{" "}
            <span className="font-semibold underline decoration-yellow-400/60 underline-offset-4">
              26th May 1876
            </span>
            , is one of the oldest and most prestigious educational institutions
            in Jalpaiguri, West Bengal. With a rich heritage and a commitment to
            excellence, Jalpaiguri Zilla School has been shaping young minds for
            generations.
          </p>
          <div className="mb-6 w-full rounded-2xl border-l-8 border-yellow-400/80 bg-gradient-to-r from-yellow-50/80 via-white/80 to-yellow-100/80 p-6 shadow-xl sm:mb-10 sm:p-8 dark:border-yellow-600 dark:bg-gray-800/80">
            <h2 className="dark:text-yellow-00 mb-2 text-2xl font-bold tracking-tight text-yellow-400 sm:text-3xl">
              150th Anniversary Special
            </h2>
            <p className="text-base font-medium text-gray-700 sm:text-lg dark:text-gray-500">
              In 2026, Jalpaiguri Zilla School proudly marks its{" "}
              <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                150th anniversary
              </span>
              . For a century and a half, we have been dedicated to nurturing
              talent, fostering values, and building a legacy of learning. Join
              us in celebrating this historic milestone!
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-6 sm:gap-12 md:grid-cols-2">
            <div>
              <h2 className="mt-4 mb-2 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-yellow-300">
                Our Mission
              </h2>
              <p className="mb-6 text-base font-medium text-gray-700 sm:text-lg dark:text-gray-200">
                Our mission is to provide quality education that fosters
                intellectual growth, creativity, and character development. We
                strive to create a nurturing environment where students are
                encouraged to achieve their full potential and become
                responsible citizens.
              </p>
              <h2 className="mt-6 mb-2 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-yellow-300">
                Vision
              </h2>
              <p className="mb-6 text-base font-medium text-gray-700 sm:text-lg dark:text-gray-200">
                Jalpaiguri Zilla School envisions empowering students to become
                lifelong learners and leaders, equipped with knowledge, skills,
                and values to meet the challenges of a rapidly changing world.
                We are committed to academic excellence, innovation, and the
                holistic development of every child.
              </p>
            </div>
            <div>
              <h2 className="mt-4 mb-2 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-yellow-300">
                History & Values
              </h2>
              <p className="mb-6 text-base font-medium text-gray-700 sm:text-lg dark:text-gray-200">
                Founded over a century ago, Jalpaiguri Zilla School has a proud
                tradition of academic achievement and holistic development. We
                value integrity, respect, and a passion for learning. Our
                dedicated faculty and staff work tirelessly to ensure that every
                student receives the guidance and support they need to succeed.
              </p>
              <h2 className="mt-6 mb-2 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-yellow-300">
                Facilities
              </h2>
              <p className="mb-6 text-base font-medium text-gray-700 sm:text-lg dark:text-gray-200">
                The school campus features spacious classrooms, well-equipped
                science and computer laboratories, a library with a rich
                collection of books, and sports facilities that encourage
                physical fitness and teamwork. We provide a safe and inclusive
                environment for all students.
              </p>
            </div>
          </div>
          <div className="mt-6 w-full sm:mt-12">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-yellow-300">
              Holistic Development
            </h2>
            <p className="mb-6 text-base font-medium text-gray-700 sm:text-lg dark:text-gray-200">
              At Jalpaiguri Zilla School, we believe in nurturing not just
              academic excellence but also creativity, leadership, and social
              responsibility. Our students participate in a wide range of
              co-curricular and extracurricular activities, including sports,
              arts, debates, and community service.
            </p>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-yellow-300">
              Why Choose Jalpaiguri Zilla School?
            </h2>
            <ul className="mb-8 list-inside list-disc space-y-2 text-base font-medium text-gray-700 sm:text-lg dark:text-gray-200">
              <li>Over 150 years of educational excellence</li>
              <li>Experienced and caring teachers</li>
              <li>Focus on both academics and co-curricular activities</li>
              <li>Safe and inclusive learning environment</li>
              <li>Strong alumni network</li>
              <li>Modern facilities and resources</li>
              <li>Commitment to holistic student development</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
