import { Body, Controller, Req, Post, UseFilters, UseGuards, UseInterceptors, Get} from '@nestjs/common';
import { createRoomDto, dm_room, dto_block, dto_changePass, room_name } from './dto/create-room.dto';
import { GetRoomsInterceptor } from './interceptors/get_rooms.interceptor';
import { DataRoomInterceptor } from './interceptors/data_room.interceptor';
import { RoomService } from './room.service';
import { TransformInterceptor } from './interceptors/get_users_room.interceptor';
import { IntraJwtGuard } from 'src/auth/guards/intra_jwt.guard';
import { HttpExceptionFilter } from 'src/auth/filters/http-exception.filter';
import { FriendsUser } from './interceptors/friends_user.interceptor';
import { InstantMsg } from './interceptors/instant_msg.interceptor';
import { msgInterceptor } from './interceptors/msg.interceptor';

@UseGuards(IntraJwtGuard)
@UseFilters(HttpExceptionFilter)
@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService){}

    @Post('/postroom')
    async post_room(@Req() req, @Body() createroomdto: createRoomDto){
        //console.log(createroomdto);
        // console.log("User**********", req.user);
        return await this.roomService.create_post_room(createroomdto, req.user);
    }

    @UseInterceptors(GetRoomsInterceptor)
    @Get('/All_rooms_of_user')
    async get_rooms(@Req() req)
    {
      // console.log("req.user : "  , req.user);
        return  await this.roomService.get_rooms(req.user);
    }

    @UseInterceptors(DataRoomInterceptor)
    @Get('/public_room')
    async get_public_room(@Req() req){
   //     console.log("req.user : "  , req.user);        
        return  await this.roomService.get_public_room(req.user);
    }

    @UseInterceptors(DataRoomInterceptor)
    @Get('/protected_room')
    async get_protected_room(@Req() req){
        return await this.roomService.get_protected_room(req.user);
    }

    @Post('/get_room_msgs')
    @UseInterceptors(msgInterceptor)
    async post_name_room(@Req() req, @Body() room_id: room_name){
        return await this.roomService.get_room_msgs(room_id, req.user);
    }

    @Post('/post_name_room_dm')
    async post_name_room_dm(@Req() req, @Body() name: dm_room){
        return await this.roomService.post_name_dm(name, req.user);
    }

    @Post('/usersRoom')
    @UseInterceptors(TransformInterceptor)
    async getAllUsersOfRoom(@Req() req, @Body() infos : room_name)
    {
        return await this.roomService.getAllUsersOfRoom(infos, req.user);
    }

    // @Post('/removepass')
    // removepass(@Req() req, @Body() infos : room_name)
    // {
    //     return this.roomService.removePassword(infos, req.user);
    // }

    // @Post('/changepass')
    // changepass(@Body() infos: dto_changePass)
    // {
    //     return this.roomService.changePassword(infos);
    // }

    @UseInterceptors(FriendsUser)
    @Get('/get_friends')
    get_friends(@Req() req)
    {
        return this.roomService.get_friends(req.user);
    }

    @Post('/block_user')
    block_user(@Req() req, @Body() infos: dto_block)
    {
        return this.roomService.block_user(infos, req.user);
    }

    @UseInterceptors(InstantMsg)
    @Get('/instant_messaging')
    instant_messaging(@Req() req, to: dm_room)
    {
        return this.roomService.instant_messaging(req.user, to);
    }
}
