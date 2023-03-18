require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  // defaultNetwork: "ganache",
  // networks: {
  //   ganache: {
  //     url: "http://127.0.0.1:7545",
  //     accounts: [
  //       "06c869a1ea3feb2da9d02b28ce12e5a89f108691d5e46f5224722a017bcb303b",
  //     ],
  //   },
  // },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test",
  },
};
