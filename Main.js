'use strict';
const Classes = require('./Classes.js');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.close();


const nn = new Classes.NeuralNetwork(2, 5, 1);
console.log(13423423);

const data = [];
//
// for (let i = 0; i < 10; i++) {
//   rl.question(`${i}:`, input => {
//     const x = input.split(' ')[0];
//     const y = input.split(' ')[1];
//     data.push({x, y})
//     if (i == 9) {
//       console.log('finished!');
//       rl.close();
//     }
//   });
// }
