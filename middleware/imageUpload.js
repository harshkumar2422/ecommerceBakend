import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowedFormats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });
var cpUpload0 = upload.fields([
  { name: "images", maxCount: 20 },
  { name: "image", maxCount: 1 },
]);

export default cpUpload0


