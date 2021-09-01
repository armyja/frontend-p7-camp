import Fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "fastify-static";
import socketioServer from "fastify-socket.io";
import fastifyCors from "fastify-cors";
import path = require("path");
import * as RTCMultiConnectionServer from "rtcmulticonnection-server";

const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
const getValuesFromConfigJson =
  RTCMultiConnectionServer.getValuesFromConfigJson;
const getBashParameters = RTCMultiConnectionServer.getBashParameters;
const resolveURL = RTCMultiConnectionServer.resolveURL;
const config = {
  socketURL: "/",
  dirPath: "",
  homePage: "/demos/index.html",
  socketMessageEvent: "RTCMultiConnection-Message",
  socketCustomEvent: "RTCMultiConnection-Custom-Message",
  port: "9001",
  enableLogs: "false",
  autoRebootServerOnFailure: "false",
  isUseHTTPs: "false",
  sslKey: "./fake-keys/privatekey.pem",
  sslCert: "./fake-keys/certificate.pem",
  sslCabundle: "",
  enableAdmin: "true",
  adminUserName: "username",
  adminPassword: "password",
};

const fastify: FastifyInstance = Fastify({
  logger: true,
});

// first plugin
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

// second plugin
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "node_modules"),
  prefix: "/node_modules/",
  decorateReply: false, // the reply decorator has been added by the first plugin registration
});

fastify.register(fastifyCors, {
  origin: true
});

fastify.register(socketioServer, {});

fastify.ready((err) => {
  if (err) throw err;

  fastify.io.on("connection", (socket) =>
    console.info("Socket connected!", socket.id)
  );

  fastify.io.on("connection", function (socket) {
    RTCMultiConnectionServer.addSocket(socket, config);
    socket.on('disconnect', function() {
      console.info('Got disconnect!', socket.id);

   });

    const params = socket.handshake.query;

    if (!params.socketCustomEvent) {
      params.socketCustomEvent = "custom-message";
    }

    socket.on(params.socketCustomEvent as string, function (message) {
      socket.broadcast.emit(params.socketCustomEvent as string, message);
    });
  });
});

fastify.listen(4000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
