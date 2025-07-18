import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useRef, useState } from 'react'
import JoditEditor from "jodit-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { setLoading } from '@/redux/authSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { setBlog } from '@/redux/blogSlice'

const UpdateBlog = () => {
  const editor = useRef(null)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [loading,setLoading]=useState(false)
  const params = useParams()
  const id = params.blogId;
  const { blog, loading } = useSelector(store => store.blog);
  const selectBlog = blog.find(blog => blog._id === id)
  // const selectBlog = blog.find((b) => b._id === id)
  const [publish, setPublish] = useState(selectBlog.isPublished || false)


  const [content, setContent] = useState(selectBlog.description)
  const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog?.thumbnail)

  const [blogData, setBlogData] = useState({
    title: selectBlog?.title,
    subtitle: selectBlog?.subtitle,
    description: content,
    catagory: selectBlog?.catagory,
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const selectCatagory = (value) => {
    setBlogData({ ...blogData, catagory: value })
  }

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, thumbnail: file })
      const fileReader = new FileReader()
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
      fileReader.readAsDataURL(file)
    }
  }

  const updateBlogHandler = async () => {
    const formData = new FormData()
    formData.append("title", blogData.title)
    formData.append("subtitle", blogData.subtitle)
    formData.append("description", content)
    formData.append("catagory", blogData.catagory)
    formData.append("file", blogData.thumbnail)
    try {
      dispatch(setLoading(true))
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      })
      if (res.data.success) {
        navigate('/dashboard/your-blog')
        toast.success(res.data.message)

        console.log(blogData)
      }
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  const togglePublishUnpublish = async () => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${id}`, {
        // params:{
        //   action
        // },
        withCredentials: true
      })
      if (res.data.success) {
        setPublish(!publish)
        toast.success(res.data.message)
        navigate('/dashboard/your-blog')
      }
      else {
        toast.error("Failed to update")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/delete/${id}`, { withCredentials: true })
      if (res.data.success) {
        const updateBlogData = blog.filter((blogItem) => blogItem?._id !== id)
        dispatch(setBlog(updateBlogData))
        toast.success(res.data.message)
        navigate('/dashboard/your-blog')
      }

    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }
  return (
    <div className='md:ml-[320px] pt-20 px-3 pb-10'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className='w-full bg-white dark:bg-gray-800 p-5'>
          <h1 className='text-4xl font-bold'>Basic Blog Information</h1>
          <p>Make changes to your blog here. Click publish when you are done</p>
          <div className='space-x-2'>
            <Button onClick={() => togglePublishUnpublish(selectBlog.isPublished ? "false" : "true")} className='cursor-pointer'>
              {
                selectBlog?.isPublished ? "Unpublish" : "Publish"
              }
            </Button>
            <Button onClick={() => deleteBlog(id)} variant='destructive' className='cursor-pointer'>Remove Blog</Button>
          </div>
          <div className='pt-5'>
            <Label>Title</Label>
            <Input type="text" placeholder="Enter a title" name="title" value={blogData.title} onChange={handleChange} className='dark:border-gray-300 mt-2' />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input type="text" placeholder="Enter a subtitle" name="subtitle" value={blogData.subtitle} onChange={handleChange} className='dark:border-gray-300 mt-2' />
          </div>
          <div>
            <Label className='mb-1'>Description</Label>
            <JoditEditor
              ref={editor}
              className='jodit_toolbar'
              value={blogData.description}
              onChange={newContent => setContent(newContent)}
            />
          </div>
          <div>
            <Label className='mb-1'>Catagory</Label>
            <Select onValueChange={selectCatagory} className='dark:border-gray-300'>
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
          <div>
            <Label className='mb-1'>Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              id='file'
              accept="image/*"
              className='w-fit dark:border-gray-300'
            />
            {
              previewThumbnail && (
                <img src={previewThumbnail} className='w-64 my-2' alt="Blog Thumbnail" />
              )
            }
          </div>

          <div className='flex gap-3'>
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            <Button disabled={loading} onClick={updateBlogHandler}>
              {
                loading ? <><Loader2 className='mr-2 w-4 h-4 animate-spin' />Please wait</> : "Save"
              }
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default UpdateBlog
