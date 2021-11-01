// const zeco = require('./zecoLib.js');
// const commandLineArgs = require('command-line-args');

// const cmdOptions = [{
//         name: "add",
//         alias: "a",
//         type: String
//     },
//     {
//         name: "find",
//         alias: "f",
//         type: String
//     }
// ];
// const options = commandLineArgs(cmdOptions);

// zeco.init();

// if (options.add) {
//     console.log("Sending hash for file: " + options.add);
//     let hash = zeco.calculateHash(options.add); //1
//     console.log("SHA-256 hash value: " + hash);
//     zeco.sendHash(hash, function(error, tx) { //2
//         console.log("Transaction ID: " + tx);
//     });
// } else if (options.find) {
//     console.log("Looking up hash for file: " + options.find);
//     let hash = zeco.calculateHash(options.find);
//     console.log("SHA-256 hash value: " + hash);
//     zeco.findHash(hash, function(error, result) {
//         if (result.blockNumber != 0) {
//             console.log("Has value found at block No.: " + result.blockNumber);
//             console.log("Mine time: " + result.mineTime);
//         } else console.log("Hash value not found on blockchain");
//     });
// } else {
//     console.log("Illegal command line options");
// }