import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js"
import blogRoute from "./routes/blog.route.js"
import commentRoute from "./routes/comment.route.js"
import cors from 'cors'
import cookieParser from "cookie-parser";
// import path from "path";

dotenv.config();

const app = express();

//default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// const __dirname = path.resolve()

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);

// app.use(express.static(path.join(_dirname,"/frontend/dist")))
// app.use(express.static(path.join(__dirname,"/frontend/dist")))

// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// app.get("*",(_,res)=>{
//     res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
// })
// app.get("/*", (_, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });
// app.use(express.static(path.join(__dirname, "frontend", "dist")));

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
})
