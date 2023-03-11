const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const userRoute=require('./routes/userRoute');
const followRoute=require('./routes/followRoute');
const tweetRoute=require('./routes/tweetRoute');
const connectToMongoDB=require('./db');
const { notFound, errorHandler } = require('./midlleware/errorMiddleware');
const fileUpload=require('express-fileupload');
const app=express();
app.use(express.json());
app.use(fileUpload({
    useTempFiles:true,
}));

dotenv.config();
connectToMongoDB();

app.use(cors());
app.options('*',cors());

app.use('/auth',userRoute);
app.use('/',followRoute);
app.use('/tweet',tweetRoute);

app.use(errorHandler);
app.use(notFound);
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Listening at http://localhost:${PORT}`);
})