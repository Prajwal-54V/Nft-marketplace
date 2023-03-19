require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  // defaultNetwork: "ganache",
  // networks: {
  //   ganache: {
  //     url: "http://127.0.0.1:7545",
  //     accounts: [
  //       "69ac375a4515976528565e02311bf31ecdccd50512a3dffb1ee51efcf4cfd33c",
  //       "c9116b4524820dd34ea9690fba04719f376e31026214fb96f65f109111f8273b",
  //       "7666bed8cffd6e5173de74446d580f075bbb9222dbe434808ecc359b3472e54e",
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
