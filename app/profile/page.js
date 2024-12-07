"use client"
import React, { useState, useEffect } from 'react';
import UserLayout from "@/components/User-Layout.js"
import LoggedInUserComponent from "@/components/Logged-In-User-Only-Layout.js"
import { useSelector } from "react-redux";
import axios from 'axios'; // Ensure axios is imported at the top
import toast from 'react-hot-toast';
import { SlRefresh } from "react-icons/sl";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import CrossButton from '@/components/buttons/CrossButton.js';


const page = () => {
  const {user, loading} = useSelector(state => state.userReducer)
  console.log(user)
  const userId = user?._id;

  const [categroriesData, setCategoriesData] = useState([])
  const [categoryData, setCategoryData] = useState({
    type: "",
    title: '',
    user: userId,
  });
  const [refreshCategories, setRefreshCategories] = useState(true)
  const [selectedType, setSelectedType] = useState("all");
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)


  useEffect(() => {
    fetchCategories(userId, selectedType);
  }, [refreshCategories, selectedType]);

  const fetchCategories = async (userId, type) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/category/get?id=${userId}&type=${type}`); // Assuming this is your API endpoint for fetching expenses
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      // console.log(response)
      const data = await response.json();
      // console.log(data)
      // console.log(data.expenses)
      setCategoriesData(data.categories);
    } catch (error) {
      console.error('Error fetching expenses:', error);
  }
}

  const handleChange = (e) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(categoryData)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/category/add`, categoryData);
      // console.log(response.data);
      toast.success(response.data.message)
      fetchCategories(userId);
      // setAddOpen(!addOpen)
      setRefreshCategories(!refreshCategories)
      // Handle success, e.g., show a success message or reset the form
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message)
      // Handle error, e.g., show an error message
    }
  }

  const deleteHandler = async (itemId) => {
    // console.log(itemId);
    try {
      //  console.log("Trying to delete");
       const response = await axios.delete(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/category/delete/${itemId}`);
       setRefreshCategories(!refreshCategories)
      //  fetchExpenses(userId);
       // console.log(response);
       toast.success(response.data.message)
    } catch (error) {
       toast.error(error.response.data.message)
      //  console.log(error.response.data.message)
    }
   };

  const toggleAdd = () => {
    setAddCategoryOpen(!addCategoryOpen)
  }

  return (
    <UserLayout>
    <LoggedInUserComponent>
    <div className="flex flex-col items-center sm:justify-between px-2 sm:px-12 pb-5 w-full h-full">

       <div className="flex justify-between items-center flex-wrap w-full mb-5 text-lg sm:text-2xl font-semibold">
        <div className="flex gap-2 sm:gap-5 items-center dark:text-white">
          <h1>Your Profile</h1>
          <button onClick={() => setRefreshCategories(!refreshCategories)}><SlRefresh className="hover:text-3xl active:animate-ping"/></button>
        </div>
        <button onClick={toggleAdd} className="sm:hidden flex items-center gap-3 bg-blue-400 dark:bg-white dark:text-black p-1 px-3 rounded-xl text-base">Add <FaPlus /></button>
        <div className="text-base flex justify-between gap-2 mx-0 w-auto sm:w-max sm:mx-0 py-1">
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className='rounded-xl px-2 border-2 border-blue-400 dark:border-slate-900'>
                <option value="all" >All Categories</option>
                <option value="Income">Incomes</option>
                <option value="Expense">Expenses</option> 
              </select>
        </div>
      </div>

      
      <div className="flex flex-col sm:flex-row justify-between w-full ">
        {/* USER DATA  */}
        <div className='flex flex-col items-center justify-start gap-5 border-2 w-full sm:w-1/4 bg-slate-200 dark:bg-gray-400 rounded-xl p-5 h-[20vh] sm:h-[78.15vh] '>
          <h1 className='text-xl font-bold'>Welcome! {user?.name}</h1>
          <div className="flex flex-col justify-start">
            <h2>Email: {user?.email}</h2>
            <h2>Role: {user?.role}</h2>
          </div>
        </div>
        {/* CATEGORIES FORM PC*/}
        <div className="flex-col items-center justify-start gap-5 border-2 w-full sm:w-1/4 bg-slate-200 dark:bg-gray-400 rounded-2xl p-2 sm:p-4 h-[41vh] sm:h-[78.15vh] mt-2 sm:m-0 hidden sm:flex">
          <h1 className='text-lg font-bold'> Add Custom Category</h1>
          <div className="bg-gray-300 p-5 w-full rounded-xl">
          <form onSubmit={handleSubmit} className='w-full flex flex-col items-center'>
                {/* <h1 className=''>Add Category</h1> */}
                <div className="my-1 flex w-full flex-col">
                  <label htmlFor="title">Title</label>
                  <input type="text" name="title" value={categoryData.title} onChange={handleChange} className="rounded-md p-1"/>
                </div>
                <div className="my-1 flex w-full flex-col">
                  <label htmlFor="type">Type</label>
                  <select name="type" value={categoryData.type} onChange={handleChange} className="rounded-md p-1">
                    <option >Select</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                {
                  categoryData.type === 'Select' ? 
                  <div className='p-2 w-40 rounded-xl bg-blue-300 dark:bg-slate-800 dark:text-white font-semibold mt-8 flex items-center justify-center hover:cursor-pointer' onClick={() => toast.error("Select Type Of Category")}>Submit</div>
                  :
                  <button type="submit" className='p-2 w-40 mx-auto rounded-xl bg-blue-300 dark:bg-slate-800 dark:text-white font-semibold mt-8'>Submit</button>
                }
          </form>
          </div>
        </div>

        {/* CATEGORIES FORM PHONE*/}
        {
          addCategoryOpen && (
        <div className="flex sm:hidden flex-col items-center justify-start gap-5 border-2 w-full sm:w-1/4 bg-slate-200 dark:bg-gray-400 rounded-2xl p-2 sm:p-4 h-[41vh] sm:h-[78.15vh] mt-2 sm:m-0 ">
          <div className="flex flex-row justify-between items-center w-full pl-5">
              <h1 className="font-semibold">Add Custom Category</h1>
              <CrossButton functionToExecute={toggleAdd}/>
          </div> 
          <div className="bg-gray-300 p-5 w-full rounded-xl">
          <form onSubmit={handleSubmit} className='w-full flex flex-col items-center'>
                {/* <h1 className=''>Add Category</h1> */}
                <div className="my-1 flex w-full flex-col">
                  <label htmlFor="title">Title</label>
                  <input type="text" name="title" value={categoryData.title} onChange={handleChange} className="rounded-md p-1"/>
                </div>
                <div className="my-1 flex w-full flex-col">
                  <label htmlFor="type">Type</label>
                  <select name="type" value={categoryData.type} onChange={handleChange} className="rounded-md p-1">
                    <option >Select</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                {
                  categoryData.type === 'Select' ? 
                  <div className='p-2 w-40 rounded-xl bg-blue-300 dark:bg-slate-800 dark:text-white font-semibold mt-8 flex items-center justify-center hover:cursor-pointer' onClick={() => toast.error("Select Type Of Category")}>Submit</div>
                  :
                  <button type="submit" className='p-2 w-40 mx-auto rounded-xl bg-blue-300 dark:bg-slate-800 dark:text-white font-semibold mt-8'>Submit</button>
                }
          </form>
          </div>
        </div>
        )
      }

        {/* CATEGORIES TABLE */}
        <div className="w-full sm:w-2/6 h-full flex mt-2 sm:m-0">
          <table className="table-auto w-full border-2 h-full bg-slate-200 dark:bg-gray-400 p-2 sm:p-10 flex flex-col justify-start rounded-2xl">
            <thead className="w-full border">
              <tr className="flex w-full">
                <th className=" py-2 w-4/12">Title</th>
                <th className=" py-2 w-3/12">Type</th>
                <th className=" py-2 w-2/12">Edit</th>
                <th className=" py-2 w-3/12">Delete</th>
              </tr>
            </thead>
            <tbody className='flex flex-col w-full'>
              {categroriesData.map((i) => (
                <tr key={i._id} className="h-[7vh] flex w-full">
                  <td className="border py-2 w-4/12">{i.title}</td>
                  <td className="border py-2 w-3/12 ">
                    <div className="flex justify-center">{i.type}</div>
                  </td>                  
                  <td className="border px-4 py-2 w-2/12"><div className="flex justify-center">Edit</div></td>
                  <td className="border py-2 w-3/12 flex items-center justify-center"><button onClick={() => deleteHandler(i._id)}><div className="text-xl w-full"><MdDelete className="hover:text-red-600 hover:text-2xl w-6"/></div></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
    </LoggedInUserComponent>
    </UserLayout>
  )
}

export default page