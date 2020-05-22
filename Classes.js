'use strict';

const activationFunc = x => 1 / (1 + Math.exp(-x));
const derivActivationFunc = x => Math.exp(-x) / Math.pow(Math.exp(-x) + 1, 2);

class Neuron {
  constructor(nOfWeights) {
    this.weights = [];
    for (let i = 0; i < nOfWeights; i++) {
      this.weights[i] = Math.random() - 0.5;
    }
  }

  calcValue(inputs) {
    let result = 0;
    for (let i = 0; i < inputs.length; i++) {
      result += this.weights[i] * inputs[i];
    }
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
    const inputs = this.prevLayer.values;
    for (const n of this.neurons) {
      for (let i = 0; i < n.weights.length; i++) {
        n.weights[i] += mistake * 1;
      }
    }
  }
}

//------------------------------------------------------------------------------

class NeuralNetwork {
  constructor(numberOfLayers, numberOfInputs, ...neuronsInLayer) {
    this.layers = [];
    this.inputLayer = new NeuronLayer(numberOfInputs, undefined);
    this.layers.push(new NeuronLayer(neuronsInLayer[0], this.inputLayer));
    for (let i = 1; i < numberOfLayers; i++) {
      this.layers.push(new NeuronLayer(neuronsInLayer[i], this.layers[i - 1]));
    }
  }

  calcValues(inputs) {
    for (let i = 0; i < inputs.length; i++) {
      inputs[i] /= 100;
    }
    const layers = this.layers;
    this.inputLayer.values = inputs;
    for (let i = 0; i < layers.length; i++) {
      layers[i].calcValues();
    }
    return layers[layers.length - 1].values;
  }

  train(x, answer) {
    x /= 100;
    answer /= 100;
    const result = this.calcValues([x])[0];
    const mistake = answer - result;

    const layers = this.layers;
    layers[layers.length - 1].changeWeights(mistake);
  }
}

//------------------------------------------------------------------------------

module.exports = {
  NeuralNetwork
};
