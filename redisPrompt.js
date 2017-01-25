/* Il faut installer les paquets redis et prompt avec la commande npm install */
var redis = require("redis");
var prompt = require('prompt');
//créé 2 clients, un qui aura le rôle de publier
var sub = redis.createClient();
var pub = redis.createClient();
//variables qui contiendront respectivement le message et le pseudo
var message;
var pseudo;
var channel;

//démarre la fonctionnalité prompt
prompt.start();

//fonction permettant de selectionner un canal
function channelPrompt() {
    prompt.get(['channel'], function (err, result){
        if (err) {
          return onErr(err);
        }
        channel = result.channel;
        getMessage();
        sub.subscribe(channel);
    });
}

//fonction permettant de récupérer les pseudos des différents users
function pseudoPrompt() {
    prompt.get(['pseudo'], function (err, result) {
        if (err) {
            return onErr(err);
        }
        pseudo = result.pseudo;
        channelPrompt();
    });
}

//fonction permettant de récupérer les messages des différents users
function getMessage() {
    prompt.get(['messages'], function (err, result) {
        if (err) {
            return onErr(err);
        }
        message = result.messages;

        var mess = pseudo + ' a dit : ' + message + ', sur le channel : ' + channel;
        pub.publish(channel, mess);
        getMessage();
    });
}

//listener sur les messages qui circulent
sub.on("message", function (channel, message) {
    console.log(message);
});

pseudoPrompt();
