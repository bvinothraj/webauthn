const crypto = require("crypto");

function generateChallenge() {
    return crypto.randomBytes(32).toString("base64");
}

const getCredentialOptions = async () => {
    const challenge = generateChallenge();
    return {
        publicKey: {
            challenge: challenge,
            rp: {
                name: "Passkey Demo",
                id: "localhost"
            },
            pubKeyCredParams: [
                {
                    "type": "public-key",
                    "alg": -7
                }
            ],
            timeout: 60000,
            attestation: "direct"
        }
    }
}

module.exports = {
    getCredentialOptions
}