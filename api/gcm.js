const FCM = require('fcm-node');

//json 위한거 request
// var request = require("request");
const serverKey = 'AAAAWam5RW8:APA91bEuUu-vAoF35yJtJAfc_oPV0YqslSK3fev249OmGmmS188B5l4w5AQRT1smDOOIiMl_tyrrBactJ8wVPxijV8EHlnGXuoFVRxLP-k7i0Agu2WZiAL9OoNQQfbtk8uCNxD-m72x5';
const clientToken = 'fecMOTOriSA:APA91bH8tVJb055m0g_TbmkNEUI9_CVFQ-jLC8henZQxFJMwEmCzGLHsy1ErAAXUtowvRqzj1-MQIIcqnzEMz3U39ezkeOu5G_AaP660dIqc9ns9c10Bz7sRQMLje37jcxNhblj9eUke';

// var push_data = {
//     to: clientToken,
//     notification: {
//         title: "Hello Node",
//         body: "Node로 발송하는 Push 메시지입니다",
//         sound: 'default',
//         click_action: "FCM_PLUGIN_ACTIVITY",
//         icon: "fcm_push_icon",
//         click_action: "OPEN_THIS_ACT"
//     },
//     priority: "high",
//     // restricted_package_name: "study.cordova.fcmclient",
//     data: {
//         num1: 2000,
//         num2: 3000
//     }
// };

//json 정현
// var url = "https://jsonplaceholder.typicode.com/posts/1";
//
// var push_data = {};
// request({
//     url: url,
//     json: true
// }, function(error, response, body){
//     if (!error && response.statusCode === 200) {
//         console.log(error);
//         console.log(body) // Print the json response
//         push_data =  body;
//     }
// })

const fcm = new FCM(serverKey);

module.exports = {
    fcm,
    clientToken
};

// fcm.send(push_data, function (err, response) {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log('push 메시지가 발송되었습니다');
//     console.log(response);
// });