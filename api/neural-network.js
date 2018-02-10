const brain = require('brain.js');
const pify = require('pify');
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');

// const detectFaceWithNet = (net, dataset_in) => {
//     //dataset_in : 새로운 이미지 20 장
//     // 'stranger';
//
//     // insert faces to dataset.
//         // 1. stranger 를 outputset 에 넣는다
//         // 2. dataset 에 face 하나씩이랑 outputset 에서 stranger 를 찾아서 같이 묶음으로 만들어서 넣는다.
//     // net.run 으로 해서 stranger 가 가장 높게 나오면 stranger.
//     // 만일 다른 사람이 높게 나오면 그 사람
//     // 그게 누군지를 알아서 저장.
//     // 다시 net 을 초기화
//     // 그 사람을 리턴.
//
//
//     let detectedPersonId = "";
//
//     dataset_in.map(value => {
//         // console.log(net.run(value));
//         console.log(brain.likely(value, net));
//         detectedPersonId = brain.likely(value, net);
//     });
//
//     net = new brain.NeuralNetwork();
//
//     for (let i = 0; i < dataset_in.length; ++i) dataset.push({input : dataset_in[i], output : {detectedPersonId : 1}});
//
//     console.log('start training.');
//     net.train(dataset);
//     ///
//     return detectedPersonId;
// };

class Net {
    constructor() {
        // does dataset mean a collection of normalized vectors?
        // no, this means a collections of nn data, that consists of input and output set.
        // ex) {input : dataVal, output : {key : 1}}
        this.dataSet = [];

        this.outputSet = [];
        this.net = new brain.NeuralNetwork();
    }

    register(jsonData, output) {
        return new Promise((resolve, reject) => {
            try {
                this.addDataset(jsonData);
                this.addOutputSet(output);
                this.net = new brain.NeuralNetwork();
                this.net.train(this.dataSet);
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

    detect(data) {
        return new Promise((resolve, reject) => {
            try {
                let res = {};

                data.map(value => {
                    const output = this.net.run(value);
                    console.log(output);

                    for (let entry of Object.entries(output)) {
                        if (!res[entry[0]]) res[entry[0]] = 0;
                        res[entry[0]] += entry[1];
                    }
                });

                res = Object.entries(res).map(arr => [arr[0], arr[1] / data.length]);

                console.log('res : ');
                console.log(res);

                let ret = [];

                for (let v of res) {
                    if (v[1] > 0.8) {
                        console.log(`${v[0]} : ${v[1]}`);
                        ret.push([v[0], v[1]]);
                    }
                }

                // just resolve pure result? or say it's stranger?
                // if (ret.length > 0) resolve(ret);
                // else resolve();

                resolve(ret); // use brain.likely() after test.
            } catch (e) {
                reject(e);
            }
        });
    }

    trainNet() {
        return new Promise((resolve, reject) => {
            try {
                const res = this.net.train(this.dataSet, {
                    iterations: 50000,    // the maximum times to iterate the training data
                    errorThresh: 0.001,   // the acceptable error percentage from training data
                    log: false,           // true to use console.log, when a function is supplied it is used
                    logPeriod: 10,        // iterations between logging out
                    learningRate: 0.3,    // scales with delta to effect training rate
                    momentum: 0.1,        // scales with next layer's change value
                    callback: (n) => {
                        if (n.iterations % 500 === 0) {
                            console.log('test on going', n);
                        }
                    },       // a periodic call back that can be triggered while training
                    callbackPeriod: 10,   // the number of iterations through the training data between callback calls
                    timeout: Infinity     // the max number of milliseconds to train for
                });
                resolve(res);
            } catch (e) {
                reject(e);
            }
        });
    }

    // runNet (data) {
    //     this.net.run(data);
    // }

    addDataSetWithOutput (data, output) {
        console.log('data : ');
        console.log(data);
        console.log('output : ');
        console.log(output);
        this.outputSet.push(output);
        data.map(datum => this.dataSet.push({input : datum, output : output}));
    }

    // addOutputSet (output) {
    //     this.outputSet.push(output);
    // }

    // static normalizeVector (v) {
    //     return v.map(dat => (dat / 1000) + 0.5);
    // }
}

// const dispatch = ()  => {
//     let net = new brain.NeuralNetwork();
//     let dataset = [];
//     let outputset = [];
//
//     return (type, dataset) => {
//
//         switch (type) {
//             case "reset" :
//                 net = new brain.NeuralNetwork();
//                 // net.train(dataset);
//                 return net;
//             case "get" :
//                 return net;
//         }
//     }
// };

// module.exports = dispatch(); // make object and return it.
module.exports = new Net();

