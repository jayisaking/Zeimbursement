
const { MY_ADDRESS } = process.env;
async function main() { 
  const RSAVerifier = await ethers.getContractFactory("RSAGroth16Verifier");
  const rsaVerifierContract = await RSAVerifier.deploy();
  console.log("rsaVerifierContract deployed to:", rsaVerifierContract.address)
  const ECDSAVerifier = await ethers.getContractFactory("ECDSAGroth16Verifier");
  const ecdsaVerifierContract = await ECDSAVerifier.deploy();
  console.log("ecdsaVerifierContract deployed to:", ecdsaVerifierContract.address)
  const Zeimbursement = await ethers.getContractFactory("Zeimbursement");
  
  const zeimbursementContract = await Zeimbursement.deploy(rsaVerifierContract.address, ecdsaVerifierContract.address);


  console.log("Zeimbursement deployed to:", zeimbursementContract.address)
  
  
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });
