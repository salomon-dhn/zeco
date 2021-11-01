var ZecoContract = artifacts.require("Zeco");

module.exports = async function(deployer, network, accounts) {
    // deployment steps
    await deployer.deploy(ZecoContract);
};