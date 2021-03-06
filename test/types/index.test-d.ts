import * as wsPlugin from '../..';
import fastify, { WebsocketHandler, FastifyRequest, FastifyInstance, RequestGenericInterface, FastifyReply } from 'fastify';
import { expectType } from 'tsd';
import { Server as HttpServer, IncomingMessage } from 'http'
import { Server } from 'ws';

const app: FastifyInstance = fastify();
app.register(wsPlugin);
app.register(wsPlugin, {});
app.register(wsPlugin, { options: { maxPayload: 123 } });
app.register(wsPlugin, {
  handle: function globalHandler(connection: wsPlugin.SocketStream): void {
    expectType<FastifyInstance>(this);
    expectType<wsPlugin.SocketStream>(connection)
  }
});
app.register(wsPlugin, { options: { perMessageDeflate: true } });

app.get('/websockets-via-inferrence', { websocket: true }, async function(connection, req, params) {
  expectType<FastifyInstance>(this);
  expectType<wsPlugin.SocketStream>(connection);
  expectType<Server>(app.websocketServer);
  expectType<IncomingMessage>(req)
  expectType<{ [key: string]: any } | undefined>(params);
});

const handler: WebsocketHandler = async (connection, req, params) => {
  expectType<wsPlugin.SocketStream>(connection);
  expectType<Server>(app.websocketServer);
  expectType<IncomingMessage>(req)
  expectType<{ [key: string]: any } | undefined>(params);
}

app.get('/websockets-via-annotated-const', { websocket: true }, handler);

app.get('/not-specifed', async (request, reply) => {
  expectType<FastifyRequest>(request);
  expectType<FastifyReply>(reply)
});

app.get('/not-websockets', { websocket: false }, async (request, reply) => {
  expectType<FastifyRequest>(request);
  expectType<FastifyReply>(reply);
});
