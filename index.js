const express=require("express")
const app=express()
const corss=require("cors")
const AuthRouter=require("./routes/authRouter")
const productRouter=require("./routes/product")
const path=require("path")
require("dotenv").config()
require("./models/db")

// const upload = multer({ dest: 'uploads/' })


const PORT=process.env.PORT || 9000



app.use(express.json())
app.use(express.urlencoded({extended:false})) // for parsing form data
app.use(corss())




app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.use("/auth",AuthRouter)
app.use("/products",productRouter)

app.listen(PORT,()=>{
  console.log(`Server is running on Port ${PORT}`)
})