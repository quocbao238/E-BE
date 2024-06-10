const { server } = require("./server");

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server is closed");
  });
});
