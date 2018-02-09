const brain = require('brain.js');
const pify = require('pify');
const fs = require('fs');
const path = require('path');

// const detectFaceWithNet = (net, dataset, outputset, strangerFaces) => {
//
//
//
// };

const detectFaceWithNet = (net, dataset_in) => {
    //dataset_in : 새로운 이미지 20 장
    // 'stranger';

    // insert faces to dataset.
        // 1. stranger 를 outputset 에 넣는다
        // 2. dataset 에 face 하나씩이랑 outputset 에서 stranger 를 찾아서 같이 묶음으로 만들어서 넣는다.
    // net.run 으로 해서 stranger 가 가장 높게 나오면 stranger.
    // 만일 다른 사람이 높게 나오면 그 사람
    // 그게 누군지를 알아서 저장.
    // 다시 net 을 초기화
    // 그 사람을 리턴.


    let detectedPersonId = "";

    dataset_in.map(value => {
        // console.log(net.run(value));
        console.log(brain.likely(value, net));
        detectedPersonId = brain.likely(value, net);
    });

    net = new brain.NeuralNetwork();

    for (let i = 0; i < dataset_in.length; ++i) dataset.push({input : dataset_in[i], output : {detectedPersonId : 1}});

    console.log('start training.');
    net.train(dataset);
    ///
    return detectedPersonId;
};




const dispatch = ()  => {
    let net = new brain.NeuralNetwork();
    let dataset = [];
    let outputset = [];

    return (type, dataset) => {

        switch (type) {
            case "reset" :
                net = new brain.NeuralNetwork();
                // net.train(dataset);
                return net;
            case "get" :
                return net;
        }
    }
};

module.exports = dispatch();
