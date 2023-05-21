require("@nomiclabs/hardhat-waffle");
//0.8.4
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "8a371be0021692214ed23f21cdc57c3410e3a39b0ce488c609453852ae5daa61",
        "ad8720f35cda472b7320d37326fa54a3ba170a2425a8e1536b289c45ec879365",
        "9f9a11509177439b14abba52b9e0f4d7a687e5c25d661787a23c2abe47c933d4",
        "2ed1c8aacd824ae5c48bff0eb88e76d7c02d8312da4c94b6a776a11478aec265",
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
