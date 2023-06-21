const crypto = require('crypto');
const { pem2jwk } = require('pem-jwk');

function generateRSAKeyPair() {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    }, (error, publicKey, privateKey) => {
      if (error) {
        reject(error);
      } else {
        resolve({ publicKey, privateKey });
      }
    });
  });
}

function extractModulusAndExponent(publicKey) {
  const jwk = pem2jwk(publicKey);
  const modulus = Buffer.from(jwk.n, 'base64').toString('hex');
  const exponent = Buffer.from(jwk.e, 'base64').toString('hex');
  return { modulus, exponent };
}

async function generateAndExtractRSAKeys() {
  try {
    // Generate the RSA key pair
    const rsaKeys = await generateRSAKeyPair();

    // Extract the modulus (N) and public exponent (E)
    const { modulus, exponent } = extractModulusAndExponent(rsaKeys.publicKey);

    // Output the keys, modulus, and exponent
    console.log('Public Key:\n', rsaKeys.publicKey);
    console.log('Private Key:\n', rsaKeys.privateKey);
    console.log('Modulus (N):\n', modulus);
    console.log('Exponent (E):\n', exponent);
  } catch (error) {
    console.error('Error generating RSA keys:', error);
  }
}

// Generate and extract the RSA keys
generateAndExtractRSAKeys();
