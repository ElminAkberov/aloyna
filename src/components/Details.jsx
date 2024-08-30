import React, { useEffect, useRef, useState } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, updateDoc, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Navigate, useParams } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward, IoMdCafe, IoMdClose } from 'react-icons/io';
import { PacmanLoader } from 'react-spinners';

const Details = () => {
  let { params } = useParams()
  const user = auth.currentUser;

  const allDataRef = collection(db, "users");
  const [allData, allLoading] = useCollectionData(allDataRef);

  let [maxImg, setMaxImg] = useState(0)
  let [count, setCount] = useState(0)
  useEffect(() => {
    let obj = {}
    allData && allData?.map(item => { obj[item.id] = 0 })
    allData && allData?.map(item => setMaxImg((prev) => ({
      ...prev,
      [item.id]: item.imageUrls.length - 1
    })))
    setCount(obj)
  }, [allData])

  const handleInc = (e, itemId) => {
    setCount((prev) => ({
      ...prev,
      [itemId]: maxImg[itemId] > prev[itemId] ? prev[itemId] + 1 : prev[itemId],
    }))
  }
  const handleDec = (e, itemId) => {
    setCount(prev => ({
      ...prev,
      [itemId]: prev[itemId] > 0 ? prev[itemId] - 1 : prev[itemId]
    }))
  }
  let [open, setOpen] = useState(false)
  let [load, setLoad] = useState(false)

  useEffect(() => {
    setLoad(true)
    setTimeout(() => {
      setLoad(false)
    }, 1000)
  }, [])
  
  if (load) {
    return (
      <div className='w-full absolute flex justify-center items-center left-0 top-0 h-[100vh] z-40 bg-[#171A21] '>
        <PacmanLoader color='#98BFFC' className='' />
      </div>
    )
  }
  return (
    <div className='space-grotesk '>
      <h3 className='text-[35px] max-lg:text-[25px]  py-5'>Elan haqqında</h3>
      {allData && allData?.filter(item => item.id == params).map(item => (
        <div className=''>
          {
            open &&
            <div className="absolute w-full min-[1400px]:h-[100vh] object-cover top-0 max-md:top-16 left-0 z-40">
              <div className="absolute z-20 text-center w-full bottom-0 md:text-[25px] ">
                <span>{count[item.id] + 1} / </span>
                <span>{item.imageUrls.length}</span>
              </div>
              <IoMdClose onClick={() => setOpen(!open)} className='text-[35px] font-bold cursor-pointer absolute z-40 right-10' />
              <img src={item.imageUrls[count[item.id]]} alt="" className='w-full relative h-full   duration-300  object-cover ' />
              <h4 className='absolute right-0 bottom-0 p-3  spartan font-semibold opacity-75'>AlOyna.az</h4>
              <button onClick={(e) => handleDec(e, item.id)} className={`absolute z-20 bg-[#CED0CF] ${count[item.id] == 0 ? "opacity-20 pointer-events-none" : "opacity-30"} group-hover:opacity-100 duration-300 text-black p-3 top-0 h-full left-0  `}><IoIosArrowBack /></button>
              <button onClick={(e) => handleInc(e, item.id)} className={`absolute  z-20 bg-[#CED0CF] ${maxImg < count[item.id] + 1 ? "opacity-20 pointer-events-none" : "opacity-30"}  group-hover:opacity-100 duration-300 text-black p-3 top-0 h-full right-0`}><IoIosArrowForward /></button>
            </div>
          }
          <div className={`relative cursor-pointer ${open && "opacity-20"} `}>
            <div className="absolute w-full ">
              <img src={item.imageUrls[count[item.id]]} alt="" className='w-full opacity-20 h-[500px] max-lg:h-[400px] max-md:h-[300px]  mx-auto duration-300 group-hover:scale-110 rounded-t-md object-cover ' />
            </div>
            <div className="absolute z-20 text-center md:text-[25px] w-full bottom-0">
              <span>{count[item.id] + 1} / </span>
              <span>{item.imageUrls.length}</span>
            </div>
            <img onClick={() =>{setOpen(!open);window.scrollTo(0,0)} } src={item.imageUrls[count[item.id]]} alt="" className='w-[800px] relative h-[500px] max-lg:h-[400px] max-md:h-[300px] max-lg:scale-90 mx-auto duration-300 group-hover:scale-110 rounded-t-md object-cover ' />
            <h4 className='absolute right-0 bottom-0 p-3  spartan font-semibold'>AlOyna.az</h4>
            <button onClick={(e) => handleDec(e, item.id)} className={`absolute h-full z-20 bg-[#CED0CF] ${count[item.id] == 0 ? "opacity-10 pointer-events-none" : "opacity-20"} group-hover:opacity-100 duration-300 text-black p-3 top-0 left-0  `}><IoIosArrowBack /></button>
            <button onClick={(e) => handleInc(e, item.id)} className={`absolute h-full  z-20 bg-[#CED0CF] ${maxImg > count[item.id] ? "opacity-10 pointer-events-none" : "opacity-20"}  group-hover:opacity-100 duration-300 text-black p-3 top-0 right-0`}><IoIosArrowForward /></button>
          </div>
          <div className="py-10">
            <div className="">
              <h5 className='text-[28px] max-lg:text-[20px] max-md:text-[18px] font-bold'>{item.info.price} AZN</h5>
              <h3 className='text-[32px] max-lg:text-[24px] max-md:text-[20px] font-thin capitalize'>{item.name}</h3>
              <p className='text-[18px] max-lg:text-[16px] max-md:text-[15px] mb-5'>{item.info.text}</p>
            </div>
            <hr className='border border-[#AFDAED]' />
            <div className="">
              <h3 className='text-[20px] max-lg:text-[18px] max-md:text-[16px] my-2'>Elan sahibi : <span className='spartan'>{item.info.name}</span></h3>
              <p className='text-[20px] max-lg:text-[18px] max-md:text-[16px] '>Əlaqə : <span className='spartan'>{item.info.number}</span></p>
            </div>
          </div>
        </div>
      ))}

    </div>
  )
}

export default Details