# Verification bug example

## Deployment

```shell
PROJECT_ID=<infura project id>
MNEMONIC="<mnemonic>"
npx hardhat deploy --network <network>
```

The contracts (and libraries) are already deployed to the `goerli` network.

# Verification

To verify the goerli contracts:

```shell
npx hardhat --network goerli etherscan-verify --api-key <etherscan_api_key>
```

The request that is being sent to verify the `Util` library is the following:

```json
Failed to verify contract Util: NOTOK, Fail - Unable to verify
{
  "apikey": "XXXXXX",
  "module": "contract",
  "action": "verifysourcecode",
  "contractaddress": "0xCE5e6197b9D7caAbC3D979B85b7AFa18BD5245b9",
  "sourceCode": "...",
  "codeformat": "solidity-standard-json-input",
  "contractname": "contracts/Util.sol:Util",
  "compilerversion": "v0.8.11+commit.d7f03943",
  "licenseType": 12
}
```

The sourceCode payload that is being sent is the following:

```json
{
  "language": "Solidity",
  "settings": {
    "evmVersion": "london",
    "libraries": {
      "contracts/Util.sol:Util": {
        "Math": "0x8977457936461132c9c7abD3735bA6f3B6E7ef29"
      }
    },
    "metadata": { "bytecodeHash": "ipfs", "useLiteralContent": true },
    "optimizer": { "enabled": false, "runs": 200 },
    "remappings": []
  },
  "sources": {
    "contracts/Math.sol": {
      "content": "//SPDX-License-Identifier: Apache-2.0\npragma solidity ^0.8.0;\n\nlibrary Math {\n    function isEven(uint256 n) public pure returns (bool) {\n        return n % 2 == 0;\n    }\n}\n"
    },
    "contracts/Util.sol": {
      "content": "//SPDX-License-Identifier: Apache-2.0\npragma solidity ^0.8.0;\n\nimport \"./Math.sol\";\n\nlibrary Util {\n    using Math for uint256;\n\n    function isOdd(uint256 n) public pure returns (bool) {\n        return !Math.isEven(n);\n    }\n}\n"
    }
  }
}
```

## Etherscan plugin

Etherscan plugin sends a different payload, which actually works.

```shell
export ETHERSCAN_API_KEY=<etherscan_api_key>
npx hardhat verify --network goerli 0xCE5e6197b9D7caAbC3D979B85b7AFa18BD5245b9
```

```json
{
  "language": "Solidity",
  "settings": {
    "optimizer": { "enabled": false, "runs": 200 },
    "libraries": {
      "contracts/Math.sol": {
        "Math": "0x8977457936461132c9c7abd3735ba6f3b6e7ef29"
      }
    },
    "outputSelection": {
      "*": {
        "*": [
          "abi",
          "evm.bytecode",
          "evm.deployedBytecode",
          "evm.methodIdentifiers",
          "metadata"
        ],
        "": ["ast"]
      }
    }
  },
  "sources": {
    "contracts/Math.sol": {
      "content": "//SPDX-License-Identifier: Apache-2.0\npragma solidity ^0.8.0;\n\nlibrary Math {\n    function isEven(uint256 n) public pure returns (bool) {\n        return n % 2 == 0;\n    }\n}\n"
    },
    "contracts/Util.sol": {
      "content": "//SPDX-License-Identifier: Apache-2.0\npragma solidity ^0.8.0;\n\nimport \"./Math.sol\";\n\nlibrary Util {\n    using Math for uint256;\n\n    function isOdd(uint256 n) public pure returns (bool) {\n        return !Math.isEven(n);\n    }\n}\n"
    }
  }
}
```

Most importantly the following is the main difference:

```diff
     "libraries": {
-      "contracts/Util.sol:Util": {
         "Math": "0x8977457936461132c9c7abD3735bA6f3B6E7ef29"
       }
     },
     "libraries": {
+      "contracts/Math.sol": {
         "Math": "0x8977457936461132c9c7abd3735ba6f3b6e7ef29"
       }
     },
```
