import BlogCard from '@/components/BlogCard'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const SearchList = () => {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const query = params.get('q');
    const {blog} = useSelector(store=>store.blog)

    const filteredBlogs = blog.filter(
        (blog)=>
            blog?.title?.toLowerCase().includes(query?.toLowerCase()) || blog?.subtitle?.toLowerCase().includes(query?.toLowerCase())
        || blog?.catagory?.toLowerCase().includes(query?.toLowerCase()) || blog?.author?.firstName.toLowerCase().includes(query?.toLowerCase()) 
        || blog?.author?.lastName.toLowerCase().includes(query?.toLowerCase())
    )

    useEffect(()=>{
        window.scrollTo(0,0)
    },[])

  return (
    <div className='pt-32'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='mb-5 pl-6 lg:pl-0'> Search result for: "{query}"</h2>
        <div className='grid grid-cols-3 gap-7 my-10 min-h-44'>
            {
                filteredBlogs.map((blog,index)=>{
                    return <BlogCard key={index} blog={blog}/>
                })
            }
        </div>
      </div>
    </div>
  )
}

export default SearchList
