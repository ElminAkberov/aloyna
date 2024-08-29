import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from "../firebase"
import Typewriter from "typewriter-effect";

const SignUp = () => {
  let [email, setEmail] = useState("")
  let [click, setClick] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    sendPasswordResetEmail(auth, email).then(e => setClick(true)).catch(e => console.error(e))
  }
  
  return (
    <>
      <div className='overflow-hidden flex flex-col items-center justify-center relative h-[100vh] space-grotesk '>
        <img src="/assets/img/god3.jpg" className='w-full absolute -z-10 object-cover h-full' alt="" />
        <div className=" bg-white/70 relative p-8 px-10 max-md:p-6 duration-300 rounded-lg">
          <div className="absolute top-[-55px] w-full text-center gradient-blue  text-[18px] left-0"><span><Typewriter onInit={(typewriter) => { typewriter.typeString("Oyun hesabları,Oyunlar,Oyun ləvazimatları və daha çoxunu...").pauseFor(1000).deleteAll().typeString('<span style="font-size:25px;font-weight:900;">AlOyna.az</span><span>-da sat.</span>').start() }} /></span></div>
          <h3 className='text-center text-[20px] mb-5 font-bold '>Şifrə yenilə</h3>
          <div className='text-red-600 font-bold'>{click && `Emailinizi yoxlayın.`}</div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label htmlFor="name" className='font-bold '>Email adresiniz</label>
              <input type="email" placeholder='Email daxil et' required className='block  shadow-xl outline-none placeholder:text-[#414142] my-1 bg-transparent border border-white rounded-sm p-2 px-3' value={email} onChange={(e) => { setEmail(e.target.value) }} style={{ display: "block" }} />
            </div>
            <button type="submit" className='justify-center  gap-x-3 items-center flex w-full hover:bg-[#00172E] hover:shadow-xl duration-[400ms] bg-[#012136] text-white py-2 rounded-sm mt-2'>Göndər</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp