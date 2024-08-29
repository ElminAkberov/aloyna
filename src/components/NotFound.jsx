import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='text-center space-grotesk'>
            <h1 className='text-[35px]  max-lg:text-[25px] py-5 space-grotesk'>Səhifə tapılmadı</h1>
            <p className=' text-[25px] max-lg:text-[20px] max-md:text-[16px] py-[143px]'>Buradan Ana Səhifəyə qayıt- <NavLink className={'text-[#386cce] underline    '}>Ana Səhifə.</NavLink></p>
        </div>
    );
}

export default NotFound;