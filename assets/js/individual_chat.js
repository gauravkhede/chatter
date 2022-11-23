// const mongoose=require('mongoose');

// const Chatting = require("../../models/chatengine");

// const Chatting=require('Chatting');

class individualChatEngine{
    constructor(chatBoxId,userEmail,friendEmail){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.friendEmail=friendEmail;
        this.socket=io.connect('https://chatenginebygaurav.herokuapp.com/');
        if(this.userEmail && this.friendEmail){
            this.connectionHandler(userEmail,friendEmail);
        }
        // var socket = io('https://localhost:8000', { transports : ['websocket'] });
    
    }

    connectionHandler(userEmail,friendEmail){
        
        let self=this;

        this.socket.on('connect',function(){
            console.log('Connection Established using Sockets');
            
            self.socket.emit('join_room',{
                user_email: self.userEmail,
                friend_email:friendEmail,
                chatroom: userEmail.split("@")[0]+"_"+friendEmail.split("@")[0],
            });
            self.socket.on('user_joined',function(data){
                $('.message-container').append(`<p>${data.user_email.split("@")[0]} Joined</p>`)
                console.log('a user joined!',data);
            })
        });

        //send a message on clicking send message button
        $('#send-button').click(function(){
            console.log("clicked!");
            let msg= $('#chatbox-input').val();
            // console.log(self.userEmail.split("@")[0]," is  email without @");
            

            if(msg!=''){
                self.socket.emit('send_message',{
                    message:msg,
                    user_email:self.userEmail,
                    friend_email:self.friendEmail,
                    chatroom:self.userEmail.split("@")[0]+"_"+self.friendEmail.split("@")[0]
                });
                
                

            }
        });
        self.socket.on('load_old_messages',function(docs){
            
            
            for(var i=0;i<docs.length;i++){
            let time=docs[i].updatedAt.split("T")[1];
            let hours=(parseInt(time.split(":")[0])+5)%24+":"+(parseInt(time.split(":")[1])+30)%60;
            let newMessage= $('<li class="mb-2 rounded-top">');
            let messageType='other-message';
            
            if(docs[i].user_email==self.userEmail){    
                messageType='self-message';
            }

            newMessage.append($('<span>',{
                'html': docs[i].message
            }));
            newMessage.append($('<sub>',{
                'html':hours,
            }));
            console.log(messageType);
            newMessage.addClass(messageType);
            $('#individual_chat_messages_list').append(newMessage);
        }
        });

        self.socket.on('recieve_message',function(data){
            console.log('message recieved',data.message);

            let newMessage= $('<li class="mb-2">');

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
            $('#individual_chat_messages_list').append(newMessage);


        });

    }
}
            