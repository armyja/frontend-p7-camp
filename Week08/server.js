"use strict";
exports.__esModule = true;
var fastify_1 = require("fastify");
var fastify_static_1 = require("fastify-static");
var fastify_socket_io_1 = require("fastify-socket.io");
var fastify_cors_1 = require("fastify-cors");
var path = require("path");
var RTCMultiConnectionServer = require("rtcmulticonnection-server");
var BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
var getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
var getBashParameters = RTCMultiConnectionServer.getBashParameters;
var resolveURL = RTCMultiConnectionServer.resolveURL;
var config = {
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
    adminPassword: "password"
};
var fastify = (0, fastify_1["default"])({
    logger: true
});
// first plugin
fastify.register(fastify_static_1["default"], {
    root: path.join(__dirname, "public")
});
// second plugin
fastify.register(fastify_static_1["default"], {
    root: path.join(__dirname, "node_modules"),
    prefix: "/node_modules/",
    decorateReply: false
});
fastify.register(fastify_cors_1["default"], {
    origin: true
});
fastify.register(fastify_socket_io_1["default"], {});
fastify.ready(function (err) {
    if (err)
        throw err;
    fastify.io.on("connection", function (socket) {
        return console.info("Socket connected!", socket.id);
    });
    fastify.io.on("connection", function (socket) {
        RTCMultiConnectionServer.addSocket(socket, config);
        socket.on('disconnect', function () {
            console.info('Got disconnect!', socket.id);
        });
        var params = socket.handshake.query;
        if (!params.socketCustomEvent) {
            params.socketCustomEvent = "custom-message";
        }
        socket.on(params.socketCustomEvent, function (message) {
            socket.broadcast.emit(params.socketCustomEvent, message);
        });
    });
});
fastify.listen(4000, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info("server listening on " + address);
});
