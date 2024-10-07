import multer from "multer";

//Lưu hình ảnh
const storage = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, file.originalname)
    }
})

const upload = multer({storage})

export default upload