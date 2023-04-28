require("@nomiclabs/hardhat-waffle");
//0.8.4
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x35f8681b44f5d0fa31f8802209385cfdd13c3b1a3dc26133adfdffe99e48163a",
        "0x45361e8a1074284e355626113d0e75c5d9c0e0a277be17e8988009372ae55afd",
        "0x35495f0168e2e8b93e80060710e7672a962b7e8f31eeec6d6a9fa91e2394223f",
        "0x8e04f46a07e6ff5a970a23323966db884d939aff3fbc426f070851731a8999e2",
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
