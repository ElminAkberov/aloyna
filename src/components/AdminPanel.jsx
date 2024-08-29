import React, { useEffect, useState } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth, storage } from '../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { NavLink } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';
import { useAuthState } from 'react-firebase-hooks/auth';

const AdminPanel = () => {
  const user = auth.currentUser;

  const allDataRef = collection(db, "users");

  const userQuery = user ? query(allDataRef, where("userId", "==", user.uid)) : null;
  const [userData, userLoading] = useCollectionData(userQuery);

  let fav = localStorage.getItem("fav")
  let newFav = JSON.parse(fav)

 
  const handleDelete = async (itemId) => {
    try {
      const q = query(collection(db, "users"), where("id", "==", itemId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();

        const imageUrls = docData.imageUrls || [];

        for (const url of imageUrls) {
          const storageRef = ref(storage, url);
          await deleteObject(storageRef);
        }
        await deleteDoc(docRef);
      } else {
        console.error("Belge bulunamadı");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }

    delete newFav[itemId]
    localStorage.setItem("fav", JSON.stringify(newFav));
    return newFav
  };
  const handleSignOut = () => {
    signOut(auth)
  }
  if (userLoading) {
    return (
      <div className='w-full absolute flex justify-center items-center left-0 top-0 h-[100vh] z-40 bg-[#171A21] '>
        <PacmanLoader color='#98BFFC' />
      </div>
    );
  }

  return (
    <div className={`space-grotesk  ${userData.length <= 4 && "h-[80vh]"}`}>

      <h1 className='text-[35px] max-lg:text-[25px] py-5'>Şəxsi kabinet</h1>
      <h3 className='text-[30px] '>Xoş gəldin,<span className='font-bold'>{user.displayName}</span></h3>
      <NavLink to={"/fav"}><button className='underline md:hidden block'>Seçilmişlərə get</button></NavLink>
      <NavLink to={"/updateuser"}><button className='underline text-[17px] '>Profili yenilə</button></NavLink>
      <div><button onClick={handleSignOut} className='underline md:hidden block'>Çıxış et</button></div>
      <div className="flex flex-col mx-auto w-max">
        <h4 className='text-[25px] '>Elanlarım</h4>
        <hr className='border-blue-400 border-2' />
      </div>
      {userData.length > 0 ?
        <ul className='grid grid-cols-4 max-lg:grid-cols-3 max-md:flex duration-300  flex-wrap justify-center justify-items-center gap-10 py-10'>
          {userData && userData.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds).map((item, index) => (
            <div key={index} className='max-[556px]:w-full'>
              <li className='' >
                <div className='w-max max-[556px]:w-full'>
                  <NavLink to={`/details/${item.id}`} className={"inline w-max"}>
                    <img src={item.imageUrls[0]} className="rounded-t-md w-[250px] max-[556px]:w-full max-[1200px]:w-[220px] max-md:w-[250px] max-md:h-[150px] duration-300 max-[1200px]:h-[150px] h-[220px] object-cover" />
                  </NavLink>
                  <div className="bg-[#393f4a] rounded-b-md p-3  ">
                    <h3 className='text-[20px] max-lg:text-[18px] max-md:text-[16px] font-bold '>{item.info.price} AZN</h3>
                    <h3 key={index} className='text-[20px] max-lg:text-[18px] max-md:text-[16px] font-thin capitalize'>{item.name}</h3>
                    <p className='text-[15px] text-[#ccc]'>{item.date}</p>
                    <div className='flex justify-between'>
                      <button className='underline' onClick={() => handleDelete(item.id)}>Elanı sil</button>
                      <NavLink to={`/update/${item.id}`} className={'block underline'}>Düzəliş et</NavLink>
                    </div>
                  </div>
                </div>
              </li>
            </div>
          ))}
        </ul>
        : <h3 className='text-[20px] text-center py-44'>Hal hazırda aktiv olan elanınız yoxdur <NavLink to={"/add"} className={"text-[#338cce] underline"}>Yeni elan yarat</NavLink></h3> 
        // py-[91.5px] 
      }

    </div>
  )
}

export default AdminPanel;
