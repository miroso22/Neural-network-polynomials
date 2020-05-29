'use strict';

const activationFunc = x => x;
const derivActivationFunc = x => 1;

//const activationFunc = x => 2 / (1 + Math.exp(-3 * x)) - 1;
//const derivActivationFunc = x => 6 * Math.exp(-3 * x) / Math.pow(Math.exp(-3 * x) + 1, 2);

class Neuron {
  constructor(nOfWeights) {
    this.weights = [];
    this.mistakeKoef = 0;
    for (let i = 0; i < nOfWeights; i++) {
      this.weights[i] = Math.random() - 0.5;
    }
  }

  calcValue(inputs) {
    let result = 0;
    for (let i = 0; i < inputs.length; i++) {
      result += this.weights[i] * inputs[i];
    }
    this.mistakeKoef = derivActivationFunc(result);
    return activationFunc(result);
  }
}

//------------------------------------------------------------------------------

class NeuronLayer {
  constructor(numberOfNeurons, prevLayer) {
    this.neurons = [];
    this.values = [];
    const nOfWeights = prevLayer ? prevLayer.neurons.length : 0;
    for (let i = 0; i < numberOfNeurons; i++) {
      this.neurons.push(new Neuron(nOfWeights + 1)); // +1 for bias
    }
    this.prevLayer = prevLayer;
    this.bias = Math.random() - 0.5;
  }

  calcValues() {
    const neurons = this.neurons;
    const inputs = this.prevLayer.values;
    for (let i = 0; i < neurons.length; i++) {
      this.values[i] = neurons[i].calcValue(inputs);
    }
    this.values[neurons.length] = this.bias;
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
      for (let i = 0; i < n.weights.length - 1; i++) {
        n.weights[i] += curNeuronMistake * prevLayer.values[i];
      }
    }
    this.bias += sumOfMistakes;
    prevLayer.changeWeights(sumOfMistakes);
  }
}

//------------------------------------------------------------------------------

class NeuralNetwork {
  constructor(...neuronsInLayer) {
    this.layers = [];
    this.inputLayer = new NeuronLayer(neuronsInLayer[0], undefined);
    this.layers.push(new NeuronLayer(neuronsInLayer[1], this.inputLayer));
    for (let i = 2; i < neuronsInLayer.length; i++) {
      this.layers.push(new NeuronLayer(neuronsInLayer[i], this.layers[i - 2]));
    }
  }

  calcValues(inputs) {
    const layers = this.layers;
    this.inputLayer.values = inputs;
    for (let i = 0; i < layers.length; i++) {
      layers[i].calcValues();
    }
    return layers[layers.length - 1].values;
  }

  train(inputs, answers) {
    const results = this.calcValues(inputs);
    results.pop(); // popping bias
    const mistakes = [];
    for (let i = 0; i < answers.length; i++) {
      mistakes[i] = answers[i] - results[i];
    }
    console.log(`Input: ${inputs[0] * 100}`);
    console.log(`Answer: ${answers[0] * 100}, Result: ${results[0] * 100}`);
    console.log(`Mistake: ${mistakes[0] * 100}`);
    console.log();

    const layers = this.layers;
    layers[layers.length - 1].changeWeights(mistakes);

    return results;
  }
}

//------------------------------------------------------------------------------

module.exports = {
  NeuralNetwork
};
