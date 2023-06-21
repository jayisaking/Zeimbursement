pragma circom 2.0.2;

include "../ecdsa.circom";
include "../../../node_modules/circomlib/circuits/comparators.circom";

template CalculateTotal(n) {
    signal input nums[n];
    signal output sum;

    signal sums[n];
    sums[0] <== nums[0];

    for (var i=1; i < n; i++) {
        sums[i] <== sums[i - 1] + nums[i];
    }

    sum <== sums[n - 1];
}

template ECDSAVerifyWithPubkeyCheck(n, k, pubkey_length) {
    signal input r[k];
    signal input s[k];
    signal input msghash[k];
    signal input pubkey[2][k];
    signal input pubkeylist[pubkey_length][2][k];
    signal output result;
    // verify if pubkey[2][k] in pubkeylist
    component comp_results[2][k];
    component eqs[pubkey_length][2][k];
    
    for(var j = 0; j < 2; j++){
        for(var l = 0; l < k; l++){
            comp_results[j][l] = CalculateTotal(pubkey_length);
            for(var i = 0; i < pubkey_length; i++){
                eqs[i][j][l] = IsEqual();
                eqs[i][j][l].in <== [pubkey[j][l], pubkeylist[i][j][l]];
                comp_results[j][l].nums[i] <== eqs[i][j][l].out * (pubkeylist[i][j][l] - pubkey[j][l]);
            }
        }
    }
    for(var i = 0; i < 2; i++){
        for(var j = 0; j < k; j++){
            comp_results[i][j].sum === 0;
        }
    }
    component ecdsa_verify = ECDSAVerifyNoPubkeyCheck(n, k);
    ecdsa_verify.r <== r;
    ecdsa_verify.s <== s;
    ecdsa_verify.msghash <== msghash;
    ecdsa_verify.pubkey <== pubkey;
    ecdsa_verify.result ==> result;
}
component main {public [msghash, pubkeylist]} = ECDSAVerifyWithPubkeyCheck(64, 4, 4);
