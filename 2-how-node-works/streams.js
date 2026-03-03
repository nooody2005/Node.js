// const { error } = require('console');
const { error } = require('console');
const fs = require('fs');
const server = require('http').createServer();

server.on("request" ,(req,res)=> {
    //solution 1
    // fs.readFile("test-file.txt", (error, data) => {
    //     if (error) console.log(error);
    //     res.end(data);
    // });

    //solution 2 : streams
    // const readable = fs.createReadStream("test-file.txt");
    // readable.on("data" ,chunk => {
    //     res.write(chunk);
    // });
    // readable.on("end" ,() => {
    //     res.end();
    // });
    // readable.on("error", error => {
    //     console.log(error);
    //     res.statusCode = 500;
    //     res.end("File not found");
    // });

    //solution 3 : pipe 
    const readable = fs.createReadStream("test-file.txt");
    readable.pipe(res);
    //readableSource.pipe(writableDest)
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening ....");
});