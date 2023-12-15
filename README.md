# Verification bug example

## Deployment

```shell
PROJECT_ID=<infura project id>
MNEMONIC="<mnemonic>"
npx hardhat deploy --network <network>
```

The contracts (and libraries) are already deployed to the `sepolia` network.

## Verification

To verify the sepolia contracts:

```shell
npx hardhat --network sepolia etherscan-verify --api-key <etherscan_api_key>
```

The `Greeter` and `Math` contracts are verified successfully.
The request that is being sent to verify the `Util` library is the following:

```json
Failed to verify contract Util: NOTOK, Fail - Unable to verify. Please check for missing Library or invalid name (i.e names are case senstive). Library was required but suitable match not found
{
  "apikey": "XXXXXX",
  "module": "contract",
  "action": "verifysourcecode",
  "contractaddress": "0xCb199A11D9ace8493C55A238AD9AdDa633947824",
  "sourceCode": "...",
  "codeformat": "solidity-standard-json-input",
  "contractname": "contracts/Util.sol:Util",
  "compilerversion": "v0.8.23+commit.f704f362",
  "licenseType": 12
}
```

The sourceCode payload that is being sent is the following:

```json
{
  "language": "Solidity",
  "settings": {
    "evmVersion": "paris",
    "libraries": {
      "contracts/Util.sol:Util": {
        "Math": "0x86D8a35a49e64D61Fe8c0eBE3c0145a0f865c02c"
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
      "content": "//SPDX-License-Identifier: Apache-2.0\npragma solidity ^0.8.0;\n\nimport {Math} from \"./Math.sol\";\n\nlibrary Util {\n    using Math for uint256;\n\n    function isOdd(uint256 n) public pure returns (bool) {\n        return !Math.isEven(n);\n    }\n}\n"
    }
  }
}
```

## Verify plugin

Verify plugin sends a different payload, which actually works.

```shell
export ETHERSCAN_API_KEY=<etherscan_api_key>
npx hardhat verify --network sepolia 0xCb199A11D9ace8493C55A238AD9AdDa633947824
```

```json
{
  "language": "Solidity",
  "sources": {
    "contracts/Math.sol": {
      "content": "//SPDX-License-Identifier: Apache-2.0\npragma solidity ^0.8.0;\n\nlibrary Math {\n    function isEven(uint256 n) public pure returns (bool) {\n        return n % 2 == 0;\n    }\n}\n"
    },
    "contracts/Util.sol": {
      "content": "//SPDX-License-Identifier: Apache-2.0\npragma solidity ^0.8.0;\n\nimport {Math} from \"./Math.sol\";\n\nlibrary Util {\n    using Math for uint256;\n\n    function isOdd(uint256 n) public pure returns (bool) {\n        return !Math.isEven(n);\n    }\n}\n"
    }
  },
  "settings": {
    "evmVersion": "paris",
    "optimizer": { "enabled": false, "runs": 200 },
    "outputSelection": {
      "*": {
        "*": [
          "abi",
          "evm.bytecode",
          "evm.deployedBytecode",
          "evm.methodIdentifiers",
          "metadata",
          "devdoc",
          "userdoc",
          "storageLayout",
          "evm.gasEstimates"
        ],
        "": ["ast"]
      }
    },
    "metadata": { "useLiteralContent": true },
    "libraries": {
      "contracts/Math.sol": {
        "Math": "0x86d8a35a49e64d61fe8c0ebe3c0145a0f865c02c"
      }
    }
  }
}
```

Most importantly the following is the main difference:

```diff
     "libraries": {
-      "contracts/Util.sol:Util": {
         "Math": "0x86D8a35a49e64D61Fe8c0eBE3c0145a0f865c02c"
       }
     },
     "libraries": {
+      "contracts/Math.sol": {
         "Math": "0x86d8a35a49e64d61fe8c0ebe3c0145a0f865c02c"
       }
     },
```
