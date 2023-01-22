require("@nomicfoundation/hardhat-toolbox");
const {config} = require("dotenv");
const {resolve} = require("path");

const dotenvConfigPath = process.env.DOTENV_CONFIG_PATH || "./.env";
config({ path: resolve(__dirname, dotenvConfigPath) });


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};
