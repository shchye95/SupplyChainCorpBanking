const SmartCredit = artifacts.require("SmartCredit");
const SmartInvoice = artifacts.require("SmartInvoice");

module.exports = function(deployer) {
  deployer.deploy(SmartCredit);
  deployer.deploy(SmartInvoice);
};