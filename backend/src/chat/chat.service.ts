import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private jwt: JwtService,) { }

  // async getUserIdByToken(token: string) {
  //   try {
  //     const payload = await this.jwt.verifyAsync(
  //       token,
  //       {
  //         secret: 'secret'
  //       }
  //     );
  //     return payload.sub;
  //   }
  //   catch (e) {
  //     console.log(e);
  //     throw new UnauthorizedException();
  //   }
  // }

  async create(createChatDto: CreateChatDto) {
    const message = { ...createChatDto };
    // console.log( createChatDto );
    await this.prisma.message.create({
      data: {
        userId: createChatDto.id,
        msg: createChatDto.msg,
        rid: createChatDto.rid,
      }
    });
    return message;
  }

  findAll() {
    return this.prisma.message.findMany();
  }

  joinRoom(payload: any, client: any) {
    client.join(payload.rid);
    // client.emit('joined', payload);
    client.to(payload.rid).emit('joined', payload);
    return "Hello world";
  }


  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }
}