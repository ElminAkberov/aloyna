import React from 'react'
import { FaFacebookF, FaInstagram, } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#212630] py-10 max-md:pb-36 text-white space-grotesk ">
      <div className=" mx-auto max-w-7xl px-2 sm:px-5 z-20 relative">
        <div className="lg:flex justify-between">
          <div className="first">
            <div className="flex max-lg:justify-center items-center">
              <NavLink to={"/"}>
                <img alt="Your Company" src="/assets/img/logo.png" className="w-64" />
              </NavLink>
            </div>
            <div className="sm:px-5">
              <p className='lg:w-[60%] max-lg:text-[20px] text-center'>Azərbaycanın ilk oyun satışı üçün olan platforması</p>
            </div>
          </div>
          <div className="second  max-lg:text-center">
            <div className="flex flex-col w-max max-lg:mx-auto">
              <h3 className="text-[18px] font-bold">Sürətli giriş</h3>
              <hr className='border-[1.5px] my-1 border-[#95BBFE] ' />
            </div>
            <div className="">
              <NavLink to={'/info'}><p>Haqqımızda</p></NavLink>
              <NavLink to={'/sign-up'}><p>Qeydiyyat</p></NavLink>
              <NavLink to={'/sign-in'}><p>Daxil ol</p></NavLink>
              <NavLink to={'/user'}><p>Hesabım</p></NavLink>
            </div>
          </div>
          <div className="max-lg:text-center">
            <div className="flex flex-col w-max max-lg:mx-auto">
              <h3 className='text-[18px] font-bold'>Dəstək</h3>
              <hr className='border-[1.5px] my-1 border-[#95BBFE] ' />
            </div>
            <div className="">
              <NavLink to={"mailto:alloynaa@outlook.com"}><p>Fikir Bildir</p></NavLink>
              <NavLink to={"mailto:alloynaa@outlook.com"}><p>Şikayət et</p></NavLink>
              <NavLink to={"mailto:alloynaa@outlook.com"}><p>Sual ver</p></NavLink>
              <NavLink target='_blank' to={"https://kofe.al/elmin"}><p>Kofe.al</p></NavLink>
            </div>
          </div>

          <div className="third max-lg:text-center">
            <div className="flex flex-col w-max max-lg:mx-auto">
              <h3 className='text-[18px] font-bold'>Sosial Media</h3>
              <hr className='border-[1.5px] my-1 border-[#95BBFE] ' />
            </div>
            <div className="flex text-[20px] justify-center gap-x-2 ">
              <NavLink to={"https://www.instagram.com/aloyna.az/"} target='_blank'><FaInstagram /></NavLink>
              <NavLink><FaFacebookF /></NavLink>
              <NavLink><FaXTwitter /></NavLink>
            </div>
          </div>

        </div>
      </div>
      <hr className='my-3 border-[#95BBFE]' />
    </footer>
  )
}

export default Footer