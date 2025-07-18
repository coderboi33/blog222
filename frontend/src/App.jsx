// import React from 'react'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Home from './pages/Home'
// import Blogs from './pages/Blogs'
// import About from './pages/About'
// import Login from './pages/Login'
// import Signup from './pages/Signup'
// import Navbar from './components/Navbar'
// import Dashboard from './pages/Dashboard'
// import Profile from './pages/Profile'
// import YourBlog from './pages/YourBlog'
// import Comments from './pages/Comments'
// import CreateBlog from './pages/CreateBlog'
// import UpdateBlog from './pages/UpdateBlog'
// import BlogView from './pages/BlogView'
// import Footer from './components/Footer'


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <><Navbar /><Home /><Footer/></>
//   },
//   {
//     path: "/blogs",
//     element: <><Navbar /><Blogs /><Footer/></>
//   },
//   {
//     path: "/about",
//     element: <><Navbar /><About /><Footer/></>
//   },
//   {
//     path: "/login",
//     element: <><Navbar /><Login /></>
//   },
//   {
//     path: "/signup",
//     element: <><Navbar /><Signup /></>
//   },
//   {
//     path: "/blogs/:blogId",
//     element: <><Navbar /><BlogView /></>
//   },
//   {
//     path: "/dashboard",
//     element: <><Navbar /><Dashboard /></>,
//     children: [
//       {
//         path: "profile",
//         element: <Profile />
//       },
//       {
//         path: "your-blog",
//         element: <YourBlog />
//       },
//       {
//         path: "comments",
//         element: <Comments />
//       },
//       {
//         path: "write-blog",
//         element: <CreateBlog />
//       },
//       {
//         path: "write-blog/:blogId",
//         element:<UpdateBlog/>
//       }
//     ]
//   },
// ])

// const App = () => {
//   return (
//     <>
//       <RouterProvider router={router} />
//     </>
//   )
// }

// export default App
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Blogs = lazy(() => import('./pages/Blogs'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const YourBlog = lazy(() => import('./pages/YourBlog'));
const Comments = lazy(() => import('./pages/Comments'));
const CreateBlog = lazy(() => import('./pages/CreateBlog'));
const UpdateBlog = lazy(() => import('./pages/UpdateBlog'));
const BlogView = lazy(() => import('./pages/BlogView'));
const SearchList = lazy(() => import('./pages/SearchList'));

// Navbar and Footer loaded eagerly (you can lazy them too if needed)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Loader2 } from 'lucide-react';

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar /><Home /><Footer /></>
  },
  {
    path: "/blogs",
    element: <><Navbar /><Blogs /><Footer /></>
  },
  {
    path: "/about",
    element: <><Navbar /><About /><Footer /></>
  },
  {
    path: "/search",
    element: <><Navbar /><SearchList /><Footer /></>
  },
  {
    path: "/login",
    element: <><Navbar /><Login /></>
  },
  {
    path: "/signup",
    element: <><Navbar /><Signup /></>
  },
  {
    path: "/blogs/:blogId",
    element: <><Navbar /><BlogView /></>
  },
  {
    path: "/dashboard",
    element: <><Navbar /><Dashboard /></>,
    children: [
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "your-blog",
        element: <YourBlog />
      },
      {
        path: "comments",
        element: <Comments />
      },
      {
        path: "write-blog",
        element: <CreateBlog />
      },
      {
        path: "write-blog/:blogId",
        element: <UpdateBlog />
      }
    ]
  },
]);

const App = () => {
  return (
    <Suspense fallback={<Loader2 className='w-full h-screen animate-spin' />}>
      <RouterProvider router={router} />
    </Suspense>

  );
};

export default App;

