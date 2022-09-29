import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { dto_msg } from '../dto/create-room.dto';

@Injectable()
export class DmService {
    constructor(private prisma: PrismaService){}

    async check_create_room_dm(from: string, to: string){
        const dm_name = await this.prisma.room.count({
            where:{
                OR: [
                    {
                    name: from + '+' + to + '+',
                    },
                    {
                    name: to + '+' + from + '+',
                    },
                ]
            }
        })
        if (dm_name == 1){
            const get_name = await this.prisma.room.findFirst({
                where:{
                    OR: [
                    {
                        name: from + '+' + to + '+',
                    },
                    {
                        name: to + '+' + from + '+',
                    },
                    ]
                },
                select:{
                    name: true,
                }
            })
            return(get_name.name);
        }
        else if (dm_name == 0){
            const add_dm_room = await this.prisma.room.create({
              data: {
                name: from + '+' + to + '+', type: 'dm', password: '', owner: to,
              }
                
            })
            return(add_dm_room.name);
        }
    }

    async find_dm_room_name(from: string, to: string){
        const get_name = await this.prisma.room.findFirst({
            where:{
              OR: [
                {
                  name: from + '+' + to + '+',
                },
                {
                  name: to + '+' + from + '+',
                },
              ]
            },
            select:{
              name: true,
            }
          })
          return (get_name);
    }

    async create_msg(from: string, to: string, msg: dto_msg){
        const newmsg = await this.prisma.directMessage.create({
            data:
              {creationDate: new Date(), from: from, to: to, content_msg: msg.msg},
            }); 
        return (newmsg);    
    }
}
