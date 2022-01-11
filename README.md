# Verification bug example

## Deployment

```shell
PROJECT_ID=<infura project id>
MNEMONIC="<mnemonic>"
npx hardhat deploy --network <network>
```

# Verification

```shell
npx hardhat --network kovan etherscan-verify --api-key X7GBQ5A4N5ACSWVWHIPD4KDFZ4SQIXVAJM --sleep
npx hardhat --network <network> etherscan-verify --api-key <etherscan_api_key>
```
