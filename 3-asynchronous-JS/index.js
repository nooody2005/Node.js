const { error } = require("console");
const fs = require("fs");
const { get } = require("http");
const superagent = require("superagent");
const { all } = require("superagent/lib/request-base");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (error, data) => {
      if (error) reject("I couldn't open the file :(");

      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (error) => {
      if (error) reject("I couldn't open the file :(");
      resolve("success");
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1 =  superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`,
    );

    const res2 =  superagent.get(
        `https://dog.ceo/api/breed/${data}/images/random`,
    );

    const res3 =  superagent.get(
        `https://dog.ceo/api/breed/${data}/images/random`,
    );
    const all = await Promise.all([res1,res2,res3]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);
    // console.log(res.body.message);

    await writeFilePro("dog-img.txt", imgs.join('\n'));
    // await writeFilePro("dog-img.txt", res.body.message);
    console.log("Random go image saved in the file :)");
  } catch (error) {
    console.log(error.message);
    throw (error);
  }
  return '2:Ready';
};
(async() => {
    try{
        console.log("1:will get dog pics!");
        const n = await getDogPic();
        console.log(n);
        console.log("3:Done getting dog pics");

    }catch(error){
        console.log(error);
    }
})()

/*console.log("1:will get dog pics!");
getDogPic().then(n => {
    console.log(n);
    console.log('3:Done getting dog pics');
}).catch(error => console.log(error));*/

/*readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    // if(error) return console.log(error.message);
    console.log(res.body.message);

    return writeFilePro("dog-img.txt", res.body.message);
  })
  .then(() => {
    console.log("Random go image saved in the file :)");
  })
  .catch((error) => console.log(error.message));
*/

// fs.readFile(`${__dirname}/dog.txt`,(error,data)=> {
//     console.log(`Breed: ${data}`);

//     superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).then((res) => {
//         // if(error) return console.log(error.message);
//         console.log(res.body.message);

//         fs.writeFile("dog-img.txt", res.body.message, (error) => {
//             if (error) return console.log(error.message);

//             console.log("Random go image saved in the file :)");
//         });
//     }).catch(error => console.log(error.message));

// });
