import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { endWith } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { createRoomDto, dm_room, dto_block, dto_changePass, room_name } from './dto/create-room.dto';

@Injectable()
export class RoomService {
   constructor(private prisma: PrismaService){}

	async create_post_room(createRoomDto: createRoomDto, current_user: any){
		const hash = await argon.hash(createRoomDto.password);
		const name = createRoomDto.name;
		const userCount = await this.prisma.user.count(
            {
                where: {
                    login: current_user
                }
            }
        )
		const identif = await this.prisma.room.count(
			{
				where: {
					name: createRoomDto.name,
					owner: current_user
				}
			}
		)
		if (userCount == 1 && identif == 0)
		{
			const newroom = {
				name: createRoomDto.name,
				type: createRoomDto.type,
				password: hash,
				owner: current_user,
				users_room : {
					create: {
						user_id : current_user,
						user_role: 'owner',
						state_user: '',
					}
				}
			}
			const new_user_room = await this.prisma.room.create({data: newroom});
			return (new_user_room);
		
		}
		else {
			return new HttpException('Already exist', HttpStatus.FOUND);
		}
	}

	async get_rooms(current_user)
    {
		console.log(current_user);
        const getrooms = await this.prisma.users_room.findMany({ 
            where:
            {
                user_id: current_user,
				NOT:{
					state_user: {
						contains: 'kicked',
					}
				},
				room:{
					OR: [
						{
							type: 'public'
						},
						{
							type: 'protected'
						},
						{
							type: 'private'
						},
					]
				}
            },
            select:{
				id: true,
                user_role: true,
                room_id: true,
                room: {
                    select: {
                        type: true,
                    }
                },
            },
            orderBy: {
                user_role: 'asc',
            },
        })
        return (getrooms);
    }

	async get_public_room(current_user){
		const getinfo = await this.prisma.room.findMany({
			where: {
				type: 'public',
			},
			select: {
				users_room:{
					where:{
						user_id: current_user,
						NOT:{
							state_user: {
								contains: 'banned',
							}
						}
					},
					select:
					{
						id: false,
						user_role: true,
						room_id: false,
						state_user: false,
					}
				},
				_count: {
					select:{
						users_room: true,
					}
				},
				id: true,
				name : true,
				owner: true,
				type : false,
				password : false,
			},
		})

		//console.log(getinfo);
		return (getinfo);
	}

	async get_protected_room(current_user){
		const getinfo = await this.prisma.room.findMany({
			where: {
				type: 'protected',
			},
			select: {
				users_room:{
					where:{
						user_id: current_user,
						NOT:{
							state_user: {
								contains: 'banned',
							}
						}
					},
					select:
					{
						id: false,
						user_role: true,
						room_id: false,
						state_user: false,
					}
				},
				_count: {
					select:{
						users_room: true,
					}
				},
				id: true,
				name : true,
				owner: true,
				type : false,
				password : false,
			},
		})

		console.log(getinfo);
		return (getinfo);
	}

	async get_room_msgs(name: room_name, current_user)
	{
		let arr = [];
		const friends = await this.prisma.friendship.findMany({
			where:{
				id_user_1: current_user,
				stat_block: true,
			},
			select:{
				id_user_2: true,
			}
		}).then((value) =>{
			for(let i = 0; i < value.length; i++)
			{
				arr[i] = value[i].id_user_2; 
			}
		})
		const msgs = await this.prisma.messageRoom.findMany({
			where: { room_name: name.room_id, 
				from:{
					notIn: arr,
				}
			},
			select:
			{
				from: true,
				content_msg: true,
				room_name: false,
				id: false,
				creationDate: false
			},
			orderBy : {
				creationDate :'asc'
			}
		});
		return (msgs);
	}

	async post_name_dm(name: dm_room, current_user){
		const msgs = await this.prisma.directMessage.findMany({
			where: { 
				OR: [
					{
						from: current_user, to: name.to,
					},
					{
						from: name.to, to: current_user
					},
				  ]
			},
			select:
			{
				from: true,
				to: true,
				content_msg: true,
				id: false,
				creationDate: false
			}
			
		});
		return (msgs);
	}

