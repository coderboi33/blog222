import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { LuSend } from "react-icons/lu";
import axios from 'axios'
import { setComment } from '@/redux/commentSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDots } from 'react-icons/bs'
import { Edit, Trash2 } from 'lucide-react'

const CommentBox = ({ selectedBlog }) => {
  const { user } = useSelector(store => store.auth)
  const { blog } = useSelector(store => store.blog)
  const { comment } = useSelector(store => store.comment)
  const dispatch = useDispatch()
  const [content, setContent] = useState("")
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedContent, setEditedContent] = useState("")

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    if (inputText.trim()) {
      setContent(inputText)
    }
    else {
      setContent("")
    }

  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${selectedBlog._id}/create`, { content }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      })
      if (res.data.success) {
        let updatedCommentData
        if (comment.length >= 1) {
          updatedCommentData = [...comment, res.data.comment]
        } else {
          updatedCommentData = [res.data.comment]
        }
        dispatch(setComment(updatedCommentData))

        const updatedBlogData = blog.map(blog => blog._id === selectedBlog._id ? { ...blog, comments: updatedCommentData } :
          blog
        )
        dispatch(setBlog(updatedBlogData))
        toast.success(res.data.message)
        setContent("")
      }
    } catch (error) {
      console.log(error);
      toast.error("Comment not added")
    }
  }

  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${commentId}/delete`, { withCredentials: true })
      if (res.data.success) {
        const updatedCommentData = comment.filter((item) => item._id !== commentId)
        dispatch(setComment(updatedCommentData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error("Comment not deleted")
    }
  }

  const editCommentHandler = async (commentId) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${commentId}/edit`, { content: editedContent },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (res.data.success) {
        const updatedCommentData = comment.map(item =>
          item._id === commentId ? { ...item, content: editedContent } : item
        );
        dispatch(setComment(updatedCommentData))
        toast.success(res.data.message)
        setEditingCommentId(null)
        setEditedContent("")
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit comment")
    }
  }

  const likeCommentHandler = async (commentId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${commentId}/like`, {
        withCredentials: true
      });
      if (res.data.success) {
        const updatedComment = res.data.updatedComment;
        const updatedCommentList = comment.map(item =>
          item._id === commentId ? updatedComment : item
        );
        dispatch(setComment(updatedCommentList))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log("Error liking comment ", error);
      toast.error("Something went wrong")
    }
  }

  const changeTimeFormat = (isDate) => {
    const date = new Date(isDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-GB', options)
    return formattedDate
  }

  useEffect(() => {
    const getAllCommentsOfBlog = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/${selectedBlog._id}/comment/all`, { withCredentials: true })
        const data = res.data.comments
        // console.log(data);

        dispatch(setComment(data))
      } catch (error) {
        console.log(error);

      }
    }
    getAllCommentsOfBlog()
    // console.log(comment);

  }, [])

  return (
    <div>
      <div className='flex gap-4 mb-4 items-center'>
        <Avatar>
          <AvatarImage src={user.photoUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h3 className='font-semibold'>{user.firstName} {user.lastName}</h3>
      </div>
      <div className='flex gap-3'>
        <Textarea
          placeholder="Leave a comment"
          className='bg-gray-100 dark:bg-gray-800'
          value={content}
          onChange={changeEventHandler}
        />
        <Button onClick={commentHandler}><LuSend /></Button>
      </div>
      {
        comment.length > 0 ? <div className='mt-7 bg-gray-100 dark:bg-gray-800 p-5 rounded-md'>
          {
            comment.map((item, index) => {
              return <div key={index} className='mb-4 border-b'>
                <div className='flex items-center justify-between'>
                  <div className='flex gap-3 items-start'>
                    <Avatar>
                      <AvatarImage src={item?.userId?.photoUrl} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='mb-2 space-y-1 md:w-[400px] '>
                      <h1 className='font-semibold'>{item?.userId?.firstName} {item?.userId?.lastName} <span className='text-sm ml-2 font-light'>{changeTimeFormat(item.createdAt)}</span></h1>
                      {
                        editingCommentId === item?._id ? (
                          <>
                            <Textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              className='mb-2 bg-gray-200 dark:bg-gray-700'
                            />
                            <div className='flex py-1 gap-2'>
                              <Button className='cursor-pointer' onClick={() => editCommentHandler(item._id)}>Save</Button>
                              <Button variant="outline" className='cursor-pointer' onClick={() => setEditingCommentId(null)}>Cancel</Button>
                            </div>
                          </>
                        ) : <p className='break-words whitespace-pre-wrap'>{item?.content}</p>
                      }

                      <div className='flex gap-5 items-center'>
                        <div className='flex gap-2 items-center'>
                          <div onClick={() => likeCommentHandler(item._id)} className='flex gap-1 items-center cursor-pointer'>
                            {
                              item.likes.includes(user._id) ? <FaHeart fill='red' /> : <FaRegHeart />
                            }

                            <span>{item.numberOfLikes}</span>
                          </div>
                        </div>
                        <p className='text-sm cursor-pointer'>Reply</p>
                      </div>
                    </div>
                  </div>
                  {
                    (user._id === item?.userId?._id || user._id === item?.postId?.author?._id) ? <DropdownMenu>
                      <DropdownMenuTrigger><BsThreeDots /></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {user._id === item?.userId?._id ?
                          (<DropdownMenuItem onClick={() => {
                            setEditingCommentId(item._id);
                            setEditedContent(item.content)
                          }}><Edit />Edit</DropdownMenuItem>) :
                          null
                        }
                        <DropdownMenuItem onClick={() => deleteComment(item._id)} className='text-red-500'><Trash2 />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> : null
                  }
                </div>
                {/* <div>{console.log(item?.postId?.author?._id)
                }</div> */}
              </div>

            })
          }
        </div> : <div className='mt-7 '>No comments</div>
      }
    </div>
  )
}

export default CommentBox
