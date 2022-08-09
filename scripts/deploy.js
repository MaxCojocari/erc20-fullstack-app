const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require('fs');
const path = require('path');

async function main() {
  const [owner] = await ethers.getSigners()

  const INTToken = await ethers.getContractFactory("INTToken", owner)
  const token = await INTToken.deploy(1e6)
  await token.deployed()


  console.log("INTToken deployed successfully:", token.address)

  saveFrontendFiles({
    INTToken: token,
  })
}


function saveFrontendFiles(contracts) {
  const contractsDir = path.join(__dirname, '/..', 'src/contracts')

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  Object.entries(contracts).forEach((contractItem) => {
    const [name, contract] = contractItem

    if (contract) {
      fs.writeFileSync(
        path.join(contractsDir, '/', name + '-contract-address.json'),
        JSON.stringify({[name]: contract.address}, undefined, 2)
      )
    }

    const ContractArtifact = hre.artifacts.readArtifactSync(name)

    fs.writeFileSync(
      path.join(contractsDir, '/', name + ".json"),
      JSON.stringify(ContractArtifact, null, 2)
    )

  })

}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
