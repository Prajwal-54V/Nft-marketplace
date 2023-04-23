require("@nomiclabs/hardhat-waffle");
//0.8.4
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "5b74721401e4cc34d0446a0d66cd965cec819a0b589b85be63b54e6acb82843e",
        "a2319dc7d5a86213caae8952b5acb52b8d8ad7822c01a97456940642c12721f3",
        "e3692afcfa1f8c01c113b416342923d25c820cd2b0d25d44c3bdeb4d73368513",
        "c12ac60d12c04abc2666dd32fddd27d1539cbec700cd293055cf746256640aa0",
      ],
    },
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test",
  },
};
