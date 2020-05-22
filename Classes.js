'use strict';

class Neuron {
  constructor(nOfWeights) {
    this.weights = [];
    for (let i = 0; i < nOfWeights; i++) {
      this.weights[i] = Math.random() - 0.5;
    }
  }

  actFunc(x) {
    return 1 / (1 + Math.exp(-x));
  }
  derivActFunc(x) {
    return Math.exp(-x) / Math.pow(Math.exp(-x) + 1, 2);
  }

  calcValue(inputs) {
    let result = 0;
    for (let i = 0; i < this.weights.length; i++) {
      result += this.weights[i] * inputs[i];
    }
    return this.actFunc(result);
  }
}

//------------------------------------------------------------------------------

class NeuronLayer {
  constructor(numberOfNeurons, prevLayer) {
    this.neurons = [];
    this.values = [];
    for (let i = 0; i < numberOfNeurons; i++) {
      const nOfWeights = prevLayer ? prevLayer.neurons.length : 0;
      this.neurons.push(new Neuron(nOfWeights));
    }
    this.prevLayer = prevLayer;
    this.bias = Math.random() - 0.5;
  }

  calcValues(inputs) {
    const neurons = this.neurons;
    if (!inputs) inputs = this.prevLayer.values;
    for (let i = 0; i < neurons.length; i++) {
      this.values[i] = neurons[i].calcValue(inputs);
    }
    this.values[neurons.length] = this.bias;
  }
}

//------------------------------------------------------------------------------

class NeuralNetwork {
  constructor(numberOfLayers, ...neuronsInLayer) {
    this.layers = [];
    for (let i = 0; i < numberOfLayers; i++) {
      this.layers.push(new NeuronLayer(neuronsInLayer[i], this.layers[i - 1]));
    }
  }

  calcValues(x) {
    const inputs = this.getInput(x);
    const layers = this.layers;

    layers[0].calcValues(inputs);
    for (let i = 1; i < layers.length; i++) {
      layers[i].calcValues();
    }
    return layers[layers.length - 1].values;
  }

  getInput(x) {
    const res = [x];
    for (let i = 2; i < 6; i++) {
      res.push(Math.pow(x, i));
    }
    return res;
  }
}

//------------------------------------------------------------------------------

module.exports = {
  NeuralNetwork
};
