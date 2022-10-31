const Chatting=require('../models/chatEngine');
module.exports.chatSockets= function(socketServer){
    let io= require('socket.io')(socketServer,{ cors:{ origin:'*'}});


    io.sockets.on('connection',function(socket){
         
        console.log("new connection recieved",socket.id);
        socket.on('disconnect',function(){
            console.log('Socket disconnected');
        });
        socket.on('join_room',function(data){
            console.log('joining request recorded',data);
            let reverseChatroom=data.chatroom.split("_")[1]+"_"+data.chatroom.split("_")[0];
            Chatting.find({ chatroom:{$in: [ data.chatroom, reverseChatroom ] } },function(err,docs){
                if(err){ console.log('error in finding chat message',err); return; }
                socket.emit('load_old_messages',docs);
            });
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined',data);
        });
        //detect send message and broadcast it to everyone in the room
        socket.on('send_message',function(data){
            console.log(data.chatroom," is the data inside chatroom");
            var newMsg= new Chatting({message:data.message,user_email:data.user_email,chatroom:data.chatroom});
            newMsg.save(function(err){
                if(err){ console.log('*** Falana Error in chat_sockets line 22 ',err); return; }
                if(data.friend_email!==undefined){
                    io.to([data.user_email.split("@")[0]+"_"+data.friend_email.split("@")[0], data.friend_email.split("@")[0]+"_"+data.user_email.split("@")[0]]).emit("recieve_message",data);
                }else{
                io.in(data.chatroom).emit('recieve_message',data);
                }
            });
            });
    })
    

}