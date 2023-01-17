const hre = require("hardhat");
const fs = require("fs/promises");

async function main() {
  const BankAccount = await hre.ethers.getContractFactory("BankAccount");
  const bankAccount = await BankAccount.deploy();

  await bankAccount.deployed();
  await writeContractABI(bankAccount)
  console.log(`BankAccount deployed to ${bankAccount.address}`);
}

async function writeContractABI(contract) {
  const data = {
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format()
    }
  };
  const content = JSON.stringify(data, null, 4);
  await fs.writeFile("src/abi/deployment.json", content, {encoding: "UTF-8"});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
