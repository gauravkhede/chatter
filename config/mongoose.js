const mongoose=require('mongoose');
const env=require('./environment');

mongoose.connect(`mongodb+srv://gaurav_khede:CxBwZDQN4ctUEikh@cluster0.mqsuwlh.mongodb.net/${env.db}?retryWrites=true`);


const db=mongoose.connection;


db.on('error',console.error.bind(console,'Error connecting to mongoDb'));

db.once('open',function(){
    console.log('Connected to database:: MongoDB');
});
module.exports=db;