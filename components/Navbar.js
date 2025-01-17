"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link'
import toast from 'react-hot-toast';
import axios from 'axios'; // Ensure axios is imported at the top
import { userExist, userNotExist } from '@/redux/reducer/userReducer';
import { IoIosLogOut } from "react-icons/io";
import { GiReceiveMoney } from "react-icons/gi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaUser} from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import ToggleTheme from './ToggleTheme';
import { TbLogin } from "react-icons/tb";
import { BsFillSignIntersectionFill } from "react-icons/bs";

const Navbar = () => {

  const dispatch = useDispatch();
  const {user, loading} = useSelector((state) => state.userReducer)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      // console.log(user)
      if(user){
        // console.log("Yaha error aarha hai header mai")
        await searchUserInDb(user.uid)
        // console.log("Logged In Header")

      }else{
        dispatch(userNotExist());
        // console.log("Not Logged in Header")
      }
    })
  }, [])

  const searchUserInDb = async (userId) => {
    try {
      // console.log("Received Id: "+ userId)
      //  console.log("Trying to delete");
      // console.log("http://localhost:4000/api/v1/user/${userId}")
       const response = await axios.get(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/user/${userId}`);
      //  console.log(response);
       dispatch(userExist(response.data.user))
      //  toast.success(response.data.message)
    } catch (error) {
      console.log(error)
      // toast.error("error db")
      //  toast.error(error.response.data.message)
    }
}

const logoutHandler = async () => {
  try {
    await signOut(auth);
    toast.success("Logged Out Successfully")
    // setIsOpen(false);
  } catch (error) {
    console.log(error)
    toast.error("LogOut Failed")
  }
}


  return (
    <div className="navbar flex flex-row items-center justify-between px-2 sm:px-10 p-4 sm:p-3 bg-blue-400 dark:bg-slate-900 dark:text-white h-[8vh] font-semibold">

    {
      user? 
      <div className='flex flex-row w-full justify-between items-center'>
        <Link href={"/"} onClick={() => {setIsOpen(false)}}>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">Dashboard</div>
            <div className="text-2xl sm:text-xl sm:pb-1"><IoStatsChart /></div>
          </div>
        </Link>
        <Link href={"/view-incomes"} onClick={() => {setIsOpen(false)}}>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">Incomes</div>
            <div className="text-2xl sm:text-xl sm:pb-1"><GiReceiveMoney /></div>
          </div>
        </Link>

        <Link href={"/view-expenses"} onClick={() => {setIsOpen(false)}}>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">Expenses</div>
            <div className="text-2xl sm:text-lg sm:pb-1"><FaMoneyBillTrendUp /></div>
          </div>
        </Link>

        {/* <Link href={"/transactions"} onClick={() => {setIsOpen(false)}}>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">Transactions</div>
            <div className="text-2xl sm:text-lg"><FaMoneyBillTransfer /></div>
          </div>
        </Link> */}

          {
          user&& ( 
            <div className='flex items-center gap-2'>
              {/* <p className='hidden sm:flex'>Profile</p> */}
              <button onClick={() => {setIsOpen((prev) => !prev)}} className='ml-2 sm:text-base text-xl'>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block">{user.name}</div>
                  <div className="text-xl sm:text-base border-2 border-black p-1 rounded-full"><FaUser/></div>
                </div>
              </button>
              <dialog open={isOpen} className=' absolute top-10 mt-2 mr-5 p-3 w-40 h-36 sm:h-36 border-4 rounded-lg border-slate-300 dark:bg-slate-800 dark:text-white'>
                 <div className='flex flex-col justify-between h-full w-full'> 
                    <Link onClick={() => {setIsOpen(false)}} href={'/profile'} className='flex gap-5 items-center justify-between'>
                      <p>Profile</p>
                      <FaUserCircle className='text-2xl text-blue-500 dark:text-white'/>
                    </Link>
                    <div onClick={() => {setIsOpen(false)}}  className='flex justify-between items-center'>
                      <p>Theme</p>
                      <ToggleTheme/>
                    </div>
                    <Link href={"/logIn-email-pass"}>
                      <button onClick={logoutHandler} className='w-full flex items-center justify-between'>
                        <p>Logout</p>
                        <IoIosLogOut className="font-bold text-2xl ml-2"/>
                      </button>
                    </Link>
                 </div>
                </dialog>
            </div>
          )}   

      </div>
      :
      <div></div>
    }
      

        

      {
        !user && (
          <div className='flex items-center w-full justify-between sm:justify-end gap-10 mx-2'>
            <Link href={"/logIn-email-pass"}>
              <div className="flex items-center gap-3">
                <div className="block">Login</div>
                <div className="text-2xl sm:text-lg"><TbLogin /></div>
              </div>
            </Link>
            <Link href={"/signIn-email-pass"}>
              <div className="flex items-center gap-3">
                <div className="block">SignIn</div>
                <div className="text-2xl sm:text-lg"><BsFillSignIntersectionFill /></div>
              </div>
            </Link>
            <ToggleTheme/>
          </div>
        )
      }   
    </div>
  )
}

export default Navbar