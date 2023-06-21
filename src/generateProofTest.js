const testConfig = require("./testProofConfig.json");
const snarkjs = require("snarkjs");
const fs = require("fs");
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

async function getECDSAProof(r, s, msgHash, pubKey, pubKeyList) {
  const rTuple = bigintToTuple(r, 64, 4);
  const sTuple = bigintToTuple(s, 64, 4);
  const msgHashTuple = bigintToTuple(msgHash, 64, 4);
  const pubKeyTuple = pubKeyTo2Tuple(pubKey, 64, 4);

  console.log(rTuple, sTuple, msgHashTuple, pubKeyTuple, pubKeyList);
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      r: rTuple,
      s: sTuple,
      msghash: msgHashTuple,
      pubkey: pubKeyTuple,
      pubkeylist: pubKeyList,
    },
    "./public/circuits/ecdsa/ecdsa.wasm",
    "./public/circuits/ecdsa/ecdsaFinal.zkey"
  );
  return [proof, publicSignals];
}

async function getRSAProof(publicKeyE, publicKeyN, amount) {
  const amountInput = bigintToTuple(amount, 8, 8);
  publicKeyE = publicKeyE.map((x) => BigInt(x));
  publicKeyN = publicKeyN.map((x) => BigInt(x));
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { base: amountInput, exp: publicKeyE, modulus: publicKeyN },
    "./public/circuits/rsa/rsa.wasm",
    "./public/circuits/rsa/rsaFinal.zkey"
  );
  return {
    amountProof: proof,
    rsaPublicSignals: publicSignals,
  };
}

function processECDSAProof(proof, publicSignals) {
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

function processRSAProof (proof, publicSignals) {
    const proofA = proof.pi_a.slice(0, 2);
    const proofB = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]];

    const proofC = proof.pi_c.slice(0, 2);
    const amountHash = publicSignals.slice(0, 8);
    return [proofA, proofB, proofC, amountHash];
}
getECDSAProof(
  testConfig.r,
  testConfig.s,
  testConfig.messageHash,
  testConfig.pubkey,
  testConfig.pubKeyList
)
  .then(([proof, publicSignals]) => {
    console.log(proof, publicSignals);
  })
  .catch((err) => {
    console.log(err.message);
  });

const [proofPartyA, messageHash] = processECDSAProof(
  testConfig.proof,
  testConfig.publicSignals
);
const [proofPartyB, _] = processECDSAProof(
  testConfig.proof,
  testConfig.publicSignals
);
const expenseId = testConfig.expenseId;

const [proofARSA, proofBRSA, proofCRSA, amountHash] = processRSAProof(testConfig.rsaProof, testConfig.rsaPublicSignals);
// getRSAProof(testConfig.keyE, testConfig.keyN, testConfig.amount)
//   .then(({ amountProof, rsaPublicSignals }) => {
//     console.log(amountProof, rsaPublicSignals);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
