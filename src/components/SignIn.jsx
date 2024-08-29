import React, { useState } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, updateDoc, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, storage } from '../firebase'; // storage'ı import edin
import { getAuth, signInWithEmailAndPassword, updatePassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth"
import Typewriter from "typewriter-effect";

const SignIn = () => {
    let navigate = useNavigate()
    let [error, setError] = useState("")
    let [user, loading] = useAuthState(auth)
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [change, setChange] = useState("")
    let [check, setCheck] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log("Signed in successfully");
                setError(false)
                navigate("/")
            })
            .catch((error) => {
                if (error.code === "auth/too-many-requests") {
                    navigate('/forget')
                } else {
                    setError(true)
                    console.error("Error signing in:", error);
                }
            });
    };
    const handleChange = (e) => {
        e.preventDefault()
        if (!loading && user) {
            updatePassword(user, change)
                .then(() => {
                    console.log("Password changed successfully");
                }).catch(error => {
                    console.error("Error changing password: ", error);
                });
        } else {
            console.error("User is not authenticated.");
        }
    }
    const handleCheck = (e) => {
        setCheck(e.target.checked)
    }
    return (
        <div>
            <div className='overflow-hidden flex flex-col items-center justify-center relative h-[100vh] space-grotesk '>
                <img src="/assets/img/god4.jpg" className='w-full absolute -z-10 object-cover h-full' alt="" />
                <div className=" bg-white/50 relative p-8 px-10 max-md:p-6 duration-300 rounded-lg">
                    <div className="absolute top-[-55px] w-full text-center  gradient-blues text-[18px] left-0"><span><Typewriter onInit={(typewriter) => { typewriter.typeString("Oyun hesabları,Oyunlar,Oyun ləvazimatları və daha çoxunu...").pauseFor(1000).deleteAll().typeString('<span style="font-size:25px;font-weight:900;">AlOyna.az</span><span>-da sat.</span>').start() }} /></span></div>
                    <h3 className='text-center text-[20px] mb-5 font-bold '>Daxil ol</h3>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="text-red-600">{error && `Məlumatları düzgün daxil edin`}</div>
                        <div className="">
                            <label htmlFor="name" className='font-bold '>Email adresiniz</label>
                            <input type="email" placeholder='Email daxil et' required className='block w-full  shadow-xl outline-none placeholder:text-[#414142] my-1 bg-transparent border border-white rounded-sm p-2 px-3' value={email} onChange={(e) => { setEmail(e.target.value) }} style={{ display: "block" }} />
                        </div>
                        <div className="">
                            <label htmlFor="name" className='font-bold '>Şifrə</label>
                            <input type="text" placeholder='Şifrəni daxil et' required className='block w-full  shadow-xl outline-none placeholder:text-[#414142] my-1 bg-transparent border border-white rounded-sm p-2 px-3' value={password} onChange={(e) => { setPassword(e.target.value) }} style={{ display: "block" }} />
                        </div>
                        
                        <button type="submit" className=' w-full hover:bg-[#00172E] hover:shadow-xl duration-[400ms] bg-[#012136] text-white py-2 rounded-sm mt-2'>Daxil ol</button>
                        <p className={"text-right text-[#386cce]  hover:underline"}><NavLink to={"/forget"} >Şifrəni unuttun?</NavLink></p>
                        <p className='text-center '>Hesabın yoxdur? <NavLink to={"/sign-up"} className={"text-[#386cce] hover:underline"}>Qeydiyyat</NavLink></p>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default SignIn
