'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from "next/image";
import TopLogo from "./../../components/TopLogo";
import { Paytone_One} from "next/font/google";
const paytone_one = Paytone_One({ subsets: ["latin"], weight: '400' });
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const useWebcam = ({
    videoRef
  }) => {
    useEffect(() => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true}).then((stream) => {
          if (videoRef.current !== null) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        });
      }
    }, [videoRef]);
};
// let waktuBatasTake;

export default function Cam() {
    const router = useRouter();
    const [enabled, setEnabled] = useState(false);
    const [captured, setCaptured] = useState(false);
    // const [countDown, setCoundown] = useState(5);
    // const [counter, setCounter] = useState(60);
    // const waktuBatasTake = useRef(null);
    const videoRef = useRef(null);
    const previewRef = useRef(null);

    useWebcam({ videoRef,previewRef});

    const captureVideo  = ({
        width = 512,
        height = 512,
    }) => {
        setCaptured(true)
        setTimeout(() => {
            setEnabled(true)
            setCaptured(null)
            const canvas = previewRef.current;
            const video = videoRef.current;
            video.play;
            if (canvas === null || video === null) {
                return;
            }
        
            // Calculate the aspect ratio and crop dimensions
            const aspectRatio = video.videoWidth / video.videoHeight;
            let sourceX, sourceY, sourceWidth, sourceHeight;
        
            if (aspectRatio > 1) {
                // If width is greater than height
                sourceWidth = video.videoHeight;
                sourceHeight = video.videoHeight;
                sourceX = (video.videoWidth - video.videoHeight) / 2;
                sourceY = 0;
            } else {
                // If height is greater than or equal to width
                sourceWidth = video.videoWidth;
                sourceHeight = video.videoWidth;
                sourceX = 0;
                sourceY = (video.videoHeight - video.videoWidth) / 2;
            }
        
            // Resize the canvas to the target dimensions
            canvas.width = width;
            canvas.height = height;
        
            const context = canvas.getContext('2d');
            if (context === null) {
                return;
            }
        
            // Draw the image on the canvas (cropped and resized)
            context.drawImage(
                video,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                width,
                height
            );
    
            let faceImage = canvas.toDataURL();
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem("faceImage", faceImage)
            }
            // setTimeout(() => {
            //     router.push('/generate');
            // }, 1250);
        }, 3000);
    }

    const retake = () => {
        setEnabled(false)
    }

    // useEffect(() => {
    //     const timer =
    //     counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    //     return () => clearInterval(timer);
    // }, [counter]);

    // const countDownTrigger = () => {
    //     // const timer =
    //     // counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    //     // return () => clearInterval(timer);
    //     setInterval(() => setCoundown(countDown - 1), 1000)


    //     // setCoundown
    //     // waktuBatasTake = setInterval(function() {
    //     //     setCoundown(countDown - 1)
    //     //     // countdownNumberEl.textContent = countdown;
    //     //     console.log(countDown)
    //     // }, 1000);

    //     // setTimeout(() => {
    //     //     console.log("WAKWAW")
    //     // }, 5000);
    // }
    // 
    // function countDownTimer(){
    //     var countdownNumberEl = document.querySelector('#countdownTake');
    //     var countdown = 3;
    //     countdownNumberEl.textContent = countdown;
    
    //     waktuBatasTake = setInterval(function() {
    //       countdown = --countdown <= 0 ? 5 : countdown;
    //       countdownNumberEl.textContent = countdown;
    //     }, 1000);
    // }
    // waktuBatasTake = clearInterval(waktuBatasTake);
    return (
        <main className="flex fixed h-full w-full bg overflow-auto flex-col items-center justify-top pt-2 pb-5 px-5 lg:pt-12 lg:px-20">
            <TopLogo></TopLogo>
            <h1 className={`text-center text-xl mt-[-.7rem] lg:mt-0 lg:text-7xl lg:mb-5 ${paytone_one.className}`}>SAY &#34;CHEESEE&#34;</h1>
            {/* {countDown} */}
            <div className="relative w-full flex flex-col justify-center items-center mt-2 mb-3 lg:mt-8 lg:mb-10">
                <div className='relative'>
                    {/* {!enabled && 
                    <div className='absolute top-0 left-0 right-0 bottom-0 w-[50%] mx-auto flex justify-center items-center pointer-events-none z-10'>
                        <Image src='/icon-capture.png' width={389} height={220} alt='Zirolu' className='w-full' priority />
                    </div>
                    } */}

                    {captured && 
                    <div className='absolute top-0 left-0 right-0 bottom-0 w-[100px] h-[100px] lg:w-[174px] lg:h-[174px] overflow-hidden m-auto flex justify-center items-center pointer-events-none z-10'>
                        <div className='w-full animate-countdown translate-y-[35%]'>
                            <Image src='/countdown.png' width={174} height={522} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div>
                    }

                    {!enabled && 
                    <div className='w-[70%] mx-auto absolute left-0 right-0 bottom-0 z-10'>
                        <Image src='/frame-pose.png' width={426} height={461} alt='Zirolu' className='w-full' priority />
                    </div>
                    }

                    <video ref={videoRef} className={`w-[80%] lg:w-full mx-auto border-2 border-[#ffffff] rounded-sm ${enabled ? 'absolute opacity-0':'relative'}`} playsInline height={512}></video>
                    <canvas ref={previewRef} width="512" height="512" className={`${enabled ? 'relative':'absolute opacity-0'} w-[80%] lg:w-full top-0 left-0 right-0 mx-auto pointer-events-nones border-2 border-[#ffffff] rounded-sm`}></canvas>
                </div>
            </div>


            {!enabled && 
                <p className='block text-center text-sm lg:text-2xl mt-1 mb-3 lg:mt-4 text-white'>*Ikuti frame pose dan tidak terlalu zoom</p> 
            }
            
            {/* <div className="py-5 flex items-center justify-center">
                <button
                className="py-3 px-4 bg-indigo-700 text-white text-lg rounded"
                onClick={() => {
                    setEnabled(!enabled);
                }}
                >
                {enabled ? 'Stop' : 'Start'}
                </button>
                <button
                className="py-3 px-4 bg-indigo-700 text-white text-lg rounded"
                onClick={captureVideo}
                >
                    Capture
                </button>
            </div> */}
            {!enabled && 
                <div className="relative w-full flex justify-center items-center">
                    <button className="relative mx-auto flex  w-[70%] justify-center items-center" onClick={captureVideo}>
                        <Image src='/btn-capture.png' width={410} height={96} alt='Zirolu' className='w-full' priority />
                    </button>
                </div>
            }
            <div className={`relative w-full ${!enabled ? 'hidden' : ''}`}>
                <div className="relative w-[60%] mx-auto flex justify-center items-center flex-col mt-0 lg:mt-5">
                    <Link href='/avatar/generate' className="block w-full relative mx-auto flex justify-center items-center">
                        <Image src='/btn-next.png' width={410} height={96} alt='Zirolu' className='w-full' priority />
                    </Link>
                    {/* <button className="relative mx-auto flex justify-center items-center">
                        <Image src='/btn-download.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                    </button> */}
                    <button className="relative mx-auto flex justify-center items-center mt-2" onClick={retake}>
                        <Image src='/btn-retake.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                    </button>
                    {/* <a href='/cam' className="relative mx-auto flex justify-center items-center">
                        <Image src='/btn-retake.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                    </a> */}
                </div>
            </div>
        </main>
    );
}
