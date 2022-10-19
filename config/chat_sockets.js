module.exports.chatSockets= function(socketServer){
    let io= require('socket.io')(socketServer,{ cors:{ origin:'*'}});


    io.sockets.on('connection',function(socket){
        console.log("new connection recieved",socket.id);
        socket.on('disconnect',function(){
            console.log('Socket disconnected');
        });
        socket.on('join_room',function(data){
            console.log('joining request recorded',data);
    
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined',data);
        });
        //detect send message and broadcast it to everyone in the room
        socket.on('send_message',function(data){
            console.log(data.chatroom," is the data inside chatroom");
            if(data.friend_email!==undefined){
                io.to([data.user_email.split("@")[0]+"_"+data.friend_email.split("@")[0], data.friend_email.split("@")[0]+"_"+data.user_email.split("@")[0]]).emit("recieve_message",data);
            }else{
            io.in(data.chatroom).emit('recieve_message',data);
            }
            
            

        });
    })
    

}