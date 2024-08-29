import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db, storage } from "../firebase"
import { NavLink, useNavigate } from 'react-router-dom'
import { collection } from 'firebase/firestore'
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Typewriter from "typewriter-effect";
import { IoGameControllerOutline } from 'react-icons/io5'
import { FaInfo } from 'react-icons/fa'
const SignUp = () => {
    let navigate = useNavigate()
    let [error, setError] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [file, setFile] = useState("")
    let [name, setName] = useState('')

    let [user] = useAuthState(auth)
    const allDataRef = collection(db, "users");

    const handleFile = (e) => {
        let file = e.target.files[0]
        setFile(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;

            const storageRef = ref(storage, `profiles/${file.name}-${new Date().getTime()}`);
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);
            await updateProfile(user, { photoURL: fileUrl, displayName: name });
            setError(false)
            navigate("/sign-in")
        } catch (error) {
            setError(true)
            console.error(error);
        }
    };
    console.log(user)
    return (
        <>
            <div className='overflow-hidden flex flex-col items-center justify-center relative h-[100vh] space-grotesk '>
                <img src="/assets/img/god.jpg" className='w-full absolute -z-10 object-cover h-full' alt="" />
                <div className=" bg-white/70 relative p-8 px-10 max-md:p-6 duration-300 rounded-lg">
                    <div className="absolute top-[-55px] w-full text-center gradient-blue text-[18px] left-0"><span><Typewriter onInit={(typewriter) => { typewriter.typeString("Azərbaycanın ilk oyun satış platforması olan").pauseFor(1000).deleteAll().typeString('<span class="" style="font-size:25px;font-weight:900;">AlOyna.az</span><span>-a xoş gəldin.</span>').start() }} /></span></div>
                    <h3 className='text-center text-[20px] mb-5 font-bold '>Qeydiyyat </h3>
                    <form onSubmit={(e) => handleSubmit(e)} className='relative z-20'>
                        <div className='text-red-600'>{error && `Bu istifadəçi artıq mövcuddur`} </div>
                        <div className="">
                            <label htmlFor="name" className='font-bold' >Adınızı qeyd edin</label>
                            <input onChange={(e) => { setName(e.target.value) }} type="text" placeholder='Adını daxil et' className='block shadow-xl bg-transparent border placeholder:text-[#414142] my-1  border-white  rounded-sm outline-none p-2 px-3 ' required />
                        </div>
                        <div className="relative">
                            <FaInfo className="absolute info right-2 text-[#4482f7] bottom-3" />
                            <div className='absolute xahis bg-[#012136] bottom-10 text-white text-[12px] p-2 rounded-sm'>
                                Xahiş olunur düzgün email daxil edin.Şifrəni unutduğunuz zaman sms həmin emailə yönəldilir.
                            </div>
                            <label htmlFor="email" className='font-bold'>Email adresiniz</label>
                            <input type="email" placeholder='Email daxil et' value={email} onChange={(e) => { setEmail(e.target.value) }} required className='block  shadow-xl outline-none placeholder:text-[#414142] my-1 bg-transparent border border-white rounded-sm p-2 px-3' />
                        </div>
                        <div className="">
                            <label htmlFor="password" className='font-bold'>Şifrə</label>
                            <input type="password" placeholder='Şifrəni daxil et' value={password} onChange={(e) => { setPassword(e.target.value) }} required className='block shadow-md placeholder:text-[#414142] my-1 outline-none bg-transparent border border-white rounded-sm p-2 px-3' />
                        </div>
                        <button type="submit" className='justify-center  gap-x-3 items-center flex w-full hover:bg-[#00172E] hover:shadow-xl duration-[400ms] bg-[#012136] text-white py-2 rounded-sm mt-2'>
                            Hesab yarat
                            <IoGameControllerOutline className='text-[20px]  shake' />
                        </button>
                        <p className='text-center  mt-2'>Hesabın var ? <NavLink to={"/sign-in"} className={"text-[#386cce] underline"}>Daxil ol</NavLink></p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUp