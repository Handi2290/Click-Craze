'use client';

import * as fal from '@fal-ai/serverless-client';
import { useEffect, useRef, useState, useMemo } from 'react';
import TopLogoMagnum from "../../components/TopLogoMagnum";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// @snippet:start(client.config)
fal.config({
    // credentials: 'FAL_KEY_ID:FAL_KEY_SECRET',
    requestMiddleware: fal.withProxy({
      targetUrl: '/api/fal/proxy', // the built-int nextjs proxy
      // targetUrl: 'http://localhost:3333/api/fal/proxy', // or your own external proxy
    }),
});


let streamCam = null;
const useWebcam = ({
    videoRef
  }) => {
    useEffect(() => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true}).then((stream) => {
            streamCam = stream
            window.localStream = stream
          if (videoRef.current !== null) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        });
      }
    }, [videoRef]);
};

let FACE_URL_RESULT = ''
let FACE_URL_RESULT2 = ''
let FACE_URL_RESULT3 = ''
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
            setImageFile(faceImage)
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


    // AI
    const [imageFile, setImageFile] = useState(null);
    const [imageFile2, setImageFile2] = useState(null);
    const [imageFile3, setImageFile3] = useState(null);
    const [styleFix, setStyleFix] = useState(null);
    const [styleFix2, setStyleFix2] = useState(null);
    const [styleFix3, setStyleFix3] = useState(null);
    const [formasiFix, setFormasiFix] = useState(null);
    const [numProses, setNumProses] = useState(0);
    const [numProses1, setNumProses1] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [resultFaceSwap, setResultFaceSwap] = useState(null);
    const [resultFaceSwap2, setResultFaceSwap2] = useState(null);
    const [resultFaceSwap3, setResultFaceSwap3] = useState(null);
    const [logs, setLogs] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    // @snippet:end
    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item1 = localStorage.getItem('styleFix')
            const item2 = localStorage.getItem('styleFix2')
            const item3 = localStorage.getItem('styleFix3')
            // const item4 = localStorage.getItem('formasiFix')
            setStyleFix(item1)
            setStyleFix2(item2)
            setStyleFix3(item3)
            // setFormasiFix(item4)
        }
    }, [styleFix, styleFix2, styleFix3])

    const generateAI = () => {
        setNumProses1(true)
        generateImageSwap()

        // videoRef.current.stop();
        // videoRef.current.srcObject = ''
        // streamCam.getVideoTracks()[0].stop();
        // console.log(streamCam)

        
        // localStream.getVideoTracks()[0].stop();
        // console.log(streamCam)
        // console.log(videoRef)
        // videoRef.src=''
        // STOP CAM
        // streamCam.getTracks().forEach(function(track) {
        //     track.stop();
        // });
    }

    const reset2 = () => {
      setLoading(false);
      setError(null);
      setElapsedTime(0);
    };
    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))

    const generateImageSwap = async () => {
        setNumProses(2)
        reset2();
        // @snippet:start("client.queue.subscribe")
        setLoading(true);
        const start = Date.now();
        try {
        const result = await fal.subscribe(
            'fal-ai/face-swap',
            {
            input: {
                base_image_url: styleFix,
                swap_image_url: imageFile
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
                setElapsedTime(Date.now() - start);
                if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
                ) {
                setLogs((update.logs || []).map((log) => log.message));
                }
            },
            }
        );
        setResultFaceSwap(result);
        FACE_URL_RESULT= result.image.url;

        toDataURL(FACE_URL_RESULT)
        .then(dataUrl => {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem("resulAIBase64", dataUrl)
            }
            setTimeout(() => {
                // router.push('/magnumotion/result');
                generateImageSwap2()
            }, 500);
        })
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
            setElapsedTime(Date.now() - start);
        }
        // @snippet:end
    };

    const generateImageSwap2 = async () => {
        const urlGambar = styleFix2;
        console.log(urlGambar)
        setNumProses(3)
        reset2();
        // @snippet:start("client.queue.subscribe")
        setLoading(true);
        const start = Date.now();

        try {
        const result = await fal.subscribe(
            'fal-ai/face-swap',
            {
            input: {
                base_image_url: styleFix2,
                swap_image_url: imageFile
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
                setElapsedTime(Date.now() - start);
                if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
                ) {
                setLogs((update.logs || []).map((log) => log.message));
                }
            },
            }
        );
        setResultFaceSwap2(result);
        FACE_URL_RESULT2 = result.image.url;

        toDataURL(FACE_URL_RESULT2)
        .then(dataUrl => {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem("resulAIBase642", dataUrl)
                localStorage.setItem("faceURLResult2", FACE_URL_RESULT2)
            }
            setTimeout(() => {
                // router.push('/mizuho/result');
                generateImageSwap3()
            }, 500);
        })
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
            setElapsedTime(Date.now() - start);
        }
        // @snippet:end
    };
    const generateImageSwap3 = async () => {
        const urlGambar = styleFix3;
        console.log(urlGambar)

        setNumProses(4)
        reset2();
        // @snippet:start("client.queue.subscribe")
        setLoading(true);
        const start = Date.now();

        try {
        const result = await fal.subscribe(
            'fal-ai/face-swap',
            {
            input: {
                base_image_url: styleFix3,
                swap_image_url: imageFile
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
                setElapsedTime(Date.now() - start);
                if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
                ) {
                setLogs((update.logs || []).map((log) => log.message));
                }
            },
            }
        );
        setResultFaceSwap3(result);
        FACE_URL_RESULT3= result.image.url;

        toDataURL(FACE_URL_RESULT3)
        .then(dataUrl => {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem("resulAIBase643", dataUrl)
                localStorage.setItem("faceURLResult3", FACE_URL_RESULT3)
            }
            setTimeout(() => {
                router.push('/magnumotion/result');
            }, 500);
        })
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
            setElapsedTime(Date.now() - start);
        }
        // @snippet:end
    };

    return (
        <main className="flex fixed h-full w-full bg-magnumotion overflow-auto flex-col items-center justify-center pt-2 pb-5 px-5 lg:pt-12 lg:px-20">
            <div className={`fixed top-10 w-[100%] mx-auto flex justify-center items-center z-50 ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <TopLogoMagnum></TopLogoMagnum>
            </div>
            {/* <div  className={`relative w-[50%] mx-auto mt-[-5rem] ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <Image src='/iqos/title-take.png' width={356} height={62} alt='Zirolu' className='w-full' priority />
            </div> */}
            {/* LOADING */}
            {numProses1 && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col z-20'>
                    {/* <div className='relative w-[250px] h-[78px] lg:w-[555px] lg:h-[180px] overflow-hidden'>
                        <div className='animate-loading1 absolute left-0 top-0 w-full mx-auto flex justify-center items-center pointer-events-none'>
                            <Image src='/loading.png' width={770} height={714} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div> */}

                    <div className="relative w-[70%] mx-auto mb-5">
                        <Image src='/magnumotion/logo.png' width={207} height={53} alt='Zirolu' className='w-full' priority />
                    </div>
                    <div className='animate-upDownCepet relative py-2 px-4 mt-5 lg:mt-10 lg:p-5 lg:text-4xl border-2 border-[#201E28] text-center bg-[#33303D] text-[#fff] lg:font-bold'>
                        <p>{`Please wait, loading...`}</p>
                        <p>{`Process : ${(elapsedTime / 1000).toFixed(2)} seconds (${numProses} of 4)`}</p>
                        {error}
                    </div>

                    <pre className='relative py-2 px-4 mt-5 lg:mt-10 border-2 border-[#201E28] text-left bg-[#33303D] text-[#fff] text-xs lg:text-sm overflow-auto no-scrollbar h-[100px] w-[60%] mx-auto'>
                        <code>
                        {logs.filter(Boolean).join('\n')}
                        </code>
                        AI generate face... <br></br>
                        Loading model..<br></br>
                    </pre>
                </div>
            }
            {/* LOADING */}
            <div className={`relative w-full flex flex-col justify-center items-center mt-2 mb-3 lg:mt-8 lg:mb-10 ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className='relative lg:w-full'>
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
                    <div className='w-[52%] mx-auto absolute left-0 right-0 bottom-0 z-10'>
                        <Image src='/frame-pose.png' width={426} height={461} alt='Zirolu' className='w-full' priority />
                    </div>
                    }

                    <video ref={videoRef} className={`w-[80%] lg:w-full mx-auto border-2 border-[#ffffff] rounded-sm ${enabled ? 'absolute opacity-0':'relative'}`} playsInline height={512}></video>
                    <canvas ref={previewRef} width="512" height="512" className={`${enabled ? 'relative':'absolute opacity-0'} w-[80%] lg:w-full top-0 left-0 right-0 mx-auto pointer-events-nones border-2 border-[#ffffff] rounded-sm`}></canvas>
                </div>
            </div>


            {!enabled && 
                <p className='block text-center text-sm lg:text-4xl mt-1 mb-3 lg:mt-4 text-white'>*Ikuti garis pose dan tidak terlalu zoom</p> 
            }
            {!enabled && 
                <div className="relative w-full flex justify-center items-center">
                    <button className="relative mx-auto flex  w-[80%] justify-center items-center" onClick={captureVideo}>
                        <Image src='/magnumotion/btn-capture.png' width={750} height={224} alt='Zirolu' className='w-full' priority />
                    </button>
                </div>
            }
            <div className={`relative w-full ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <div className={`relative w-full ${!enabled ? 'hidden' : ''}`}>
                <div className="relative w-[75%] mx-auto flex justify-center items-center flex-col mt-0">
                    <button className="w-full relative mx-auto flex justify-center items-center" onClick={generateAI}>
                        <Image src='/magnumotion/btn-next.png' width={750} height={224} alt='Zirolu' className='w-full' priority />
                    </button>
                    {/* <button className="relative mx-auto flex justify-center items-center">
                        <Image src='/btn-download.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                    </button> */}
                    <button className="relative w-full mx-auto flex justify-center items-center mt-3" onClick={retake}>
                        <Image src='/magnumotion/btn-retake.png' width={750} height={224} alt='Zirolu' className='w-full' priority />
                    </button>
                    {/* <a href='/cam' className="relative mx-auto flex justify-center items-center">
                        <Image src='/btn-retake.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                    </a> */}
                </div>
            </div></div>
        </main>
    );
}
