import React, { useState } from 'react'
import { db, auth, storage } from '../firebase';
import { deleteUser, updatePassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';

const UpdateProfile = () => {
    let [user, loading] = useAuthState(auth)
    let [change, setChange] = useState("")
    let [name, setName] = useState('')
    let [file, setFile] = useState("")
    let [show, setShow] = useState(false)
    const handleFile = (e) => {
        let file = e.target.files[0]
        if (file) {
            setFile(file);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (user) {
            try {
                let fileUrl = user.photoURL;
                if (file) {
                    const storageRef = ref(storage, `profiles/${file.name}-${new Date().getTime()}`);
                    await uploadBytes(storageRef, file);
                    fileUrl = await getDownloadURL(storageRef);
                }
                await updateProfile(user, {
                    displayName: name || user.displayName,
                    photoURL: fileUrl || user.photoURL
                });
                console.log("Profil resmi başarıyla güncellendi!");
                setShow(true)
            } catch (error) {
                console.error("Profil resmi güncellenirken bir hata oluştu:", error);
            }
        } else {
            console.warn("Dosya seçilmedi!");
        }

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
    const handleDelete = () => {
        const user = auth.currentUser;
        deleteUser(user)
    }
    const deleteProfile = () => {
        updateProfile(user, {
            photoURL: ""
        })
    }
    console.log(name)
    return (
        <div className='space-grotesk py-5'>
            <h1 className='text-[35px] max-lg:text-[25px] py-5 space-grotesk'>Profil yenilə</h1>
            {show && "Profil yeniləndi.Dəyişikləri görmək üçün zəhmət olmasa ekranı yeniləyin."}
            <form onSubmit={handleSubmit} className='mt-5'>
                <img src={`${(user.photoURL && user.photoURL.includes("undefined") || !user.photoURL) ? "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" : user.photoURL} `} className='w-[150px] h-[150px] mx-auto rounded-full object-cover' alt="" />
                <h3 className='text-center text-[18px] mt-5'>{user.email}</h3>
                <div className="input_container bg-[#012136] p-3 text-center mt-5" >
                    <label htmlFor="files" className='hover:underline '>Şəkli yenilə</label>
                    <button onClick={deleteProfile} className='block text-center hover:underline  mx-auto'>Profil şəkli sil</button>
                    <input onChange={handleFile} accept='image/png,image/jpeg,image/webp,image/bmp' id="files" className='hidden' type="file" />
                </div>
                <div className={` duration-500 overflow-hidden`}>
                    <input type="text" placeholder='Şifrəniz' className={`block duration-300 w-full shadow-xl outline-none placeholder:text-[#fff] my-1 bg-transparent border border-white rounded-sm p-2 px-3`} onChange={(e) => setChange(e.target.value)} />
                    <input type="text" placeholder='Adınız' className=' block duration-300 w-full shadow-xl outline-none placeholder:text-[#fff] my-1 bg-transparent border border-white rounded-sm p-2 px-3' onChange={e => setName(e.target.value)} defaultValue={user.displayName} />
                </div>
                <button type='submit' className='justify-center  gap-x-3 items-center flex w-full hover:bg-[#00172E] hover:shadow-xl duration-[400ms] bg-[#012136] text-white py-2 rounded-sm mt-2'>Dəyiş</button>
            </form>
            <button onClick={handleDelete} className='justify-center  gap-x-3 items-center flex w-full hover:bg-[#00172E] hover:shadow-xl duration-[400ms] bg-[#012136] text-white py-2 rounded-sm mt-2'>Hesabı sil</button>
        </div>
    )
}

export default UpdateProfile