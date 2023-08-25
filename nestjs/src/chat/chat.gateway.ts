import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server


  constructor(private readonly chatService: ChatService) { }

  @SubscribeMessage('createChat')
  async create(@MessageBody() createChatDto: CreateChatDto) {
    const message = await this.chatService.create(createChatDto);

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }


  @SubscribeMessage('join')
  joinRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {

  }
  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
