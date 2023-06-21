const { expect } = require("chai");
const { ethers } = require("hardhat");
const web3 = require("web3");
const config = require("./test-config.json");
const expenseId = 10
var admin,
  user1,
  user2,
  user3,
  Zeimbursement,
  zeimbursementContract,
  RSAVerifier,
  rsaVerifierContract,
  ECDSAVerifier,
  ecdsaVerifierContract;
  config
describe("Zeimbursement", function () {
  this.beforeAll(async () => {
    [admin, user1, user2, user3] = await ethers.getSigners();
    RSAVerifier = await ethers.getContractFactory("RSAGroth16Verifier");
    rsaVerifierContract = await RSAVerifier.deploy();
    ECDSAVerifier = await ethers.getContractFactory("ECDSAGroth16Verifier");
    ecdsaVerifierContract = await ECDSAVerifier.deploy();
    Zeimbursement = await ethers.getContractFactory("Zeimbursement");
    zeimbursementContract = await Zeimbursement.deploy(rsaVerifierContract.address, ecdsaVerifierContract.address);
  });
  it("set up new expense", async function () {
      await zeimbursementContract.connect(admin).setUpNewExpense(expenseId, config.publicKeyN, config.publicKeyE, config.pubkeylist);
      await expect(zeimbursementContract.connect(admin).setUpNewExpense(expenseId, config.publicKeyN, config.publicKeyE, config.pubkeylist)).to.be.revertedWith("Expense already occupied");
  });
  it("allow uploader", async function () {
      await zeimbursementContract.connect(admin).allowUploader(user1.address, expenseId);
      await expect(zeimbursementContract.connect(user1).allowUploader(user2.address, expenseId)).to.be.revertedWith("You are not an admin of this expense");
  });
  it("add new admin", async function () {
      await expect(zeimbursementContract.connect(user1).allowUploader(user2.address, expenseId)).to.be.revertedWith("You are not an admin of this expense");
      await zeimbursementContract.connect(admin).addAdmin(user1.address, expenseId);
      await zeimbursementContract.connect(user1).allowUploader(user2.address, expenseId);
  });
  it("upload transaction", async function () {
      await expect(zeimbursementContract.connect(user3).uploadTransaction(config.proofECDSAPartyA, config.proofECDSAPartyB, config.messageHash, config.proofARSA, config.proofBRSA, config.proofCRSA, config.amountHash, expenseId)).to.be.revertedWith("You are not an uploader of this expense");
      await zeimbursementContract.connect(user1).uploadTransaction(config.proofECDSAPartyA, config.proofECDSAPartyB, config.messageHash, config.proofARSA, config.proofBRSA, config.proofCRSA, config.amountHash, expenseId)
  })
});
