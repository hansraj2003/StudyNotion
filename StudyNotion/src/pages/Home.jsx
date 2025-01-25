import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText.jsx';
import CTAButton from '../components/core/HomePage/CTAButton.jsx';
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from '../components/core/HomePage/CodeBlocks.jsx';

function Home () {
    return ( 
        <div>
            {/* Section 1 */}
            <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>

                <Link to={"/signup"}>
                    <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                    transition-allduration-200 hover:scale-95 w-fit'>

                        <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900 shadow-lg'>
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                        
                    </div>
                </Link>

                <div className='text-center text-4xl font-semibold mt-7'>
                    Empower your Future with
                    <HighlightText text={"Coding Skills"}/>
                </div>

                <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                <div className='flex flex-row gap-7 mt-8'>
                    <CTAButton active={true} linkTo={'/signup'} >
                        Learn More
                    </CTAButton>

                    <CTAButton active={false} linkTo={"/login"}>
                        Book a Demo
                    </CTAButton>
                </div>

                <div className='mx-3 my-12 h-[25%] w-[90%] shadow-blue-200 '>
                    <video
                    muted
                    loop
                    autoPlay>
                        <source src={Banner} type="video/mp4"/>
                    </video>
                </div>


                {/* Code Section 1*/}
                <div>
                    <CodeBlocks 
                        position={"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock your 
                                <HighlightText text={"coding potential"} /> with our online courses. 
                            </div>
                        }
                        subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                        ctabtn1={
                            {
                                btnText: "Try it Yourself",
                                linkTo: "/signup",
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn More",
                                linkTo: "/login",
                                active: false,
                            }
                        }
                        codeBlock={'<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>'}
                        codeColor={"text-yellow-400"}
                    />
                </div>

                <div>
                    <CodeBlocks 
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock your 
                                <HighlightText text={"coding potential"} /> with our online courses. 
                            </div>
                        }
                        subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                        ctabtn1={
                            {
                                btnText: "Try it Yourself",
                                linkTo: "/signup",
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn More",
                                linkTo: "/login",
                                active: false,
                            }
                        }
                        codeBlock={'<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>'}
                        codeColor={"text-yellow-400"}
                    />
                </div>

            </div>

            {/* Section 2 */}
            <div className="bg-pure-greys-5 text-richblack-700">
                <div className='homepage_bg h-[310px] flex-row'>
                    <div className='w-11/12 max-w-maxContent flex flex-col justify-between items-center gap-5 mx-auto'>
                        <div className='h-[150px]'></div>
                        <div className='flex flex-row gap-7 text-white'>
                            <CTAButton active={true} linkTo={"/signup"}>
                                <div className='flex items-center gap-2'>
                                    Explore Full Catalog
                                    <FaArrowRight/>
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkTo={"/signup"}>
                                <div className='flex items-center gap-7'>
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                    <div className='flex flex-row gap-5'>
                        <div className='text-4xl font-semibold w-[45%]'>
                            Get the skills you need for a
                            <HighlightText text={"Job that is in demand"}/>
                        </div>
                    </div>

                    <div className='w-[40%] flex flex-col gap-10'>
                        <div className='text-[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        <div>
                            <CTAButton active={true} linkTo={"/signup"}>
                                Learn More
                            </CTAButton>
                        </div>
                    </div>

                </div>
                
            </div>

            {/* Section 3 */}
            {/* Section 4 */}
        </div>
     );
}

export default Home ;