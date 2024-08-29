import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PacmanLoader } from 'react-spinners'

const AuthLayout = () => {
    let location = useLocation()
    let [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [location])

    if (loading) {
        return (
            <div className='w-full absolute flex justify-center items-center left-0 top-0 h-[100vh] z-40 bg-[#171A21] '>
                <PacmanLoader color='#98BFFC' />
            </div>
        )
    }
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default AuthLayout