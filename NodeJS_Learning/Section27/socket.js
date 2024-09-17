let io;

module.exports = {
    init: (httpServer, corsOptions) => {
        io = require(`socket.io`)(httpServer, {
            cors: corsOptions
        });
        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error(`Socket.io not initialized!`);
        }
        return io;
    }
}