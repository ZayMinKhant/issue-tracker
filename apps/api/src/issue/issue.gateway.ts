import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class IssueGateway {
  @WebSocketServer()
  server!: Server;

  emitCreated(issue: unknown) {
    this.server.emit('issue.created', issue);
  }

  emitUpdated(issue: unknown) {
    this.server.emit('issue.updated', issue);
  }

  emitDeleted(payload: { id: string }) {
    this.server.emit('issue.deleted', payload);
  }
}
