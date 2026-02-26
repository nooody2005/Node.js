const fs=require('fs');
const http = require('http');
const url = require('url');


//==============================================================================================================================
                                                        //SERVER && URL
//==============================================================================================================================
const tempOverview =fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempProduct =fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const tempCard =fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');

const data =fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req,res) => {
    console.log(req);
    const pathName = req.url;

    //overview Page
    if(pathName === "/" || pathName === "/overview"){
        res.end("this is overveiw");
    }

    //Product Page
    else if (pathName === "/product"){
        res.end("this is product");
    }

    //Api page
    else if (pathName === "/api"){
        res.writeHead(200, {'Content-type' : 'application/json'});
        res.end(data);  
    }

    //Not found
    else{
        res.writeHead(404 , {
            'content-type' : 'text/html' ,
            'my-own-header' : 'hello world'
        });
        res.end("<h1>Page not found :)</h1>");
    }
});

server.listen(8000,'127.0.0.1',() => {
    console.log("Listening to requestes on port 8000");
});
//===============================================================================================================================
//===============================================================================================================================





//==============================================================================================================================
                                                            //FILES
//==============================================================================================================================
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the Avocado : ${textIn} \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written');

// reading Asynchronous
// fs.readFile('./txt/start.txt','utf-8',(error,data1) => {
//     if(error) console.log("errooooooooooooor :(");
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(error,data2) =>{
//         console.log(data2);
//         console.log("===============================================================");
//         fs.readFile(`./txt/append.txt`,'utf-8',(error,data3) =>{
//             console.log(data3);
//              console.log("===============================================================");
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',error => {
//                 console.log("your final file has been written :)");
//                 console.log("===============================================================");
//             });
//         });
//     });
//     console.log("===============================================================");
//     console.log(data1);
//     console.log("===============================================================");
// });

//============================================================================================================================
//============================================================================================================================