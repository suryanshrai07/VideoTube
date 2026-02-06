import React from 'react'
import Navbar from './Navbar'
import Sidebar from './layout/Sidebar'

const Home = () => {
  return (
    <div className='h-screen flex flex-col bg-black'>
      <div className='h-13 sm:h-18'> 
        <Navbar/> 
      </div>

      <div className='flex-1'>
        <Sidebar/>
      </div>
    </div>
  )
}

export default Home
