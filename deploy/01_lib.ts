import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const Math = await deployments.deploy("Math", { from: deployer, log: true });
  await deployments.deploy("Util", {
    from: deployer,
    log: true,
    libraries: { Math: Math.address },
  });
};

export default func;
export const tags = ["Libs"];
