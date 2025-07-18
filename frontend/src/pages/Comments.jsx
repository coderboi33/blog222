import { Card } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Comments = () => {
  const [allComments, setAllComments] = useState([])
  const navigate = useNavigate()

  const getTotalComments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/comment/my-blogs/comments`, { withCredentials: true })
      if (res.data.success) {
        setAllComments(res.data.comments)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTotalComments()
  }, [])
  return (
    <div className='pb-10 pt-20 md:ml-[320px] h-screen'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className='w-full p-5 space-y-2 dark:bg-gray-800'>
          <Table>
            <TableCaption>A list of your recent comments</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Blog Title</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right flex items-center justify-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allComments.map((comment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium max-w-2 truncate">{comment.postId.title}</TableCell>
                  <TableCell className='max-w-5 truncate'>{comment.content}</TableCell>
                  <TableCell>{comment.userId.firstName}</TableCell>
                  <TableCell className="text-right flex gap-3 items-center justify-center">
                    <Eye className='cursor-pointer' onClick={() => navigate(`/blogs/${comment.postId._id}`)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

export default Comments
