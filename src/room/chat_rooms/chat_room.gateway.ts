import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger, UsePipes } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { PrismaService } from 'src/prisma/prisma.service';
import { dto_admin,dto_ban_mute, dto_changePass,dto_invite, dto_join_room, dto_kick, dto_msg} from "../dto/create-room.dto";
import { ChatRoomService } from './chat_room.service';
import { WSValidationPipe } from "../validationWs";

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
    },
    
})

export class AppGateway {
    
    constructor(private prisma: PrismaService, private chatroomservice: ChatRoomService){}
    myMap = new Map();
	banned: string[] = [];

    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('AppGateway');


    @SubscribeMessage('JoinRoom')
    @UsePipes(WSValidationPipe)
    async Join_room(client: Socket, infos : dto_join_room)
	{
       client.leave(client.data.current_room);

        client.data.current_room = infos.room;
        const  user = client.data.from ;
        const room = client.data.current_room
        let error = 0;
        const check = this.myMap.get(client.id);
       try{
            if (typeof check !== "undefined" && ( check.user_id != user))
                error = 1; 
            else
            {
                if(await this.chatroomservice.getOwner(user, room))
                    this.myMap.set(client.id, {"user_id" : user , "room_id" : room , "user_role" : "owner"}) ;
                else 
                    this.myMap.set(client.id, {"user_id" : user , "room_id" : room , "user_role" : "user"}) ;
                if (!await this.chatroomservice.add_user_to_room({ from: user, to: room }))
                    error = 1 ;
                if(!error)
                {
                    client.join(room);
                    console.log("user : " , user ,  " joined room : " , room , "!!!!");
                    client.emit("roomsOfUser" , {"status" : true , "action" : "" , "message" : `Join ${room}` , "user" : `${user}`})
                }
            }
       }
        catch(exception)
        {
            client.emit("roomsOfUser" , {"status" : false , "action" : "" ,"message" :`${user} can't join ` , "user" :  `${user}`} );
        }
        if(error)
        {
            client.emit("roomsOfUser" , {"status" : false , "action" : "" , "message" :`${user} can't join ` , "user" :  `${user}`} );
        }
        console.log("---------------------JOIN-----------------------")
        console.log(this.myMap);
        console.log("-------------------------------------------------");

    }



