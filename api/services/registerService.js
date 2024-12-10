const { v4: uuidv4, parse } = require('uuid');
const userModel = require('../models/userModel');
const crypto = require('../utils/crypto')

const createUser = async (name, email) => {
    const userId = uuidv4();
    const userData = { name, email };
    await userModel.saveUser(userId, userData);
    let credentialOptions = await crypto.getCredentialOptions();
    const userIdBase64 = uuidToBase64(userId);
    credentialOptions.publicKey.user = {
        id: userIdBase64,
        name: email,
        displayName: name
    }

    console.log(credentialOptions.publicKey.user);

    return credentialOptions;
};

function uuidToBase64(uuid) {
    // Parse UUID to a Uint8Array (16 bytes)
    const bytes = parse(uuid);

    // Convert to Base64
    return Buffer.from(bytes).toString('base64');
}

module.exports = {
    createUser,
};