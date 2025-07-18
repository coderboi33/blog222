import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setBlog } from '@/redux/blogSlice'
import { toast } from 'sonner'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'



const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [catagory, setCatagory] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading } = useSelector(store => store.blog)
  const getSelectedCatagory = (value) => {
    setCatagory(value)
  }
  const createBlogHandler = async () => {
    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`, { title, catagory }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) {
        if (!blog) {
          dispatch(setBlog([res.data.blog]))
          navigate(`/dashboard/write-blog/${res.data.blog._id}`)
          toast.success(res.data.message)
        }
        dispatch(setBlog([...blog, res.data.blog]))
        navigate(`/dashboard/write-blog/${res.data.blog._id}`)
        toast.success(res.data.message)
      }
      else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20'>
      <Card className='md:p-10 p-4 dark:bg-gray-800 -space-y-5'>
        <h1 className='text-2xl font-bold'>Let's create blog</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi doloribus enim doloremque optio eligendi libero laudantium saepe, porro ad quas!</p>
        <div className='mt-10'>
          <div>
            <Label>Title</Label>
            <Input type="text" placeholder="Your blog name" className='bg-white dark:bg-gray-700 mt-2' value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className='mt-4 mb-5'>
            <Label className='mb-2'>Catagory</Label>
            <Select onValueChange={getSelectedCatagory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a catagory" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Catagory</SelectLabel>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-2'>
            <Button disabled={loading} onClick={createBlogHandler}>
              {
                loading ? <><Loader2 className='mr-1 w-4 h-4 animate-spin' /> Please wait</> : "Create"
              }
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CreateBlog
