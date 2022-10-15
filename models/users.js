const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars');
const UserSchema=new mongoose.Schema({
    avatar:{
        type:String
    }
},{
    timestamps:true
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });
  
  //static modules
UserSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
UserSchema.statics.avatarPath= AVATAR_PATH;

const User=mongoose.model('User',UserSchema);
module.exports= User