const cloudinary = require('cloudinary').v2;
const fs=require('fs');


// Configuration 
cloudinary.config({
  cloud_name: "dglryejcl",
  api_key: "834641589162473",
  api_secret: "8ZhuAsdBGtOiqjcgILcy0SgZIvc"
});

const upload=async function(file){
    return cloudinary.uploader.upload(file,{
        public_id:`${Date.now()}`,
        resource_type:"auto",
        folder:"twitter",
    }).then((result)=>{

      fs.unlinkSync(file);
      return {
        message:'success',
        url:result.url
      };
      
    }).catch((error)=>{
      fs.unlink(file);
      return {
        message:'fail'
      }
    })
}

module.exports={upload};