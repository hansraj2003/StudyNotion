import React from 'react';
import CTAButton from './CTAButton.jsx';
import HighlightText from './HighlightText.jsx';
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';


function CodeBlocks({
    position, heading, subheading, ctabtn1, ctabtn2, codeBlock, backgroundGradient, codeColor
}) {
    return ( 
        <div className={`flex ${position} my-20 justify-between gap-10`}>
             
        {/* Section 1 */}
        <div className='w-1/2 flex flex-col gap-8'>
            {heading}
            <div className='text-richblack-300 font-bold'>
                {subheading}
            </div>

            <div className='flex gap-7 mt-7'>

                <CTAButton active={ctabtn1.active} linkTo={ctabtn1.linkTo}>
                    <div className='flex flex-row gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight/>
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkTo={ctabtn2.linkTo}>
                    {ctabtn2.btnText}
                </CTAButton>

            </div>
        </div>

        {/* Section 2 */}
        <div className='h-fit flex flex-row text-[14px] w-[50%] py-4 leading-[22px] lg:w-[500px]'>
            {/*HW -> BG - Gradient */}

            <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p> 
                <p>10</p>
                <p>11</p>
            </div>

            <div className={`w-[90%] flex flex-col gap-2 font-bold font-none ${codeColor} pr-2`}>
                <TypeAnimation
                sequence={[codeBlock, 2000, ""]}
                repeat={Infinity}
                cursor={true}
                omitDeletionAnimation={true}

                style={{
                    whiteSpace: "pre-line",
                    display: "block"
                }}
                />
            </div>

        </div>

        </div>
    );
}

export default CodeBlocks;