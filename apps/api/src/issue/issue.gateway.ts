import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Issue } from '@prisma/client';
import { Server } from 'socket.io';
import { getAllowedOrigins } from '../config/cors';

@WebSocketGateway({
  cors: {
    origin: getAllowedOrigins(),
  },
})
export class IssueGateway {
  @WebSocketServer()
  server!: Server;

  emitCreated(issue: Issue) {
    this.server.emit('issue.created', issue);
  }

  emitUpdated(issue: Issue) {
    this.server.emit('issue.updated', issue);
  }

  emitDeleted(payload: { id: string }) {
    this.server.emit('issue.deleted', payload);
  }
}
