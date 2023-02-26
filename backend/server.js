const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const app=express();

dotenv.config();

app.use(cors());
app.options('*',cors());

app.get('/',(req,res)=>{
    res.send('Server Running')
})


const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Listening at http://localhost:${PORT}`);
})