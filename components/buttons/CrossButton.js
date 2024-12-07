import React from 'react'
import { RxCrossCircled } from "react-icons/rx";


const CrossButton = ({functionToExecute}) => {
  return (
    <div className="hover:cursor-pointer w-6 flex justify-center" onClick={functionToExecute}>
        <RxCrossCircled className='text-xl hover:text-2xl text-red-500'/>
    </div>
  )
}

export default CrossButton