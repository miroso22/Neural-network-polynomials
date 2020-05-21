'use strict';

class Neuron {
  constructor(prevLayer) {
    this.value = 0;
    this.weights = [];
    this.prevLayer = prevLayer;
    for (let i = 0; i < prevLayer.neurons.length; i++) {
      weights[i] = Math.random() - 0.5;
    }
  }

  actFunc(x) {
    return 1 / (1 + Math.exp(-x));
  }

  derivActFunc(x) {
    return Math.exp(-x) / Math.pow(Math.exp(-x) + 1, 2);
  }

  calcValue(inputs) {
    inputs = inputs | prevLayer.neurons;
    for (let i = 0; i < weights.length; i++) {
      this.value += weights[i] * inputs[i].value;
    }
    this.value = actFunc(this.value);
  }
}

class NeuronLayer {
  constructor(numberOfNeurons, prevLayer) {
    this.neurons = [];
    this.values = [];
    for (let i = 0; i < numberOfNeurons; i++) {
      this.neurons.push(new Neuron(prevLayer));
    }
    this.prevLayer = prevLayer;
    this.bias = Math.random() - 0.5;
  }

  calcValue(inputs) {
    inputs = inputs | prevLayer.values;
    for (let i = 0; i < neurons.length; i++) {
      values[i] = neurons[i].calcValue(inputs);
    }
  }
}

class NeuralNetwork {
  constructor(numberOfLayers, ...neuronsInLayer) {
    this.layers = [];
    for (let i = 0; i < numberOfLayers; i++) {
      this.layers.push(new NeuronLayer(neuronsInLayer[i], this.layers[i - 1]));
    }
  }

  calcValue(x) {

  }

  static getInput(x) {
    let res = [x];
    for (let i = 2; i < 6; i++) {
      res.push(Math.pow(x, i));
    }
    return res;
  }
}

module.exports = {
  NeuralNetwork
};
