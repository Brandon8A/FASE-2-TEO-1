import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class PublicacionGateway{

    @WebSocketServer()
    server?: Server;

    emitirLike(publicacionId: number, likes:number){
        this.server?.emit('likeActualizado', {
            id: publicacionId,
            likes: likes
        })
    }
}