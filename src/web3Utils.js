const { ecrecover } = require("ethereumjs-util/dist/signature");
const ethers = require("ethers");
const snarkjs = window.snarkjs;
const contractConfigs = require("./contractConfig.json");

function bigintToTuple(x, n, k) {
  let mod = 2n ** BigInt(n);
  // let ret's length be k, and each element is 0n
  let ret = new Array(k).fill(0n);
  let x_temp = BigInt(x);
  for (var idx = 0; idx < ret.length; idx++) {
    ret[idx] = x_temp % mod;
    x_temp = x_temp / mod;
  }
  return ret;
}
function pubKeyTo2Tuple(pubkey, n, k) {
  pubkey = BigInt(pubkey);
  let mod = 2n ** BigInt(n);
  let ret = [new Array(k).fill(0n), new Array(k).fill(0n)];
  let temp = pubkey;
  for (var idx = 1; idx >= 0; idx--) {
    for (var jdx = 0; jdx < ret[idx].length; jdx++) {
      ret[idx][jdx] = temp % mod;
      temp = temp / mod;
    }
  }
  return ret;
}
function bigNumberToBigInt(bigNumber) {
  return BigInt(bigNumber._hex);
}
export function getPublicKey(r, s, v, msgHash) {
  function hexToBuffer(hex) {
    // first convert to Uint8Array with length 32
    const hexArray = hex
      .split("0x")[1]
      .match(/.{1,2}/g)
      .map((byte) => parseInt(byte, 16));
    const uint8Array = new Uint8Array(hexArray);
    // then convert to Buffer
    return Buffer.from(uint8Array);
  }
  const rBuffer = hexToBuffer(r);
  const sBuffer = hexToBuffer(s);
  const msgHashBuffer = hexToBuffer(msgHash);
  const vInt = parseInt(v, 16);
  return ecrecover(msgHashBuffer, vInt, rBuffer, sBuffer);
}
export function uint8ArrayToString(uint8Array) {
  // convert the array to Hex first
  const myArr = Array.from(uint8Array);
  const hexString =
    "0x" + myArr.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return hexString;
}

export function getContract(abi, contractAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return new ethers.Contract(contractAddress, abi, provider);
}
export async function setUpNewExpense(
  expenseID,
  allowedPublicKeys,
  rsaPublicKeyE,
  rsaPublicKeyN
) {
  const contract = getContract(
    contractConfigs.Zeimbursement.abi,
    contractConfigs.Zeimbursement.address
  );
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(
    expenseID,
    bigintToTuple(rsaPublicKeyN, 8, 8),
    bigintToTuple(rsaPublicKeyE, 8, 8),
    allowedPublicKeys.map((pubkey) => pubKeyTo2Tuple(pubkey, 64, 4))
  );
  await provider.send("eth_requestAccounts");
  const signer = provider.getSigner();

  await contract.connect(signer).setUpNewExpense(
    expenseID,
    bigintToTuple(rsaPublicKeyN, 8, 8),
    bigintToTuple(rsaPublicKeyE, 8, 8),
    allowedPublicKeys.map((pubkey) => pubKeyTo2Tuple(pubkey, 64, 4))
  );
}
export async function getExpenseEvents(expenseId) {
  const contract = getContract(
    [contractConfigs.Zeimbursement.eventAbi.setUpNewExpense],
    contractConfigs.Zeimbursement.address
  );
  const eventFilter = contract.filters.expenseSetUp();
  const events = await contract.queryFilter(eventFilter);
  const eventDict = {};
  for (var idx = 0; idx < events.length; idx++) {
    if (bigNumberToBigInt(events[idx].args.expenseId) == BigInt(expenseId)) {
      eventDict.keyE = events[idx].args.publicKeyE.map((x) =>
        bigNumberToBigInt(x)
      );
      eventDict.keyN = events[idx].args.publicKeyN.map((x) =>
        bigNumberToBigInt(x)
      );
      eventDict.expenseId = expenseId;
      eventDict.allowedPublicKeys = events[idx].args.allowedPublicKeys.map(
        (pubkey) => pubkey.map((x) => x.map((y) => bigNumberToBigInt(y)))
      );
      return eventDict;
    }
  }
  throw new Error("such expense id has not been set up yet");
}
export async function getRSAProof(publicKeyE, publicKeyN, amount) {
  const amountInput = bigintToTuple(amount, 8, 8);
  console.log(amountInput)
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { base: amountInput, exp: publicKeyE, modulus: publicKeyN },
    "./circuits/rsa/rsa.wasm",
    "./circuits/rsa/rsaFinal.zkey"
  );
  return {
    amountProof: proof,
    rsaPublicSignals: publicSignals,
  };
}
export async function getECDSAProof(r, s, msgHash, pubKey, pubKeyList) {
  const rTuple = bigintToTuple(r, 64, 4);
  const sTuple = bigintToTuple(s, 64, 4);
  const msgHashTuple = bigintToTuple(msgHash, 64, 4);
  const pubKeyTuple = pubKeyTo2Tuple(pubKey, 64, 4);
  // console.log(rTuple, sTuple, msgHashTuple, pubKeyTuple, pubKeyList);
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      r: rTuple,
      s: sTuple,
      msghash: msgHashTuple,
      pubkey: pubKeyTuple,
      pubkeylist: pubKeyList,
    },
    "./circuits/ecdsa/ecdsa.wasm",
    "./circuits/ecdsa/ecdsaFinal.zkey"
  );
  return [proof, publicSignals];
}

export async function uploadTransaction (ecdsaProofPartyA, ecdsaProofPartyB, messageHash, proofARSA, proofBRSA, proofCRSA, amountHash, expenseId) {
  const contract = getContract(
    contractConfigs.Zeimbursement.abi,
    contractConfigs.Zeimbursement.address
  );
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts");
  const signer = provider.getSigner();
  // console.log(ecdsaProofPartyA, ecdsaProofPartyB, messageHash, "RSA:", proofARSA, proofBRSA, proofCRSA, amountHash, expenseId)
  await contract.connect(signer).uploadTransaction(
    ecdsaProofPartyA,
    ecdsaProofPartyB,
    messageHash,
    proofARSA,
    proofBRSA,
    proofCRSA,
    amountHash,
    expenseId
  );
}


export function processRSAProof (proof, publicSignals) {
  const proofA = proof.pi_a.slice(0, 2);

  const proofB = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]];

  const proofC = proof.pi_c.slice(0, 2);
  const amountHash = publicSignals.slice(0, 8);
  return [proofA, proofB, proofC, amountHash];
}

export function processECDSAProof(proof, publicSignals) {
  let proofArray = [];
  // proof array is a [4][2] array
  proofArray.push(proof.pi_a.slice(0, 2)); // append [pi_a[0], pi_a[1]]
  // pi_b is a [3][2] array, we only need the first two elements,
  proofArray.push(...[[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]]);
  proofArray.push(proof.pi_c.slice(0, 2));

  // console.log(proofArray);
  const messageHash = publicSignals.slice(1, 5);
  return [proofArray, messageHash];
}

export function getRSVFromSig(signature) {
  const r = signature.slice(0, 66);
  const s = "0x" + signature.slice(66, 130);
  const v = "0x" + signature.slice(130, 132);
  return [r, s, v];
}
export function checkNumberGreaterThen(x, bits){
  return BigInt(x) < 2n ** BigInt(bits)
}
