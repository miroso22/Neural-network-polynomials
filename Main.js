'use strict';
const Classes = require('./Classes.js');
const NUMBER_OF_EXAMPLES = 5;

const readline = require('readline');
const data = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on('line', input => {
  const x = parseInt(input.split(' ')[0]);
  const y = parseInt(input.split(' ')[1]);
  if (!isNaN(x) && !isNaN(y)) data.push({ x, y });
  else console.log('Invalid input');
  if (data.length === NUMBER_OF_EXAMPLES) rl.close();
});

const nn = new Classes.NeuralNetwork(2, 1, 5, 1);
nn.calcValues([2]);
console.log(`Write ${NUMBER_OF_EXAMPLES} examples`);
