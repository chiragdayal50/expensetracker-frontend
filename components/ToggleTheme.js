"use client"
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { lightTheme, darkTheme } from '@/redux/reducer/userReducer';



const ToggleTheme = () => {
    const dispatch = useDispatch();

    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        if(darkMode){
            dispatch(darkTheme());
        }
        else{
            dispatch(lightTheme());
        }
    }, [darkMode])


    useEffect(() => {
        const theme = localStorage.getItem("theme")
        if(theme === "dark") setDarkMode(true)
    }, [])

    useEffect(() => {
        if(darkMode){
            document.documentElement.classList.add("dark")
            localStorage.setItem('theme', 'dark')
            // dispatch(darkTheme());
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem('theme', 'light')
            // dispatch(lightTheme());
        }
    })

    const toggleMode = () => {
        setDarkMode(!darkMode)
    }

  return (
    <div className='relative w-12 h-6 flex items-center dark:bg-gray-900 border-2 border-black dark:border-2 dark:border-white bg-blue-400 py-3 cursor-pointer rounded-full p-1' 
    onClick={toggleMode}>
        <FaMoon className='text-black' size={15} />
        <div className='absolute bg-white dark:bg-white w-4 h-4  rounded-full shadow-md transform transition-transform duration-300' style={darkMode ? {left: '4px'} : {right: '4px'}}>
        </div>
        <BsSunFill className='ml-auto text-yellow-500' size={15}/>
    </div>
  )
}

export default ToggleTheme
