
const timeData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let promiseArr = [];

timeData.forEach(time => {
    promiseArr.push(new Promise((resolve, reject) => {
        setTimeout(() => {
                console.log('time set!');
                // reject(new Error());
                resolve(time);
            }
            , time * 1000);
        }));
});

console.log(promiseArr.length);

Promise.all(promiseArr).then(values => {
    console.log(values);
    console.log('finished!');
}).catch(e => {
    console.log(e);
});

while (true) {
    ;
}

const myAlgorithm = () => {
    for (let i = 0; i < 10000000; ++i) {
        ;
    }
    return 10;
};

let p = new Promise((resolve, reject) => {
    // resolve 는 예상했던 대로 진행이 되었을 경우에 리턴.
    // reject 는 예상했던 대로 진행이 안 되었을 경우 리턴.

    let data = myAlgorithm(10);

    if (data === 10) {
        return resolve();
    } else {
        return reject();
    }
});

p
    .then(() => {
        console.log('resolved!');
    })
    .catch(() => {
        console.log('rejected!');
    });