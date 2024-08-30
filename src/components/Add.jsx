import React, { useEffect, useState } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, updateDoc, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, storage } from '../firebase'; // storage'ı import edin
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';

const App = () => {
    let [img, setImg] = useState([])
    const [name, setName] = useState("");
    const [cat, setCat] = useState("")
    const [info, setInfo] = useState({})
    let [error, setError] = useState(false)

    const [files, setFiles] = useState([]);
    const user = auth.currentUser;
    const allDataRef = collection(db, "users");
    let navigate = useNavigate()

    const userQuery = user ? query(allDataRef, where("userId", "==", user.uid)) : null;
    const [userData, userLoading] = useCollectionData(userQuery);

    const handleFileChange = async (e) => {
        e.preventDefault()
        const files = Array.from(e.target.files);
        const maxFileSize = 2 * 1024 * 1024;
        const validFiles = files.filter(file => file.size <= maxFileSize);
        const invalidFiles = files.filter(file => file.size > maxFileSize);

        if (invalidFiles.length > 0) {
            alert('Bəzi şəkillər 2 MB\'ı aşan ölçülərdədi. Xahiş olunur uyğun ölçüdə şəkillər seçin.');
        }
        let fileUrls = [];
        if (validFiles.length > 0) {
            let fileUrls = [];
            for (const file of validFiles) {
                const storageRef = ref(storage, `images/${file.name}-${new Date().getMilliseconds()}-${new Date().getSeconds()}`);
                await uploadBytes(storageRef, file);
                const fileUrl = await getDownloadURL(storageRef);
                fileUrls.push(fileUrl);
            }
            setImg(fileUrls);
        }
    }

    const handleDelete = async (url, e) => {
        e.preventDefault()
        try {
            const updatedImageUrls = img.filter(imgUrl => imgUrl !== url);
            setImg(updatedImageUrls);

            const storageRef = ref(storage, url);
            await deleteObject(storageRef);
        } catch (error) {
            console.error("Dosya silinirken hata oluştu:", error);
        }
    }
    const handleAdd = (e) => {
        let { value, name } = e.target
        setInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const aylar = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            let date = new Date()
            const newDocRef = doc(allDataRef);
            await addDoc(allDataRef, {
                id: newDocRef.id,
                name: name,
                info: info,
                category: cat,
                createdAt: date,
                date: `${date.getDate()} ${aylar[date.getMonth()]},${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`,
                expDate: `${date.getDate()} ${aylar[date.getMonth()]},${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`,
                userId: user.uid,
                imageUrls: img
            });
            setName("");
            setFiles([]) 

            navigate("/user")
        } else {
            console.log("Kullanıcı oturum açmamış");
        }


    };
    console.log(cat)


    return (
        <div className='space-grotesk text-[#00172E]'>
            <h1 className='text-[35px] max-lg:text-[25px] py-5 text-white text-center'>Yeni Elan</h1>
            <div className="bg-white/90 md:flex relative p-8 px-10 max-md:p-6 duration-300 rounded-lg">
                <div className="order-2 md:w-[30%] max-md:mb-5">
                    Elan şərtləri
                    <p><span className='text-red-600'>*</span>Satışa çıxarılan oyunlar haqqında doğru və tam məlumat təqdim edilməlidir. Yalan məlumat vermək qadağandır.</p>
                    <p><span className='text-red-600'>*</span>Platformada əxlaqlı və hörmətli davranış tələb olunur. Təhlükəli və təhqiredici davranışlara icazə verilmir.</p>
                    <p><span className='text-red-600'>*</span>Şəxsi məlumatlar qorunmalıdır və digər istifadəçilərlə bölüşülməməlidir.</p>
                    <p><span className='text-red-600'>*</span>Mobil nömrəni göstərilən formatda daxil edin.</p>
                    <p><span className='text-red-600'>*</span>Daha çox məlumat üçün <NavLink to={"/rules"} className={"text-[#386cce]"}>keçid edin.</NavLink></p>
                </div>
                <div className="md:w-[70%]">
                    <form onSubmit={handleSubmit}>
                        <div className="input_container ">
                            <label htmlFor="files" className='w-max'>Şəkil əlavə et<span className='text-red-600'>*</span></label>
                            <div className="grid grid-cols-3 gap-3 max-[1200px]:grid-cols-2 max-md:grid-cols-1">
                                {img.map((url, inx) => (
                                    <>
                                        <div className='flex flex-col '>
                                            <img src={url} className='w-[250px] max-[1200px]:w-[200px] max-[1200px]:h-[120px] duration-300 object-cover h-[150px] max-md:w-[60%] mx-auto max-md:h-[auto]' alt="" />
                                            <button className='relative w-full right-2 underline md:text-[18px] text-black' onClick={(e) => handleDelete(url, e)}>Şəkili sil</button>
                                        </div>
                                    </>
                                ))}
                            </div>
                            <input onChange={handleFileChange} accept='image/png,image/jpeg,image/webp,image/bmp' multiple required id="files" className='hidden ' name='' type="file" />
                        </div>
                        <div className="relative max-md:flex max-md:flex-col">
                            <label htmlFor="name" className='absolute'>Elanın başlıqı:</label>
                            <input type="text" minLength={5} required className='text-black   max-md:w-full outline-[#AFDAED] px-2 md:ml-28 mb-5 max-md:mt-6' maxLength={18} value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="relative max-md:flex max-md:flex-col">
                            {error && <p className='mt-5 text-red-600'> Kateqoriya seç</p>}
                            <label htmlFor="select" className='absolute '>Kateqoriya:</label>
                            <select required onChange={(e) => setCat(e.target.value)} className='max-md:mt-6 md:ml-28 mb-5' name="" id="">
                                <option value="" disabled selected>Kateqoriya seç</option>
                                <option value="Oyun Hesabı">Oyun Hesabı</option>
                                <option value="Oyun Ləvazimatı">Oyun Ləvazimatı</option>
                                <option value="Oyun Konsolları">Oyun Konsolları</option>
                                <option value="PC oyunları">PC oyunları</option>
                                <option value="PlayStation oyunları">PlayStation oyunları</option>
                            </select>
                        </div>
                        <div className="relative max-md:flex max-md:flex-col">
                            <label htmlFor="price" className='absolute '>Qiymət, AZN</label>
                            <input type="number" required name='price' onChange={e => handleAdd(e)} className='text-black px-2 outline-[#AFDAED] md:w-[10%] w-full md:ml-28 mb-5 max-md:mt-6' />
                        </div>
                        <div className="relative  max-md:flex max-md:flex-col">
                            <label htmlFor="text" className='absolute'>Məzmun:</label>
                            <div className="">
                                <textarea minLength={10} rows={8} maxLength={500} name="text" onChange={e => handleAdd(e)} className='text-black resize-none px-2 outline-[#AFDAED]  md:w-[50%] w-full md:ml-28 md:mb-5 max-md:mt-6'></textarea>
                                <p className='md:ml-28 text-[13px] mb-3'>max 500 söz</p>
                            </div>
                        </div>
                        <div className="relative max-md:flex max-md:flex-col">
                            <label htmlFor="name" className='absolute'>Elanın sahibi:</label>
                            <input type="text" name='name' minLength={3} onChange={e => handleAdd(e)} required className='text-black md:w-[30%] max-md:w-full outline-[#AFDAED] px-2 md:ml-28 mb-5 max-md:mt-6' maxLength={18}  />
                        </div>
                        <div className="relative  max-md:flex max-md:flex-col">
                            <label htmlFor="number" className='absolute'>Mobil nömrə:</label>
                            <input type="text" onChange={e => handleAdd(e)} required name='number' minLength={13} maxLength={13} placeholder='Məs.051-XXX-XX-XX' className='text-black px-2 outline-[#AFDAED] md:w-[30%] text-[15px] w-full md:ml-28 md:mb-5 max-md:mt-6' />
                        </div>
                        <button type="submit" className='max-md:w-full bg-[#212630] text-[#E8E9E9] py-3 mt-2 px-10 rounded-full'>Elanı yarat</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default App