'use strict';

//-------------------------- Variables -----------------------------------------

const NeuralNetwork = require('./Classes.js').NeuralNetwork;
const process = require('process');
const getPolynom = require('./PolynomInput.js').getPolynom;
const readline = require('readline');
const colors = require('colors');

const nn = new NeuralNetwork(1, 1);
let consoleMode = 'c';
const COMMANDS = 'qdtcfh';
const NORM_KOEF = 100;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//--------------------------- Input functions ----------------------------------

const help = () => {
  console.log('Commands:'.green);
  console.log('q - quit'.yellow);
  console.log('d - display the structure of neural network'.yellow);
  console.log('t - enter a training example'.yellow);
  console.log('c - count value from input'.yellow);
  console.log('f - enter a function, generate 100 examples and train neural network with them'.yellow);
  console.log('h - help'.yellow);
}
const invalInput = () => console.log('Invalid input. Enter h for help'.red);

const generateExamples = fn => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 2 * NORM_KOEF - NORM_KOEF;
    data[i] = [[x / NORM_KOEF], [fn(x) / NORM_KOEF]];
  }
  return data;
}

//--------------------------- Main code ----------------------------------------

rl.on('line', input => {
  if (input.length === 1 && COMMANDS.indexOf(input) != -1) {
    switch (input) {
      case 'q':
        rl.close();
        break;
      case 'h':
        help();
        break;
      case 'd':
        nn.display();
        break;
      case 'c':
        consoleMode = 'c';
        console.log('Enter a value (a single number) and neural network will count the result'.green);
        break;
      case 't':
        consoleMode = 't';
        console.log('Enter a value and the right answer. Format: "x y"'.green);
        break;
      case 'f':
        consoleMode = 'f';
        console.log('Enter koefs near the powers of polynom'.green);
        console.log('For example, 5x^2-3 will be "5 0 -3"'.green);
        break;
    }
  } else {
    let x;
    let y;
    let fn;
    switch (consoleMode) {
      case 'c':
        x = parseInt(input) / NORM_KOEF;
        if (!isNaN(x)) {
          const answer = Math.round(nn.calcValues([x])[0] * NORM_KOEF);
          console.log('Result: '.cyan + `${answer}`.yellow);
        }
        else invalInput();
        break;
      case 't':
        x = parseInt(input.split(' ')[0]) / NORM_KOEF;
        y = parseInt(input.split(' ')[1]) / NORM_KOEF;
        if (!isNaN(x) && !isNaN(y)) {
          const answer = Math.round(nn.train([x], [y])[0] * NORM_KOEF);
          console.log('Expected answer: '.cyan + `${answer}`.yellow);
          console.log();
        } else invalInput();
        break;
      case 'f':
        fn = getPolynom(input);
        if (fn) {
          nn.trainOnDataset(generateExamples(fn));
          consoleMode = 'c';
        } else console.log('Invalid function input'.red);
        break;
    }
  }
});
console.log('This application was created to show you an example of Neural Network learning'.yellow);
console.log('Come up with some polynom, enter the exapmles of input-output pairs \n'.yellow +
            'and neural network will try to guess your formula and give you correct answers'.yellow);
help();
