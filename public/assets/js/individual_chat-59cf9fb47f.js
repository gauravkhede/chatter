class individualChatEngine{constructor(e,s,i){this.chatBox=$(`#${e}`),this.userEmail=s,this.friendEmail=i,this.socket=io.connect("https://chatenginebygaurav.herokuapp.com/"),this.userEmail&&this.friendEmail&&this.connectionHandler(s,i)}connectionHandler(e,s){let i=this;this.socket.on("connect",(function(){console.log("Connection Established using Sockets"),i.socket.emit("join_room",{user_email:i.userEmail,friend_email:s,chatroom:e.split("@")[0]+"_"+s.split("@")[0]}),i.socket.on("user_joined",(function(e){$(".message-container").append(`<p>${e.user_email.split("@")[0]} Joined</p>`),console.log("a user joined!",e)}))})),$("#send-button").click((function(){console.log("clicked!");let e=$("#chatbox-input").val();""!=e&&i.socket.emit("send_message",{message:e,user_email:i.userEmail,friend_email:i.friendEmail,chatroom:i.userEmail.split("@")[0]+"_"+i.friendEmail.split("@")[0]})})),i.socket.on("load_old_messages",(function(e){for(var s=0;s<e.length;s++){let a=e[s].updatedAt.split("T")[1],n=(parseInt(a.split(":")[0])+5)%24+":"+(parseInt(a.split(":")[1])+30)%60,t=$('<li class="mb-2 rounded-top">'),l="other-message";e[s].user_email==i.userEmail&&(l="self-message"),t.append($("<span>",{html:e[s].message})),t.append($("<sub>",{html:n})),console.log(l),t.addClass(l),$("#individual_chat_messages_list").append(t)}})),i.socket.on("recieve_message",(function(e){console.log("message recieved",e.message);let s=$('<li class="mb-2">'),a="other-message";e.user_email==i.userEmail&&(a="self-message"),s.append($("<span>",{html:e.message})),s.append($("<sub>",{html:e.user_email})),s.addClass(a),$("#individual_chat_messages_list").append(s)}))}}