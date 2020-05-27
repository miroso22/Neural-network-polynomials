'use strict';
const NeuralNetwork = require('./Classes.js').NeuralNetwork;
const process = require('process');
const NUMBER_OF_EXAMPLES = 5;

const nn = new NeuralNetwork(3, 1, 5, 1);

const learningProcess = data => {
  for (const example of data) {
    nn.train([example.x], [example.y]);
  }
};

const readline = require('readline');
const data = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on('line', input => {
  if (input === 'q') rl.close();
  const x = parseInt(input.split(' ')[0]) / 100;
  const y = parseInt(input.split(' ')[1]) / 100;
  if (!isNaN(x) && !isNaN(y)) {
    if (data.length >= NUMBER_OF_EXAMPLES) {
      if (data.length === NUMBER_OF_EXAMPLES) learningProcess(data);
      console.log('Expected: ' + Math.floor(nn.train([x], [y]) * 10));
    }
    data.push({ x, y });
  } else console.log('Invalid input');
});

console.log(`Write ${NUMBER_OF_EXAMPLES} examples`);
