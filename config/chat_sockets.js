module.exports.chatSockets= function(socketServer){
    let io= require('socket.io')(socketServer,{ cors:{ origin:'*'}});


    io.sockets.on('connection',function(socket){
        console.log("new connection recieved",socket.id);
        socket.on('join_room',function(data){
            console.log('joining request recorded',data);
    
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined',data);
        });
        //detect send message and broadcast it to everyone in the room
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('recieve_message',data);
            
            

        });
    })
    

}