import { Injectable } from '@nestjs/common';
import { Game, Player } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
  private room = {} as Game;

  create(id: string) {
    let r = new Game();
    this.room[id] = r;
  }

  addP(id: string, pl:Player, position:number){
    if (position === 0)
      this.getRoom(id).P1 = pl;
    else 
      this.getRoom(id).P2 = pl;
  }

  getSize(){
    return Object.keys(this.room).length;
  }

  getRoom(id:string) : Game{
    return this.room[id] || undefined;
  }

  getRooms() : Game{
    return this.room;
  }

  updatePlayerPos(id: string, player_id: string, up: boolean, down:boolean)
  {
    console.log(this.getRoom(id))
    // if (this.getRoomP1(id).id === player_id)
    // {
      // console.log(this.getRoom(id).P1);

      // if (up === true && this.getRoom(id).P1.y > 0)
      //   this.getRoom(id).P1.y -= 5;
      // if (down === false && this.getRoom(id).P1.y < 400)
      //   this.getRoom(id).P1.y += 5;
    // }
    // else
    // {
    //   console.log(this.getRoom(id).P2);
      // if (up === true && this.getRoom(id).P2.y > 0)
      //   this.getRoom(id).P2.y -= 5;
      // if (down === false && this.getRoom(id).P2.y < 400)
      //   this.getRoom(id).P2.y += 5;
    // }
  }
  getRoomP1(id:string){
    console.log(this.getRoom(id));
    // return this.getRoom(id).P1;
  }

  remove(id: string) {
    delete this.room[id];
  }
  
  // findOne(id: number) {
  //   return `This action returns a #${id} game`;
  // }

  // update(id: number, updateGameDto: UpdateGameDto) {
  //   return `This action updates a #${id} game`;
  // }
}
