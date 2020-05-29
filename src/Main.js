'use strict';
const NeuralNetwork = require('./Classes.js').NeuralNetwork;
const process = require('process');
const getPolynom = require('./PolynomInput.js').getPolynom;
const readline = require('readline');

const nn = new NeuralNetwork(3, 1, 5, 1);
let consoleMode = 'c';
const COMMANDS = 'qtch';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const help = () => {
  console.log('Commands:');
  console.log('q - quit,');
  console.log('t - enter training example,');
  console.log('c - count value from input,');
  console.log('h - help,');
}
const invalInput = () => {
  console.log('Invalid input. Enter h for help');
}

const generateExamples = fn => {
  const data = [];
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 10;
    data[i] = [[x / 10], [fn(x) / 10]];
  }
  return data;
}
const train = data => {
  for (const example of data) {
    nn.train(example[0], example[1]);
  }
}

rl.on('line', input => {
  if (input.length === 1 && COMMANDS.indexOf(input) != -1) {
    switch (input) {
      case 'q':
        rl.close();
        break;
      case 'h':
        help();
        break;
      case 'c':
        consoleMode = 'c';
        console.log('Enter a value and neural network will count the result');
        break;
      case 't':
        consoleMode = 't';
        console.log('Enter a value and the right answer');
        break;
    }
  } else {
    let x;
    let y;
    switch (consoleMode) {
      case 'c':
        x = parseInt(input) / 10;
        if (!isNaN(x)) console.log('Result: ' + Math.round(nn.calcValues([x])[0]) * 10);
        else invalInput();
        break;
      case 't':
        x = parseInt(input.split(' ')[0]) / 10;
        y = parseInt(input.split(' ')[1]) / 10;
        if (!isNaN(x) && !isNaN(y)) {
          nn.train([x], [y]);
        } else invalInput();
        break;
    }
  }
});

help();
