// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import rsa and ecdsa verifier
import "./RSAVerifier.sol";
import "./ECDSAVerifier.sol";


contract Zeimbursement {
    struct Expense {
        // n, e for RSA public key
        uint256[8] publicKeyN;
        uint256[8] publicKeyE;
        uint256[4][2][4] allowedPublicKeys; // tentatively there is only 4 allowed public keys for now, may be adjustable in the future
    }
    mapping (address => mapping(uint256 => bool)) internal admins;
    mapping (uint256 => Expense) internal expenses;
    mapping (uint256 => bool) internal expenseOccupied;
    mapping (address => mapping (uint256 => bool)) internal uploaders;

    RSAGroth16Verifier internal rsaVerifier;
    ECDSAGroth16Verifier internal ecdsaVerifier;

    event expenseSetUp(uint256 expenseId, uint256[8] publicKeyN, uint256[8] publicKeyE, address newAdmin, uint256[4][2][4] allowedPublicKeys);

    constructor(address rsaVerifierAddress, address ecdsaVerifierAddress) {
        rsaVerifier = RSAGroth16Verifier(rsaVerifierAddress);
        ecdsaVerifier = ECDSAGroth16Verifier(ecdsaVerifierAddress);
    }

    function setUpNewExpense (uint256 expenseId, uint256[8] calldata publicKeyN, uint256[8] calldata publicKeyE, uint256[4][2][4] calldata allowedPublicKeys) external {
        require(!expenseOccupied[expenseId], "Expense already occupied");
        expenseOccupied[expenseId] = true; // set the expense to occupied
        expenses[expenseId] = Expense(publicKeyN, publicKeyE, allowedPublicKeys); // set the public key for amount update and the allowed public keys (which can sign the transaction)
        admins[msg.sender][expenseId] = true; // set the first admin
        emit expenseSetUp(expenseId, publicKeyN, publicKeyE, msg.sender, allowedPublicKeys);
    }
    function allowUploader(address uploader, uint256 expenseId) external { // since not all the allowedPublicKeys(which can sign the transaction) are employee inside the company, we need to specify who can upload the transaction 
        require(admins[msg.sender][expenseId], "You are not an admin of this expense");
        uploaders[uploader][expenseId] = true; // add new uploader
    }

    function addAdmin(address newAdmin, uint256 expenseId) external {
        require(admins[msg.sender][expenseId], "You are not an admin of this expense");
        admins[newAdmin][expenseId] = true; // add new admin
    }

    event transationUploaded(uint[2][4] ecdsaProofAPartyA, uint[2][4] ecdsaProofAPartyB, uint[4] messageHash, uint[2] proofARSA, uint[2][2] proofBRSA, uint[2] proofCRSA, uint[8] amountHash, uint256 expenseId, address uploader);

    function uploadTransaction(uint[2][4] calldata ecdsaProofPartyA, uint[2][4] calldata ecdsaProofPartyB, uint[4] calldata messageHash, 
    uint[2] calldata proofARSA, uint[2][2] calldata proofBRSA, uint[2] calldata proofCRSA, uint[8] calldata amountHash, uint256 expenseId) external {
        require(uploaders[msg.sender][expenseId], "You are not an uploader of this expense");
        uint256[37] memory ecdsaPubIn;
        ecdsaPubIn[0] = 1;
        for(uint i = 0; i < 4; i++) {
            ecdsaPubIn[i + 1] = messageHash[i];
        }
        for(uint i = 0; i < 4; i++){
            for(uint o = 0; o < 2; o++){
                for(uint p = 0; p < 4; p++){
                    ecdsaPubIn[5 + i * 8 + o * 4 + p] = expenses[expenseId].allowedPublicKeys[i][o][p];
                }
            }
        }
        require(ecdsaVerifier.verifyProof(ecdsaProofPartyA[0], [ecdsaProofPartyA[1], ecdsaProofPartyA[2]], ecdsaProofPartyA[3], ecdsaPubIn), "ECDSA proof verification failed");
        require(ecdsaVerifier.verifyProof(ecdsaProofPartyB[0], [ecdsaProofPartyB[1], ecdsaProofPartyB[2]], ecdsaProofPartyB[3], ecdsaPubIn), "ECDSA proof verification failed");
        uint256[24] memory rsaPubIn;
        for(uint i = 0; i < 8; i++) {
            rsaPubIn[i] = amountHash[i];
            rsaPubIn[i+8] = expenses[expenseId].publicKeyE[i];
            rsaPubIn[i+16] = expenses[expenseId].publicKeyN[i];
        }
        require(rsaVerifier.verifyProof(proofARSA, proofBRSA, proofCRSA, rsaPubIn), "RSA proof verification failed");
        emit transationUploaded(ecdsaProofPartyA, ecdsaProofPartyB,  messageHash, proofARSA, proofBRSA, proofCRSA, amountHash, expenseId, msg.sender);
    }
}