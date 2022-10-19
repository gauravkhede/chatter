// const mongoose=require('mongoose');

// const Chatting = require("../../models/chatengine");

// const Chatting=require('Chatting');

class groupChat{
    constructor(chatBoxId,userEmail){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.socket=io.connect('http://localhost:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
        // var socket = io('https://localhost:8000', { transports : ['websocket'] });
    
    }

    connectionHandler(){
        
        let self=this;

        this.socket.on('connect',function(){
            console.log('Connection Established using Sockets');
            
            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chatroom: 'codeial',
            });
            self.socket.on('user_joined',function(data){
                console.log('a user joined!',data);
            })
        });

        //send a message on clicking send message button
        $('#sendButton').click(function(){
            console.log("clicked!");
            let msg= $('#chatboxInput').val();
            console.log(msg," message");

            if(msg!=''){
                self.socket.emit('send_message',{
                    message:msg,
                    user_email:self.userEmail,
                    chatroom:'codeial'
                });
                
                

            }
        });
        // self.socket.on('load_old_messages',function(docs){
        //     for(var i=0;i<docs.length;i++){
        //     let newMessage= $('<li>');
        //     let messageType='other-message';
        //     if(docs.user_email==self.userEmail){    
        //         messageType='self-message';
        //     }

        //     newMessage.append($('<span>',{
        //         'html': docs[i].message
        //     }));
        //     newMessage.append($('<sub>',{
        //         'html':docs[i].user_email,
        //     }));
        //     newMessage.addClass(messageType);
        //     $('#chat_messages_list').append(newMessage);
        // }
        // });

        self.socket.on('recieve_message',function(data){
            console.log('message recieved',data.message);

            let newMessage= $('<li>');
            // console.log("newMessage before",newMessage);
            let messageType='other-message';
            if(data.user_email==self.userEmail){
                messageType='self-message';
            }

            newMessage.append($('<span>',{
                'html': data.message
            }));
            newMessage.append($('<sub>',{
                'html':data.user_email,
            }));
            newMessage.addClass(messageType);
            // console.log("newMessage ",newMessage);
            $('#chatMessagesList').append(newMessage);


        });

    }
}
            