    @SubscribeMessage('leaveRoom')
    @UsePipes(WSValidationPipe)
    async leaveRoom(client: Socket)
    {
        const  user = client.data.from;
        const  room = client.data.current_room;
        let check = this.myMap.get(client.id);
        let error = 0;
   
        try 
        {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room)
            {
                if (await this.chatroomservice.leaveRoom(check.user_role, room, user))
                {
                    for (let [key, value] of this.myMap)
                    {
                        if(value.user_id === user)
                        {
                            this.server.sockets.sockets.get(key).emit("roomsOfUser" , {"status" : true , "action" : "leave" , "message" :`you have  left ${room}` , "user" : `${user}`});
                            if(value.room_id === room)
                                   this.server.sockets.sockets.get(key).leave(room);
                          
                        }
                    }
              
                    if(check.user_role === "owner")
                    {
                        const ret = await this.chatroomservice.getNewOwner(room);
                        if(ret)
                        {
 
                            for (let [key, value] of this.myMap)
                            {
                                if(value.user_id === ret.owner)
                                {
                                    if(value.room_id === room)
                                        this.myMap.set(client.id, {"user_id" : user , "room_id" : room , "user_role" : "owner"})
                                    this.server.sockets.sockets.get(key).emit("roomsOfUser" , {"status" : true , "action" : "setAdmin", "message" :`you are the new owner of ${room}` , "user" : `${user}`})
                                }
                            }
                        }
                    }
                }
                else  error = 1 ; /* if the client is not deleted successfully */
            }
            else error = 1 ; /* error case if client not joined */
       }
        catch(exception) /* case of something wrong , an exception is thrown by the server  :  a query failed ...  */
        {
            client.emit("roomsOfUser" , {"status" : false , "action" : "leave", "message" : `failed to leave ${room}` , "user" :  user})
        }
        if(error)
            client.emit("roomsOfUser" , {"status" : false , "action" : "leave", "message" : `failed to leave ${room}` , "user" :  user})
    }



    @SubscribeMessage('setAdmin')
    @UsePipes(WSValidationPipe)
    async setAdmin(client :Socket , infos : dto_admin)
    {
        
        const  user = client.data.from;
        const  room = client.data.current_room;
        let check = this.myMap.get(client.id);
        let error = 0;
        try {
            if(typeof check !== "undefined" && check.user_id === user && check.room_id === room && check.user_role === "owner")
            {
                if(await this.chatroomservice.setAdmin(infos, room))
                {
                   client.emit("roomsOfUser" , {"status" : true , "action" : "setAdmin" ,"message" : `${infos.new_admin} is a new admin in   ${room}` , "user" : user });
                   for (let [key, value] of this.myMap)
                    {
                        if(value.user_id === infos.new_admin)
                            this.server.sockets.sockets.get(key).emit("roomsOfUser" , {"status" : true , "action" : "setAdmin", "message" :`you are admin of ${room}` , "user" : `${user}`})
                    }
                }
                else error = 1;
            }
            else error = 1;
        }
        catch(exception)
        {
            client.emit("roomsOfUser" ,{"status" : false ,"action" : "setAdmin" , "message" : `can't set ${infos.new_admin} admin` , "user" : user})
        }
        if(error)
            client.emit("roomsOfUser" ,{"status" : false , "action" : "setAdmin" ,"message" : `can't set ${infos.new_admin} admin` , "user" : user})
    }




    @SubscribeMessage('disablePassword')
    @UsePipes(WSValidationPipe)
    async disablePassword(client : Socket)
    {
        const  user = client.data.from;
        const  room = client.data.current_room;
        let check = this.myMap.get(client.id);
        let error = 0;
        try
        {
            if (typeof check !== "undefined" && check.user_id === user && check.user_role === "owner")
            {
                if (!await this.chatroomservice.disablePassword(user,room))
                {
                    
                    error = 1;
                } 
                else
                {
                    client.emit("roomsOfUser", {"status" : true , "action" : "setAdmin" ,"message" : `password is disabled successfully for ${room}` , "user" : user })
                    for (let [key, value] of this.myMap)
                    {
                            this.server.sockets.sockets.get(key).emit("roomsOfUser" , {"status" : true , "action" : "setAdmin", "message" :`password of ${room} is disabled` , "user" : `${user}`})

                    }
         
                }
            }
            else error = 1 ;
        }
        catch(exception)
        {
           // console.log("errorr\n");
            client.emit("roomsOfUser" ,{status : false , "action" : "" , "message": "" ,  "user" : `${user}` })
        }
        if(error)
            client.emit("roomsOfUser" ,{status : false , "action" : "" , "message" : "" ,  "user" : `${user}` })
    }

    @SubscribeMessage('changePassword')
    @UsePipes(WSValidationPipe)
    async changePassword(client, infos : dto_changePass) 
    {

        const  user = client.data.from;
        const  room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0 ;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room && check.user_role === "owner") {
                const ret = await this.chatroomservice.changePassword(room, infos);
                if (ret)
                    client.emit("roomsOfUser", { "status": true, "action" : "setAdmin", "message": `password of ${room} has been changed successfully`, "user": `${user}` });
                else error = 1;
            }
            else error = 1;
        }
        catch (exception) {
            client.emit("roomsOfUser", { "status": false, "action" : "" ,"message": `failed to change password of  ${room}`, "user": `${user}` });
        }
        if(error)
            client.emit("roomsOfUser", { "status": false, "action" : "" ,"message": `failed to change password of  ${room}`, "user": `${user}` });

    }
    

    @SubscribeMessage('mute') /* test is done */
    @UsePipes(WSValidationPipe)
    async mute_user(client : Socket , infos : dto_ban_mute)
    {
        const  user = client.data.from;
        const  room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0 ;
        let time = 0;

        if (infos.type === "hour")
            time = infos.time * 60 * 60 * 1000;
        else if (infos.type === "minute")
            time = infos.time * 60 * 1000;
        else if (infos.type === "jour")
            time = infos.time * 24 * 60 * 60 * 1000;

        try
        {
            if ( typeof check  !== "undefined" &&  check.user_id === user && check.room_id === room && (check.user_role === "owner" || check.user_role === "admin" ))
            {
                if (await this.chatroomservice.ban_mute_user_in_room(room , infos.who,"muted",check.user_role))
                {
                        
                        client.emit("roomsOfUser", {"status" : true , "action" : "" ,"message" : `${infos.who}  muted successfully` , "user" :  `${user}`})
                        for (let [key, value] of this.myMap)
                        {
                            if(value.user_id === infos.who  && value.room_id === room)
                                this.server.sockets.sockets.get(key).emit("disableWriting",{"status" : false, "message" : `muted in ${room}`  , "user" :  infos.who})
                        }
                      
                        setTimeout(async () => {
                            if (!await this.chatroomservice.update_ban_mute_user_in_room(room , infos.who))
                                error = 1;
                            else
                            {
                                for (let [key, value] of this.myMap)
                                {
                                    if(value.user_id === infos.who && value.room_id === room)
                                        this.server.sockets.sockets.get(key).emit("disableWriting",{"status" : true, "message" : `unmuted in ${room}`  , "user" :  infos.who})
                                }
                            }
                        }, time)
                }else error = 1 ;
            }
            else error = 1;
        }
        catch(exception)
        {
            error = 1;
        }
        if (error)
            client.emit("roomsOfUser", {"status" : false , "action" : "" ,"message" : `failed to mute ${infos.who}` , "user" : user })
    }


    @SubscribeMessage('ban') /* test is done */
    @UsePipes(WSValidationPipe)
    async ban_user(client: Socket, infos: dto_ban_mute){
        const  user = client.data.from;
        const  room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0 ;
        let time = 0 ;

        if (infos.type === "hour")
            time = infos.time * 60 * 60 * 1000;
        else if (infos.type === "minute")
            time = infos.time * 60 * 1000;
        else if (infos.type === "day")
            time = infos.time * 24 * 60 * 60 * 1000;
        try 
        {
            if( typeof check  !== "undefined" &&  check.user_id === user && check.room_id === room && (check.user_role === "owner" || check.user_role === "admin" ))
            {
                if(await this.chatroomservice.ban_mute_user_in_room(room , infos.who,"banned", check.user_role))
                {
                    client.emit("roomsOfUser", {"status" : true , "action" : "" ,"message" : `${infos.who}  banned successfully` , "user" :  `${user}`})

                    for (let [key, value] of this.myMap) 
                    {
                        if (value.user_id === infos.who ) 
                        {
                            this.server.sockets.sockets.get(key).leave(room);
                        }
                    }
                    for (let [key, value] of this.myMap)
                    {
                        if(value.user_id === infos.who && value.room_id === room)
                            this.server.sockets.sockets.get(key).emit("disableWriting",{"status" : false, "message" : `banned in ${room}`  , "user" :  infos.who})
                    }

                    setTimeout(async () => {
                        if (!await this.chatroomservice.update_ban_mute_user_in_room(room , infos.who))
                            error = 1;
                            for (let [key, value] of this.myMap) 
                            {
                                if (value.user_id === infos.who) {
                                    this.server.sockets.sockets.get(key).join(room);
                                }
                            }
                            for (let [key, value] of this.myMap)
                            {
                                if(value.user_id === infos.who && value.room_id === room)
                                    this.server.sockets.sockets.get(key).emit("disableWriting",{"status" : true, "message" : `unbanned in ${room}`  , "user" :  infos.who})
                            }

                    }, time)
                }
                else error = 1 ;
            }
            else error = 1 ;

        }
        catch
        {
            error = 1 ;
        }
        if(error)
            client.emit("roomsOfUser", {"status" : false , "action" : "" , "message" : `failed to ban ${infos.who}` , "user" : user })
    }



    @SubscribeMessage('kick')
    @UsePipes(WSValidationPipe)
    async kick_user(client: Socket, infos: dto_kick){
        const  user = client.data.from;
        const  room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0 ;
        try 
        {
            if( typeof check  !== "undefined" &&  check.user_id === user && check.room_id === room && (check.user_role === "owner" || check.user_role === "admin" ))
            {
                if(await this.chatroomservice.ban_mute_user_in_room(room , infos.who,"kicked", check.current_role))
                {
                
                    client.emit("roomsOfUser" , {"status" : true ,"action" : "leave" ,  "message" : `${infos.who}  kicked successfully` , "user" :  user});
               
                    for (let [key, value] of this.myMap) 
                    {
                        if (value.user_id === infos.who && value.room_id === room) 
                        {
                            this.server.sockets.sockets.get(key).leave(room);
                        }
                    }
                    for (let [key, value] of this.myMap)
                    {
                        if(value.user_id === infos.who)
                            this.server.sockets.sockets.get(key).emit("disableWriting",{"status" : false, "message" : `kicked in ${room}`  , "user" :  infos.who})
                    }

                  
                }
                else error = 1 ;
            }
            else error = 1 ;
        }
        catch
        {
            error = 1 ;
        }
        if(error)
            client.emit("roomsOfUser", {"status" : false , "action" : "" , "message" : `failed to kick ${infos.who}` , "user" : user })
    }

    @SubscribeMessage('SendMessageRoom')
    @UsePipes(WSValidationPipe)
    async Send_message(client: Socket, msg: dto_msg){
        const  user = client.data.from;
        const  room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0;
        try
        {
            if(typeof check !== "undefined" && check.user_id === user && check.room_id === room )
            {
                if (await this.chatroomservice.add_msg_room(user, room, msg)) /* send avatar in message */
                {
                  //  console.log("room : " , room );
                    this.server.to(room).emit("msgToClient" ,{ "from" : user , "msg" : msg.msg , "avatar" : msg.avatar });
                }
            }
        }
        // add state in room 
        catch(exception)
        {
            
        }
    }

    @SubscribeMessage("close")
    async close(client : Socket)
    {
       this.handleDisconnect(client);
    }
    async handleDisconnect(client: Socket) {
    
    	this.logger.log(`Client disconnected: ${client.id}`);
		this.myMap.delete(client.id);
    }
  
    async handleConnection(client: Socket) {
        
    	this.logger.log(`Client connected : ${client.id}`);
        client.data.from = client.handshake.auth.from ;

    }
  }


  /* front - fix */
  // disconnect socket 
  // leave + join + fetch