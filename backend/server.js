const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const connectToMongoDB=require('./db');

const app=express();
dotenv.config();
connectToMongoDB();

app.use(cors());
app.options('*',cors());

app.get('/',(req,res)=>{
    res.send('Server Running')
})


const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Listening at http://localhost:${PORT}`);
})