import RecentBlog from '@/components/RecentBlog'
import Hero from '../components/Hero'
import { Button } from '../components/ui/button'
import React, { useEffect } from 'react'
import PopularAuthors from '@/components/PopularAuthors'

const Home = () => {
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return (
    <div className='pt-20'>
        <Hero/>
        <RecentBlog/>
        <PopularAuthors/>
    </div>
    
  )
}

export default Home
