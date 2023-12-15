import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types";

import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";

dotenv.config();

// read MNEMONIC from file or from env variable
const mnemonic = process.env.MNEMONIC;

const infuraNetwork = (
  network: string,
  chainId?: number,
  gas?: number
): HttpNetworkUserConfig => {
  return {
    url: `https://${network}.infura.io/v3/${process.env.PROJECT_ID}`,
    chainId,
    gas,
    accounts: mnemonic ? { mnemonic } : undefined,
  };
};

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  networks: {
    hardhat: mnemonic ? { accounts: { mnemonic } } : {},
    localhost: {
      url: "http://localhost:8545",
      accounts: mnemonic ? { mnemonic } : undefined,
    },
    sepolia: infuraNetwork("sepolia", 11155111, 6283185),
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
