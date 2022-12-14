import { ApiProperty } from "@nestjs/swagger";
import { IsInt, isInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class createRoomDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({required:true,description:"this input used  to add  room name"})
    name: string;
    @ApiProperty({required:true,description:"this input used  to add  room type if it's private, protected or public"})
    @IsString()
    type: string;
    @IsString()
    @ApiProperty({required:true,description:"this input used  to add password room of the protected rooms"})
    password: string;
}

export class room_name{
    @IsString()
    @IsNotEmpty()
    room_id: string;
}

export class dm_room{
    @IsString()
    to: string;
}

export class dto_msg{
    @IsNotEmpty()
    @IsString()
    msg: string;

    @IsString()
    avatar : string;

}
//----DOne
export class dto_user_room{
    @IsString()
    @IsNotEmpty()
    from: string;
    @IsString()
    @IsNotEmpty()
    to: string;//room_name
    @IsString()
    msg: string;
}
//----DOne
export class dto_global{
    @IsString()
    @IsNotEmpty()
    from: string;//current_user
    @IsString()
    @IsNotEmpty()
    to: string;//room_name
}

//---- Done


export class dto_invite {
    @IsString()
    @IsNotEmpty()
    user_to_invite : string
}

//--- Done


export class dto_block {
    @IsString()
    @IsNotEmpty()
    user_to_block : string

    @IsString()
    @IsNotEmpty()
    room_id: string 
}

export class dm_msg{
    @IsString()
    msg: string;
}





export class dto_admin {
    @IsString()
    @IsNotEmpty()
    new_admin : string
}

export class dto_ban_mute{
    @IsString()
    @IsNotEmpty()
    who: string;


    @IsNotEmpty()
    @IsNumber()
    time : number

    @IsNotEmpty()
    @IsString()
    type :string
}

export class dto_kick{
    @IsString()
    @IsNotEmpty()
    who: string;

}

export class dto_join_room {
    @IsString()
    @IsNotEmpty()
    room: string;
}
export class dto_changePass {

    @IsString()
    @IsNotEmpty()
    new_password: string;
}