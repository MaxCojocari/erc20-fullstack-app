require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// module.exports = {
//   solidity: "0.8.4",
//   paths: {
//     artifacts: './src/artifacts',
//   },
//   networks: {
//     hardhat: {
//       chainId: 1337,
//     },
//   }
// };

module.exports = {
  solidity: "0.8.9",
  networks: {
    ropsten: {
      url: `${process.env.ROPSTEN_URL}`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
