# Neural network
It's a small console application that shows one of deep learning algoritms - backpropagation.
You can watch neural network learning by running the application or by importing NeuralNetwork class to your own code and using it.

## Usage
### Application: 
Run file src/Main.js. You will see all avaliable commands to interact with neural network.

### NeuralNetwork class
- Import src/Classes.js to your project:
```
const NN = require('src/Classes.js').NeuralNetwork
```
- Create a NeuralNetwork by
```
const nn = new NN(2, 5, 3); // Neural Network with 2 input neurons, 5 in the hidden layer and 3 in the output layer
```
- To calculate values from inputs use
```
nn.calcValues([0.5, 0.7]); // Inputs must be an array of values
```
- To train network with an example:
```
nn.train([0.5, 0.7], [0.3, -0.4, 0.1]); // First array - inputs, second array - right answers
```
- To train network with a set of examples:
```
const trainData = [
  [ [0.5, 0.7], [0.3, -0.4, 0.1] ],
  [ [0.1, 0.3], [-0.9, 0, 0.2] ]
];
nn.trainOnDataset(trainData); // Notice that all input data must be normalized to [-1, 1] interval
```
- To save network to a file:
```
nn.saveTo(%fileName%);
```
- To load network from a file:
```
const nn2 = NN.loadFrom(%fileName%);
```
