import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FiPlus, FiPlusCircle } from 'react-icons/fi'
import { GrGamepad } from 'react-icons/gr'
import { Navigate, NavLink } from 'react-router-dom'
import { auth } from '../../firebase'
import { useAuthState } from "react-firebase-hooks/auth"
import { signOut } from 'firebase/auth'
import { PacmanLoader } from 'react-spinners'

export default function Header() {
  let [user, loading] = useAuthState(auth)

  const handleClick = () => {
    signOut(auth)
  }
  if (loading) {
    return (
      <div className='w-full bg-white'>
        <PacmanLoader />
      </div>
    )
  }
  if (!user) {
    return (
      <Navigate to={"/sign-in"} />
    )
  }
  // console.log(user)
  return (
    <Disclosure as="nav" className="bg-[#212630] ">
      <div className="mx-auto max-w-7xl px-8 ">
        <div className="relative flex h-16 items-center justify-between">

          <div className="flex flex-1 md:items-center justify-center   md:justify-start">
            <div className="flex items-center">
              <NavLink to={"/"}>
                <img alt="Your Company" src="/assets/img/logo.png" className="max-w-[128px]" />
              </NavLink>
            </div>
            <div className="hidden w-full md:ml-6 md:block space-grotesk">
              <div className="flex justify-between items-center space-x-4">
                <div className="text-white justify-center w-full flex gap-x-5">
                  <NavLink to={"/info"}>Haqqımızda</NavLink>
                  <NavLink target='_blank' to={"https://kofe.al/elmin"}>Kofe Al</NavLink>
                  <div className='group'>
                    <p className='cursor-pointer'>Dəstək</p>
                    <div className="flex flex-col opacity-0 invisible group-hover:visible duration-300 group-hover:opacity-100  rounded-md  bg-[#98BFFC] text-[#171A21] font-semibold p-4 absolute">
                      <NavLink to={"mailto:alloynaa@outlook.com"}>Fikir Bildir</NavLink>
                      <NavLink to={"mailto:alloynaa@outlook.com"}>Şikayət et</NavLink>
                      <NavLink to={"mailto:alloynaa@outlook.com"}>Sual ver</NavLink>
                    </div>
                  </div>
                </div>
               
                <button className='bg-[#98BFFC]  font-semibold hover:text-[#98BFFC] hover:bg-[#171A21] flex duration-[400ms] gap-x-1 px-1   items-center justify-center text-[#212630] w-[15%] max-[1200px]:w-[25%] max-lg:w-[30%] rounded-md'>
                  <NavLink to={"/add"} className={''}> <p className='py-1'>Yeni Elan</p> </NavLink>
                  <FiPlusCircle />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute max-md:hidden inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">

            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={`${((user.photoURL && user.photoURL.includes("undefined")) || !user.photoURL) ? "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" : user.photoURL} `}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <NavLink to="/user" className="space-grotesk font-bold block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Profil
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/fav" className="space-grotesk font-bold block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Seçilmişlər
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink onClick={handleClick} className="space-grotesk font-bold block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Çıxış et
                  </NavLink>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
