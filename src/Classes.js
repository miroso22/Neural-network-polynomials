'use strict';

const activationFunc = x => x;
const derivActivationFunc = x => 1;

// const activationFunc = x => 1 / (1 + Math.exp(-x));
// const derivActivationFunc = x => Math.exp(-x) / Math.pow(1 + Math.exp(-x), 2);

// const activationFunc = x => 2 / (1 + Math.exp(-3 * x)) - 1;
// const derivActivationFunc = x => 6 * Math.exp(-3 * x) / Math.pow(Math.exp(-3 * x) + 1, 2);

class Neuron {
  constructor(nOfWeights) {
    this.weights = [];
    this.mistakeKoef = 0;
    for (let i = 0; i < nOfWeights; i++) {
      this.weights[i] = Math.random() - .5;
    }
    this.bias = Math.random() - .5;
  }

  calcValue(inputs) {
    let result = 0;
    for (let i = 0; i < inputs.length; i++) {
      result += this.weights[i] * inputs[i];
    }
    result += this.bias;
    this.mistakeKoef = derivActivationFunc(result);
    return activationFunc(result);
  }

  display() {
    console.log('    Weights:'.green);
    for (const w of this.weights) {
      console.log(`      ${w}`.yellow);
    }
    console.log('    Bias:'.green);
    console.log(`      ${this.bias}`.yellow);
  }
}

//------------------------------------------------------------------------------

class NeuronLayer {
  constructor(numberOfNeurons, prevLayer) {
    this.neurons = [];
    this.values = [];
    const nOfWeights = prevLayer ? prevLayer.neurons.length : 0;
    for (let i = 0; i < numberOfNeurons; i++) {
      this.neurons.push(new Neuron(nOfWeights));
    }
    this.prevLayer = prevLayer;
  }

  calcValues() {
    const neurons = this.neurons;
    const inputs = this.prevLayer.values;
    for (let i = 0; i < neurons.length; i++) {
      this.values[i] = neurons[i].calcValue(inputs);
    }
  }

  changeWeights(mistake) {
    const prevLayer = this.prevLayer;
    if (!prevLayer) return;

    const neurons = this.neurons;
    let sumOfMistakes = 0;
    let j = 0;
    for (const n of neurons) {
      const curNeuronMistake = mistake[0] ? mistake[j++] * n.mistakeKoef :
                                            mistake * n.mistakeKoef;
      sumOfMistakes += curNeuronMistake;
      for (let i = 0; i < n.weights.length; i++) {
        n.weights[i] += curNeuronMistake * prevLayer.values[i];
      }
      n.bias += curNeuronMistake;
    }
    prevLayer.changeWeights(sumOfMistakes);
  }

  display() {
    for (let i = 0; i < this.neurons.length; i++) {
      console.log(`  Neuron ${i + 1}:`.green);
      this.neurons[i].display();
    }
  }
}

//------------------------------------------------------------------------------

class NeuralNetwork {
  constructor(...neuronsInLayer) {
    this.inputLayer = new NeuronLayer(neuronsInLayer[0], undefined);
    this.layers = [this.inputLayer];
    for (let i = 1; i < neuronsInLayer.length; i++) {
      this.layers.push(new NeuronLayer(neuronsInLayer[i], this.layers[i - 1]));
    }
    this.outputLayer = this.layers[neuronsInLayer.length - 1];
  }

  calcValues(inputs) {
    const layers = this.layers;
    this.inputLayer.values = inputs;
    for (let i = 1; i < layers.length; i++) {
      layers[i].calcValues();
    }
    return this.outputLayer.values;
  }

  train(inputs, answers) {
    const results = this.calcValues(inputs);
    const mistakes = [];
    for (let i = 0; i < answers.length; i++) {
      mistakes[i] = answers[i] - results[i];
    }

    console.log('Inputs: '.green + `${inputs}`.yellow);
    console.log('Answers: '.green + `${answers}`.yellow + ', Results: '.green + `${results}`.yellow);
    console.log('Mistakes: '.green + `${mistakes}`.yellow);

    const layers = this.layers;
    layers[layers.length - 1].changeWeights(mistakes);

    return results;
  }

  trainOnDataset(data) {
    for (const example of data) {
      this.train(example[0], example[1]);
    }
  }

  display() {
    console.log('Input Layer:'.green);
    console.log(`  Neurons: ${this.inputLayer.neurons.length}`.yellow);
    for (let i = 1; i < this.layers.length - 1; i++) {
      console.log(`Hidden Layer ${i}:`.green);
      this.layers[i].display();
    }
    console.log('Output Layer:'.green);
    this.outputLayer.display();
  }
}

//------------------------------------------------------------------------------

module.exports = {
  NeuralNetwork
};
