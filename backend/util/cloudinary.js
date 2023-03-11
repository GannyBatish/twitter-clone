const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "dglryejcl",
  api_key: "834641589162473",
  api_secret: "8ZhuAsdBGtOiqjcgILcy0SgZIvc"
});

const upload=async function(file){
    const result=await cloudinary.uploader.upload(file,{
        public_id:`${Date.now()}`,
        resource_type:"auto",
        folder:"twitter"
    })
    return result;
}

module.exports={upload};