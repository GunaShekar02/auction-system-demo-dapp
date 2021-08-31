const Auction = artifacts.require("Auction");

module.exports = function (deployer) {
  deployer.deploy(Auction, "0x6baf733A1532294D24C88f0509bF5cF3F34E1E72");
};
