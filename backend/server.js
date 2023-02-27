const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const userRoute=require('./routes/userRoute');
const connectToMongoDB=require('./db');
const { notFound, errorHandler } = require('./midlleware/errorMiddleware');

const app=express();
app.use(express.json());
dotenv.config();
connectToMongoDB();

app.use(cors());
app.options('*',cors());

app.use('/auth',userRoute);

app.use(errorHandler);
app.use(notFound);
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Listening at http://localhost:${PORT}`);
})