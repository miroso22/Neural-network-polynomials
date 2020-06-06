'use strict';

const colors = require('colors');
const fs = require('fs');

const activationFunc = x => x;
const derivActivationFunc = x => 1;

const activationFunc2 = x => 1 / (1 + Math.exp(-x));
const derivActivationFunc2 = x => Math.exp(-x) / Math.pow(1 + Math.exp(-x), 2);

const activationFunc3 = x => 2 / (1 + Math.exp(-3 * x)) - 1;
const derivActivationFunc3 = x => 6 * Math.exp(-3 * x) / Math.pow(Math.exp(-3 * x) + 1, 2);

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

  saveTo(fileName) {
    let savingData = '';
    for (let i = 1; i < this.layers.length; i++) {
      for (const n of this.layers[i].neurons) {
        for (const w of n.weights) {
          savingData += w + ',';
        }
        savingData += n.bias + ';';
      }
      savingData += '\n';
    }
    fs.writeFile(fileName, savingData, err => {
      if (err) throw err;
      console.log('Saved successfully to ' + fileName);
    });
  }

  static loadFrom(fileName) {
    try {
      // Read data from file
      const data = fs.readFileSync(fileName, 'utf8');
      const nnData = [];
      const neuronsInLayer = [];
      const layerInfo = data.split('\n');
      for (let i = 0; i < layerInfo.length - 1; i++) {
        const layer = [];
        const neuronInfo = layerInfo[i].split(';');
        for (let j = 0; j < neuronInfo.length - 1; j++) {
          const weightsInfo = neuronInfo[j].split(',');
          weightsInfo.forEach((elem, i, arr) => arr[i] = parseFloat(elem));
          layer.push(weightsInfo);
          neuronsInLayer[i] = neuronsInLayer[i] || weightsInfo.length - 1;
        }
        nnData.push(layer);
        neuronsInLayer[layerInfo.length - 1] = neuronInfo.length - 1;
      }
      // Put all settings into new neural network
      const loadedNN = new NeuralNetwork(...neuronsInLayer);
      for (let i = 1; i < loadedNN.layers.length; i++) {
        const curLayer = loadedNN.layers[i];
        for (let j = 0; j < curLayer.neurons.length; j++) {
          const curNeuron = curLayer.neurons[j];
          for (let k = 0; k < curNeuron.weights.length; k++) {
            curNeuron.weights[k] = nnData[i - 1][j][k];
          }
          curNeuron.bias = nnData[i - 1][j][curNeuron.weights.length];
        }
      }
      // Return a neural network with loaded weights and biases
      console.log('Loaded successfully from ' + fileName);
      return loadedNN;
    } catch(err) {
      if (err) throw err;
    }
  }
}

//------------------------------------------------------------------------------

module.exports = {
  NeuralNetwork
};
