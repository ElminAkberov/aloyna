import React, { useEffect, useState } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, updateDoc, getDocs, deleteField, addDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { GrGamepad } from 'react-icons/gr';
import { MdGamepad } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FaArrowCircleUp, FaArrowUp, FaHeart } from 'react-icons/fa';
import { PacmanLoader } from 'react-spinners';
import { GoFilter } from 'react-icons/go';
import { RiEqualizer3Line } from 'react-icons/ri';
import { FaUpDown } from 'react-icons/fa6';

const App = () => {
  const [check, setCheck] = useState({});
  const user = auth.currentUser;

  const allDataRef = collection(db, "users");
  const [allData, allLoading] = useCollectionData(allDataRef);

  const userQuery = user ? query(allDataRef, where("userId", "==", user.uid)) : null;
  const [userData, userLoading] = useCollectionData(userQuery);

  let [search, setSearch] = useState("")
  let [maxImg, setMaxImg] = useState(0)
  let [count, setCount] = useState(0)
  let [open, setOpen] = useState(false)
  let [loading, setLoading] = useState(false)
  let [category, setCategory] = useState("")
  let [price, setPrice] = useState({ min: 0, max: Infinity })
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
  let [target, setTarget] = useState("")

  const handleClick = () => {
    setTarget(search)
  }
  const categoryChoice = (e) => {

    const { value, name } = e.target
    setPrice(prev => ({
      ...prev,
      [name]: Number(value)
    }))
  }
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1200)

  }, [category, price, target])

  const dataRef = doc(db, "favorites", "WUnVJameS65ord2khDNv");
  const [infos, infoload] = useCollectionData(collection(db, "favorites"));

  const handleShow = async (itemId) => {
    setCheck(prev => {
      const updatedCheck = { ...prev, [itemId]: !prev[itemId] };

      const userUID = user.uid;

      const updateFavorite = async () => {
        const docSnap = await getDoc(dataRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const userFavorites = data[userUID] || {};

          if (updatedCheck[itemId]) {
            userFavorites[itemId] = true;
          } else {
            delete userFavorites[itemId];
          }

          await updateDoc(dataRef, {
            [userUID]: userFavorites
          });
        } else {
          console.error("Belge bulunamadı");
        }
      };

      updateFavorite();

      return updatedCheck;
    });
  };

  const handleUp = () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }
  let date = new Date()
  const aylar = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
  // 30 gune silmek
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const currentDate = new Date();
  //     const formattedDate = `${currentDate.getDate()} ${aylar[currentDate.getMonth()]},${currentDate.getHours()}:${currentDate.getMinutes()}`;
  //     allData && allData.filter(item => formattedDate === item.expDate).map(item => item);
  //   }, 60000);

  //   const currentDate = new Date();
  //   const formattedDate = `${currentDate.getDate()} ${aylar[currentDate.getMonth()]},${currentDate.getHours()}:${currentDate.getMinutes()}`;
  //   allData && allData.filter(item => formattedDate === item.expDate).map(item => item);

  //   return () => clearInterval(interval);
  // }, [allData, aylar]);

  if (allLoading || userLoading) {
    return (
      <div className='w-full absolute flex justify-center items-center left-0 top-0 h-[100vh] z-40 bg-[#171A21] '>
        <PacmanLoader color='#98BFFC' />
      </div>
    );
  }
  return (
    <div className={`space-grotesk ${allData.length <= 4 && "md:h-[80vh]"}`}>
      <button onClick={handleUp} className='text-[20px] bg-[#98BFFC] fixed bottom-10 md:m-7 md:my-3 m-6 my-14 p-3 rounded-md right-0 z-40'><FaArrowUp /></button>
      <h1 className='text-[35px] max-lg:text-[25px] py-5 space-grotesk'>Bütün Elanlar</h1>
      <h3 className='text-[25px] my-3'>Elan Axtar</h3>
      <div className="flex max-[450px]:flex-col justify-between gap-x-5 duration-300 mx-auto pb-10">
        <input placeholder='Məs.Pubg,Gta 5,Clash of Clans və s.' type="text" onChange={(e) => setSearch(e.target.value)} className='outline-none w-full duration-300 text-white px-2 bg-[#171A21] border-2 border-[#afdaed] rounded-md py-[6px] max-lg:w-[85%] max-[450px]:w-full max-[450px]:mb-5' />
        <button onClick={handleClick} className='bg-[#98BFFC] text-[#171A21] font-semibold  hover:text-[#98BFFC] border-[#98BFFC] border  hover:bg-[#171A21]  duration-[400ms] px-5 py-1 rounded-md'>Axtar</button>
      </div>
      <div className='relative'>
        <button onClick={() => setOpen(!open)} className='bg-[white] gap-x-1 text-[#393F4A] flex items-center text-[18px] rounded-full  p-2 px-16 '>
          Filter
          <RiEqualizer3Line />
        </button>
        {<div className={`bg-[#393F4A] ${!open ? "opacity-0 invisible" : "opacity-100"}  duration-300  rounded-md mt-3 absolute w-full z-40  p-2 md:flex justify-evenly`}>
          <div className="">
            <h3 className='mb-2'>Kateqoriya seç</h3>
            {["Bütün Kateqoriyalar", "Oyun Hesabı", "Oyun Ləvazimatı", "Oyun Konsolları", "PC oyunları", "PlayStation oyunları"].map((item, index) => (
              <label class="container">
                <span className='text-[15.5px]'>{item}</span>
                <input onChange={e => setCategory(e.target.parentNode.innerText == "Bütün Kateqoriyalar" ? "" : e.target.parentNode.innerText)} type="radio" name="name" />
                <span class="checkmark"></span>
              </label>
            ))}
          </div>
          <div className="">
            <h3 className='mb-2'>Qiymət</h3>
            <div className="flex gap-x-2 max-[300px]:flex-col md:justify-between items-center">
              <input onChange={categoryChoice} name='min' type="number" className='bg-transparent border-[#AFDAED] border outline-none rounded-md w-[100px] p-2' placeholder='Min' />
              <p>-</p>
              <input onChange={categoryChoice} name='max' type="number" className='bg-transparent border-[#AFDAED] border outline-none rounded-md w-[100px] p-2' placeholder='Max' />
              <p>AZN</p>
            </div>
          </div>
        </div>
        }
      </div>
      <div>
        {allData && allData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds).filter(item => (item.name.includes(target) && item.category.includes(category) && (item.info.price > price["min"] && item.info.price <= price["max"]))).length > 0 ?
          <>
            <div>
              {loading ? <div className='flex justify-center py-12 opacity-100 duration-300 '><PacmanLoader color='white' /></div> :
                <ul className='grid grid-cols-4  max-lg:grid-cols-3 max-md:flex duration-300  flex-wrap justify-between justify-items-center gap-10 py-10'>
                  <>
                    {allData && allData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds).filter(item => (item.name.includes(target) && item.category.includes(category) && (item.info.price > price["min"] && item.info.price <= price["max"]))).map((item, index) => (
                      <div className='relative w-max group overflow-hidden max-[556px]:w-full'>
                        <div className='max-[556px]:w-full '>
                          <button onClick={(e) => handleDec(e, item.id)} className={`absolute z-20 bg-[#CED0CF] ${count[item.id] == 0 ? "opacity-20 pointer-events-none" : "opacity-30"} group-hover:opacity-100 duration-300 text-black p-3 top-20 `}><IoIosArrowBack /></button>
                          <div className={`absolute text-[25px] right-0 p-2 cursor-pointer z-30 ${infos && infos[0] && infos[0][user.uid] && infos[0][user.uid][item.id] ? 'text-red-500' : ''}`} onClick={e => handleShow(item.id)}><FaHeart /></div>
                          {console.log()}
                          <h4 className='absolute right-0 bottom-0 p-3 text-[12px]  spartan font-semibold z-30'>AlOyna.az</h4>
                          <img src={item.imageUrls[count[item.id]]} alt="" className='w-[250px] group-hover:scale-110  max-[556px]:w-full max-[1200px]:w-[220px] max-md:w-[250px] max-md:h-[150px] duration-300 max-[1200px]:h-[150px] h-[220px] object-cover' />
                          <button onClick={(e) => handleInc(e, item.id)} className={`absolute  z-20 bg-[#CED0CF] ${maxImg < count[item.id] + 1 ? "opacity-20 pointer-events-none" : "opacity-30"}  group-hover:opacity-100 duration-300 text-black p-3 top-20 right-0`}><IoIosArrowForward /></button>
                        </div>
                        <NavLink className={" inline-block w-full relative  z-10"} to={`/details/${item.id}`}>
                          <div className="card-body bg-[#393f4a] rounded-b-md p-3">
                            <h3 className='text-[20px] max-lg:text-[18px] max-md:text-[16px] font-bold'>{item.info.price} AZN</h3>
                            <h3 key={index} className='text-[20px] max-lg:text-[18px] max-md:text-[16px] font-thin capitalize'>{item.name}</h3>
                            <p className='text-[15px] text-[#ccc]'>{item.date}</p>
                          </div>
                        </NavLink>
                      </div>
                    ))}
                  </>
                </ul>
              }
            </div>
          </>
          : <h3 className='text-[20px] text-center py-44'>Hal hazırda aktiv olan elan yoxdur <br /> <NavLink to={"/add"} className={"text-[#338cce] underline"}>Yeni elan yarat</NavLink></h3>
        }
      </div>

    </div>

  );
};

export default App;
