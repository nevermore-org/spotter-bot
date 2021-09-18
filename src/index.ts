const http = require("http");

console.log("hello world!");

http.createServer(() => {
    console.log("hello world");
}).listen("8000");