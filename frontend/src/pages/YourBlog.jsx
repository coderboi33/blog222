import { Card } from '@/components/ui/card'
import React, { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog } from '@/redux/blogSlice'
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]



const YourBlog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { blog } = useSelector(store => store.blog)
  const getOwnBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/get-own-blogs`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setBlog(res.data.blogs));
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
      if (!confirmDelete) return;
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/delete/${id}`, { withCredentials: true })
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id)
        dispatch(setBlog(updatedBlogData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    getOwnBlogs()
  }, [])

  const formatDate = (index) => {
    const date = new Date(blog[index].createdAt)
    const formattedDate = date.toLocaleDateString("en-GB")
    return formattedDate
  }
  return (
    <div className='pb-10 pt-20 md:ml-[320px] h-screen'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption>A list of your blogs.</TableCaption>
            <TableHeader className='overflow-x-auto'>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Catagory</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='overflow-x-auto'>
              {blog.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="flex gap-4 items-center">
                    <img src={item.thumbnail} className='w-20 rounded-md hidden md:block' />
                    <h1 onClick={() => navigate(`/blogs/${item._id}`)} className='hover:underline cursor-pointer w-16 truncate md:w-full'>{item.title}</h1>
                  </TableCell>
                  <TableCell className='w-14 truncate'>{item.catagory}</TableCell>
                  <TableCell className='w-14 '>{formatDate(index)}</TableCell>
                  <TableCell className='text-center'>
                    <DropdownMenu>
                      <DropdownMenuTrigger >
                        <BsThreeDotsVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/write-blog/${item._id}`)}><Edit />Edit</DropdownMenuItem>
                        <DropdownMenuItem className='text-red-500' onClick={() => deleteBlog(item._id)}><Trash2 className='text-red-500' />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default YourBlog