	async getAllUsersOfRoom(infos : room_name, current_user)
	{ 
		let arr = [];
		const friends = await this.prisma.friendship.findMany({
			where:{
				id_user_1: current_user,// current 
				stat_block: true,
			},
			select:{
				id_user_2: true,
			}
		}).then((value) =>{
			for(let i = 0; i < value.length; i++)
			{
				arr[i] = value[i].id_user_2; 
			}
		})
	  	return await this.prisma.users_room.findMany({
			orderBy: {
				 user_role: 'asc',
			},
			where : {
				room_id :  infos.room_id,
				user_id :{
					notIn : arr,
					not: current_user,
				}
			},
			select :{
				user_role : true,
				user : {
					select :{
					  id : true,
					  avatar : true,
					  login: true,
					  username: true,
					}
			  }
			},
			
		})    
  }

//   async removePassword(infos : room_name, current_user)
//   {
// 	  const data = await  this.prisma.room.findFirst({
// 		  where : {
// 			  name : infos.room_id,
// 			  type : "protected",
// 		  }
// 	  });
// 	  if(data)
// 		  return await  this.prisma.room.update({
// 		  where :{
// 			name :  infos.room_id,
// 		  },
// 		  data :{
// 			type : "public",
// 			password : ""
// 		  }
// 		});
// 	  return null;
//   }

//   async changePassword(infos : dto_changePass)//must check if current is owner
//   {
// 	  const data = await  this.prisma.room.findFirst({
// 		  where : {
// 			  name : infos.room_id,
// 			  type : "protected",
// 		  }
// 	  });
// 	  if(data)
// 	  {
// 		  const new_password = await argon.hash(infos.password);
// 		  return await  this.prisma.room.update({
// 		  where :{
// 			name :  infos.room_id,
// 		  },
// 		  data :{
// 			password : new_password
// 		  }
// 		});
// 	  }
// 	  return null;
//   }

  async block_user(infos: dto_block, current_user)
  {
   const check = await this.prisma.friendship.findFirst({
	 where :{
	   id_user_1 : current_user,//current
	   id_user_2 : 'sbarka',//infos.user_to_block
	   //type: 'user',
	 }
   });
   if(!check)
   {
	await this.prisma.friendship.create({
	   data : {
		 id_user_1 : current_user ,
		 id_user_2 : 'sbarka',//infos.user_to_block
		 stat_block : true,
		 type : "user"
	   }
	 })
   }
   	await this.prisma.friendship.update({
	 where:{
	   id : check.id,
	 },
	 data : {
	   stat_block : true
	 }
   })
  }

  async get_friends(current_user){
   const friends = await this.prisma.friendship.findMany({
	where:{
		stat_block: false,
		type: 'friend',
		id_user_1: current_user,
	},
	select:{
		id: true,
		user2:{
			select:{
				login: true,
				username: true,
				avatar: true,
			}
		}
	},

   })
   return (friends);
  }
  
//   async blocked_friend(current_user){
	
//   }

  async instant_messaging(current_user, to: dm_room){
	let arr = [];
	const friends = await this.prisma.friendship.findMany({
		where:{
			id_user_1: current_user,// current 
			stat_block: true,
		},
		select:{
			id_user_2: true,
		}
	}).then((value) =>{
		for(let i = 0; i < value.length; i++)
		{
			arr[i] = value[i].id_user_2; 
		}
	})
	const room_user = await this.prisma.room.findMany({
		where:{
			type: 'dm',
			name:{
				contains: current_user + '+',
			}
			},
		select:{
			//id: true,//room
			user:{
				select:{
					friend:{
						where:{
							id_user_1: current_user,
							id_user_2:{
								notIn: arr,
							},
						},
						select:{
							type: true,
						}
					},
					id: true,
					login: true,
					username: true,
					avatar: true,
				}
			}
		}
	})
	return (room_user);
  }

}
