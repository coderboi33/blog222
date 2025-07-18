import store from '@/redux/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { Bookmark, MessageSquare, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import CommentBox from "@/components/CommentBox"

const BlogView = () => {
    const params = useParams()
    const blogId = params.blogId
    const { blog } = useSelector(store => store.blog)
    const { user } = useSelector(store => store.auth)
    const selectedBlog = blog?.find(blog => blog._id === blogId)
    const [blogLike, setBlogLike] = useState(selectedBlog.likes.length)
    const [liked, setLiked] = useState(selectedBlog?.likes.includes(user._id) || false)
    const dispatch = useDispatch()

    const changeTimeFormat = (isDate) => {
        const date = new Date(isDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' }
        const formattedDate = date.toLocaleDateString('en-GB', options)
        return formattedDate
    }

    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`
        if (navigator.share) {
            navigator.share({
                title: 'Check out this blog',
                text: 'Read this amazing blog post',
                url: blogUrl,
            }).then(() => console.log('Shared successfully')).catch((err) => console.error('Error Sharing: ', err))
        }
        else {
            //fall back copy to clipboard
            navigator.clipboard.writeText(blogUrl).then(() => {
                toast.success("Blog link copied to clipboard")
            })
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like'
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${selectedBlog._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1
                setBlogLike(updatedLikes)
                setLiked(!liked)
            }
            const updatedBlogData = blog.map(p => p._id === selectedBlog._id ? {
                ...p,
                likes: liked ? p.likes.filter(id => id !== user?._id) : [...p.likes, user._id]
            } : p
            )
            toast.success(res.data.message)
            dispatch(setBlog(updatedBlogData))
        } catch (error) {
            console.log(error)
            toast.error(error.res.data.message)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div className='pt-14'>
            <div className='max-w-6xl mx-auto p-10'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard/your-blog">Blogs</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* blog header */}
                <div className='my-8'>
                    <h1 className='text-4xl font-bold tracking-tight mb-4'>{selectedBlog.title}</h1>
                    <div className='flex items-center justify-between flex-wrap gap-4'>
                        <div className='flex items-center space-x-4'>
                            <Avatar>
                                <AvatarImage src={selectedBlog.author.photoUrl} alt="author" />
                                <AvatarFallback>RR</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='font-medium'>{selectedBlog.author.firstName} {selectedBlog.author.lastName}</p>

                            </div>
                        </div>
                        <p className='text-sm text-muted-foreground'>Published on {changeTimeFormat(selectedBlog.createdAt)}</p>

                    </div>
                </div>
                {/* featured image */}
                <div className='mb-8 rounded-lg overflow-hidden'>
                    <img src={selectedBlog.thumbnail} alt="thumbnail" width={1000} height={500} className='w-full object-cover' />
                    <p className='text-sm text-muted-foreground mt-2 italic'>{selectedBlog.subtitle}</p>
                </div>
                <p dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />
                <div className='mt-10'>
                    <div className='flex flex-wrap gap-2 mb-8'>
                        <Badge variant='secondary' className='dark:bg-gray-800' >{selectedBlog?.catagory}</Badge>
                    </div>
                    {/* engagement */}
                    <div className='flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8'>
                        <div className='flex items-center space-x-4'>
                            <Button onClick={likeOrDislikeHandler} variant="ghost" className="flex items-center gap-1">
                                {
                                    liked ? <FaHeart size={24} className='cursor-pointer text-red-600' /> : <FaRegHeart size={24} className='cursor-pointer hover:text-gray-600 dark:text-white' />
                                }
                                <span>{blogLike}</span></Button>
                            <Button variant="ghost" size="sm">
                                <MessageSquare className='h-4 w-4' />
                                <span>1 Comments</span>
                            </Button>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Button variant="ghost">
                                <Bookmark className='w-4 h-4' />
                            </Button>
                            <Button onClick={() => handleShare(selectedBlog._id)} variant='ghost' size="sm">
                                <Share2 className='w-4 h-4' />
                            </Button>
                        </div>
                    </div>
                </div>
                <CommentBox selectedBlog={selectedBlog} />
            </div>

        </div>
    )
}

export default BlogView
