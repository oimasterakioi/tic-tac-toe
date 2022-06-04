let neataptic = require('./neataptic.js');
let Neat = neataptic.Neat;
let Methods = neataptic.methods;
let Config = neataptic.Config;
let Architect = neataptic.architect;

let inputNum = 10;
let outputNum = 1;

let startNetwork = new Architect.Perceptron(
    inputNum,
    Math.round((inputNum + outputNum) * 2 / 3),
    outputNum
);

let popSize = 100;
let mutationRate = 0.5;
let elitism = 0.2;

class Brain{
    constructor(){
        this.highScore = 0;
        this.neat = new Neat(
            inputNum,
            outputNum,
            function (_network){
                return _network.score;
            },
            {
                popsize: popSize,
                mutation: [Methods.mutation.ADD_CONN, Methods.mutation.MOD_WEIGHT],
                mutationRate: mutationRate,
                mutationAmount: Math.round(popSize * mutationRate),
                network: startNetwork,
                elitism: Math.round(popSize * elitism)
            }
        );
    }
    getBrain(index){
        return this.neat.population[index];
    }
    getMove(index, board){
        return this.getBrain(index).activate(board.getBoard());
    }
    getLength(){
        return this.neat.population.length;
    }
    setBrainScore(index, score){
        this.getBrain(index).score = score;
        this.highScore = Math.max(this.highScore, score);
    }
    getHighScore(){
        return this.highScore;
    }
    evolve(){
        this.highScore = 0;
        return this.neat.evolve();
    }
    getGeneration(){
        return this.neat.generation;
    }
}
module.exports = Brain;