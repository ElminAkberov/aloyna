import React, { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useAuthState } from "react-firebase-hooks/auth"
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useCollectionData } from "react-firebase-hooks/firestore"
import Header from './Header/Header'
import Footer from './Footer/Footer'
import "./style/index.css"
import { PacmanLoader } from 'react-spinners'
import { GrGamepad } from 'react-icons/gr'
import { MdGamepad } from 'react-icons/md'
const MainLayout = () => {
    let location = useLocation()
    let [user, loading] = useAuthState(auth)
    let [load, setLoad] = useState(false)

    useEffect(() => {
        setLoad(true)
        setTimeout(() => {
            setLoad(false)
        }, 2000)
        window.scrollTo(0, 0)
    }, [location])

    const handleClick = () => {
        signOut(auth)
    }

    if (loading || load) {
        return (
            <div className='w-full absolute flex justify-center items-center left-0 top-0 h-[100vh] z-40 bg-[#171A21] '>
                <PacmanLoader color='#98BFFC' />
            </div>
        )
    }

    if (!user) {
        return (
            <Navigate to={"/sign-in"} />
        )
    }
    return (
        <>
            <Header />
            <div className="bg-[#171A21] pb-28  text-white">
                <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 '>
                    <Outlet />
                    <div className="h-[10vh] md:opacity-0 md:invisible z-40 space-grotesk text-[#212630] flex justify-between  shadow-[0_0_15px_#fff] duration-300 bg-white w-full left-0 fixed bottom-0 py-1 px-[30px]">
                        <NavLink to={"/"}>
                            <div className='flex flex-col items-center '>
                                <GrGamepad fill='gradient-text' className=' text-[30px] ' />
                                <h4 className=''>Əsas</h4>
                            </div>
                        </NavLink>
                        <NavLink to={"/add"}>
                            <div className='flex flex-col items-center  '>
                                <MdGamepad className='relative bottom-4 bg-[#171A21] min-h-[40px] text-[#fff] rounded-full scale-125  text-[40px]' />
                                <h4 className='font-bold relative bottom-2'>Elan Yarat</h4>
                            </div>
                        </NavLink>
                        <NavLink to={"/user"}>
                            <div className='flex flex-col items-center'>
                                <img src={`${(user.photoURL && user.photoURL.includes("undefined") || !user.photoURL) ? "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" : user.photoURL} `} className='w-[30px] h-[30px] mx-auto rounded-full object-cover' alt="" />
                                <h4>Profil</h4>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default MainLayout