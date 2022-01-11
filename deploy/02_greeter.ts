import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const Math = await deployments.get("Math");
  await deployments.deploy("Greeter", {
    from: deployer,
    args: ["Hello, world!"],
    log: true,
    libraries: {
      Math: Math.address,
    },
  });
};

export default func;
