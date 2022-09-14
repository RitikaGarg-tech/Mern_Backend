var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
})

function uploadToCloudinary(file){
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            file,
            {
                resource_type: "auto"},
                async (error, result) => {
                    if(error) {
                        console.log(error);
                        reject(error);
                    }
                    if(result){
                        resolve(result.url)
                    }
                }
        );
    });
}
module.exports = uploadToCloudinary;