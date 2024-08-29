import React, { useEffect, useState } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, updateDoc, getDocs, addDoc, deleteDoc, deleteField } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { GrGamepad } from 'react-icons/gr';
import { MdGamepad } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { CiHeart } from 'react-icons/ci';
import { FaArrowUp, FaHeart } from 'react-icons/fa';
import { PacmanLoader } from 'react-spinners';

const App = () => {
    const [body, setBody] = useState("");
    const [check, setCheck] = useState({});
    let [edit, setEdit] = useState({})
    const user = auth.currentUser;
    const allDataRef = collection(db, "users");
    const [allData, allLoading] = useCollectionData(allDataRef);

    const userQuery = user ? query(allDataRef, where("userId", "==", user.uid)) : null;
    const [userData, userLoading] = useCollectionData(userQuery);

    let [maxImg, setMaxImg] = useState(0)
    let [count, setCount] = useState({})


    useEffect(() => {
        let obj = {}
        allData && allData.map(item => { obj[item.id] = 0 })
        allData && allData.map(item => setMaxImg((prev) => ({
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
    const handleUp = () => {
        window.scrollTo({
            behavior: 'smooth',
            top: 0
        })
    }


    const dataRef = doc(db, "favorites", "WUnVJameS65ord2khDNv");
    const [infos, infoload] = useCollectionData(collection(db, "favorites"));
    // Object.keys(infos[0][user.uid]).map(item => console.log(item))
    // console.log(allData && allData.filter(item => Object.keys(infos[0][user.uid]).includes(item.id)))
    const userFavorites = (infos && infos[0] && infos[0][user.uid]) ? Object.keys(infos[0][user.uid]) : [];

    const filteredData = allData && allData.filter(item => userFavorites.includes(item.id));
    let [fav, setFav] = useState(JSON.parse(localStorage.getItem('fav')) || {})

    const handleDelete = async (itemId) => {
        let userFav = (infos && infos[0] && infos[0][user.uid]) ? infos[0][user.uid] : []
        // userFav = userFav.filter(favId => favId !== itemId)
        delete userFav[itemId]
        await updateDoc(dataRef, {
            [user.uid]: userFav
        })
        return userFav
    }
    if (allLoading || userLoading) {
        return (
            <div className='w-full absolute flex justify-center items-center left-0 top-0 h-[100vh] z-40 bg-[#171A21] '>
                <PacmanLoader color='#98BFFC' />
            </div>
        );
    }
    return (
        <div className={`space-grotesk ${filteredData.length <= 4 && "h-[80vh]"}`}>
            <button onClick={handleUp} className='text-[20px] bg-[#98BFFC] fixed bottom-0 md:m-10 m-6 my-20 p-3 rounded-md right-0 z-40'><FaArrowUp /></button>

            <h1 className='text-[35px] max-lg:text-[25px] py-5 space-grotesk'>Seçilmişlər</h1>
            {/* {console.log(userData.filter(item => item.select))} */}
            {/* -[#313641] */}
            <div>
                {filteredData.length > 0 ?
                    <ul className='grid grid-cols-4 max-lg:grid-cols-3 max-md:flex duration-300  flex-wrap justify-center justify-items-center gap-10 py-10'>
                        {filteredData && filteredData.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds).map((item, index) => (
                            <>
                                {
                                    <div className='relative w-max group overflow-hidden max-[556px]:w-full'>
                                        <div className='max-[556px]:w-full'>
                                            <button onClick={(e) => handleDec(e, item.id)} className={`absolute z-20 bg-[#CED0CF] ${count[item.id] == 0 ? "opacity-20 pointer-events-none" : "opacity-30"} group-hover:opacity-100 duration-300 text-black p-3 top-20 `}><IoIosArrowBack /></button>
                                            <div className={`absolute text-[25px] right-0 p-2 cursor-pointer z-30 text-red-500`} onClick={e => handleDelete(item.id)}><FaHeart /></div>
                                            {/* {console.log(infos[0].info.find(item=>item.id))} */}
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
                                }
                            </>
                        ))}
                    </ul>
                    : <h3 className='text-[20px] text-center py-[147px]'>Hal hazırda seçilmiş olan elan yoxdur. <br /> <NavLink to={"/"} className={"text-[#338cce] underline"}>Ana səhifəyə qayıt</NavLink></h3>

                }
            </div>



        </div>

    );
};

export default App;




