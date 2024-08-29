import React, { useEffect, useState } from 'react';
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where, updateDoc, getDocs } from 'firebase/firestore';
import { db, auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Navigate, useParams } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';

const Update = () => {
    let { params } = useParams();
    const [files, setFiles] = useState([]);
    let [error, setError] = useState(true)
    let [name, setName] = useState("")
    const user = auth.currentUser;

    const allDataRef = collection(db, "users");

    const userQuery = user ? query(allDataRef, where("userId", "==", user.uid)) : null;
    const [userData, userLoading] = useCollectionData(userQuery);
    let [info, setInfo] = useState(userData && userData?.map(item => item.info))

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    useEffect(() => {
        if (userData) {
            const item = userData.find(item => item.id === params)
            if (item) {
                setInfo(item.info || {});
                setName(item.name)
            }

        }
    }, [userData, params]);
    const handleChange = (e) => {
        let { value, name } = e.target;
        setInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            let fileUrls = [];
            try {
                if (userData && userData.filter(item => item.id === params).flatMap(item => item.imageUrls).length < 5) {
                    for (const file of files) {
                        const storageRef = ref(storage, `images/${file.name}-${new Date().getMilliseconds()}-${new Date().getSeconds()}`);
                        await uploadBytes(storageRef, file);
                        const fileUrl = await getDownloadURL(storageRef);
                        fileUrls.push(fileUrl);
                        setError(true)
                    }
                } else {
                    setError(false)
                }
            } catch (error) {
                console.error("Resim yükleme hatası:", error);
            }
            const q = query(collection(db, "users"), where("id", "==", params));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                const targetItem = userData.find(item => item.id === params);
                const currentImageUrls = targetItem?.imageUrls || [];
                await updateDoc(docRef, {
                    name: name,
                    info: info,
                    imageUrls: [...currentImageUrls, ...fileUrls]
                });
            }
        } else {
            console.log("Kullanıcı oturum açmamış");
        }

    };

    const selectItemDelete = async (url, itemId) => {
        try {
            const q = query(collection(db, "users"), where("id", "==", itemId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                const docData = querySnapshot.docs[0].data();
                const imageUrls = docData.imageUrls || [];
                const updatedImageUrls = imageUrls.filter(imgUrl => imgUrl !== url);

                const storageRef = ref(storage, url);
                await deleteObject(storageRef);

                await updateDoc(docRef, {
                    imageUrls: updatedImageUrls
                });
            }
        } catch (error) {
            console.error("Resim silme hatası:", error);
        }
    };
    if (userData && !(userData.filter(item => item.id === params).length > 0)) {
        return <Navigate to={"/add"} />
    }
    // console.log(userData)
    return (
        <div className='space-grotesk'>
            <h1 className='text-[35px] max-lg:text-[25px] py-5'>Düzəliş et</h1>

            {userData && userData.filter(item => item.id === params).map(item => (
                <div key={item.id}>
                    <div className="flex flex-wrap justify-center mb-10 gap-3">
                        {item.imageUrls && item.imageUrls.map((imgUrl, index) => (
                            <div key={index} className='relative'>
                                <img src={imgUrl} className='w-[250px] h-[150px] object-cover' alt="User Uploaded" />
                                <button className='absolute text-[25px] right-0 top-0' onClick={() => selectItemDelete(imgUrl, item.id)}><IoMdClose /></button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="">
                            <label htmlFor="name" className='text-[18px] pt-10'>Elan adı:</label>
                            <input onChange={e => setName(e.target.value)} maxLength={18} required type='text' name='name' className='bg-transparent ml-2 border-b my-5 border-[#AFDAED] w-max outline-none text-[20px] max-lg:text-[18px] max-md:text-[16px] font-thin capitalize' defaultValue={item.name} />
                        </div>
                        <div className="">
                            <label htmlFor="price">Qiymət:</label>
                            <input onChange={e => handleChange(e)} type='number' name='price' required className=' bg-transparent ml-2 w-[8%] max-md:w-[15%] border-b mb-5 border-[#AFDAED] outline-none text-[20px] max-lg:text-[18px] max-md:text-[16px] font-bold' defaultValue={item.info.price} /> AZN
                        </div>
                        <label htmlFor="files" className='border-2 mb-5 hover:bg-[#AFDAED] hover:text-[#171A21] hover:border-transparent block w-max border-[#AFDAED] '><p className='px-5 '>Şəkil əlavə et</p></label>
                        {!error &&
                            <div className='text-red-600 mb-5'>Şəkil sayı 5dən çoxdur</div>
                        }
                        <input onChange={handleFileChange} accept="image/*" id="files" multiple className='invisible hidden' name='' type="file" />
                        <div className="">
                            <textarea onChange={e => handleChange(e)} rows={8} className='text-white bg-[#393f4a] border border-[#AFDAED] rounded-b-md p-3 outline-none w-full resize-none' name="text" defaultValue={item.info.text}></textarea>
                        </div>
                    </div>
                </div>
            ))}
            <form onSubmit={handleSubmit}>
                <button type="submit" className='w-full border-2 hover:bg-[#AFDAED] hover:text-[#171A21] hover:border-transparent block duration-300 rounded-full border-[#AFDAED] py-2 mt-2'>Təsdiqlə</button>
            </form>
        </div>
    );
};

export default Update;
