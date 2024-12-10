// script.js

const registerForm = document.getElementById('register')
registerForm.addEventListener('submit', async (event) => {
    console.log("Creating passkey...");
    //createCredential();
    register(event);
});

async function register(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const requestData = { name, email };

    try {
        const response = await fetch('/api/v1/register/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        const credentialOptions = await response.json();

        if (response.ok) {
            responseMessage.textContent = `User created successfully! ID: ${credentialOptions.publicKey.user.id}`;
            registerForm.reset();
            await confirmRegister(credentialOptions);
        } else {
            responseMessage.textContent = `Error: ${data.message}`;
        }
    } catch (error) {
        responseMessage.textContent = `Request failed: ${error.message}`;
    }
}

async function confirmRegister(credentialOptions) {

    let options = credentialOptions;
    options.publicKey.challenge = await base64ToArrayBuffer(credentialOptions.publicKey.challenge);
    options.publicKey.user.id = await base64ToArrayBuffer(credentialOptions.publicKey.user.id);
    const credential = await navigator.credentials.create(credentialOptions);

    const attestationObject = credential.response.attestationObject;
    const clientDataJSON = credential.response.clientDataJSON;
    const challenge = credentialOptions.publicKey.challenge;

    const completeResponse = await fetch('/api/v1/register/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            attestationObject: attestationObject,
            clientDataJSON: clientDataJSON,
            challenge: challenge
        })
    });

    const result = await completeResponse.json();
    if (result.success) {
        alert('Registration successful!');
    } else {
        alert('Registration failed: ' + result.error);
    }
}

async function base64ToArrayBuffer(base64) {
    // Decode Base64 to a Uint8Array
    const binaryString = atob(base64);
    const uint8Array = Uint8Array.from(binaryString, char => char.charCodeAt(0));

    // If you want to work with the ArrayBuffer directly:
    return uint8Array.buffer;
}

async function createCredental() {
    try {
        // Generate the public key credential creation options
        const publicKey = {
            challenge: new Uint8Array(32), // Example challenge, replace with server-generated
            rp: {
                name: "Passkey Demo" // Replace with your app/website name
            },
            user: {
                id: new Uint8Array(16), // Unique user ID from server
                name: "demo@passkey.com", // Replace with actual user's email
                displayName: "PassKey Demo User"
            },
            pubKeyCredParams: [
                {
                    type: "public-key",
                    alg: -7 // ECDSA with SHA-256 (common algorithm for WebAuthn)
                }
            ],
            authenticatorSelection: {
                authenticatorAttachment: "platform", // Use device's secure key storage (Keychain, Windows Hello)
                residentKey: "preferred",
                userVerification: "required"
            },
            timeout: 60000 // Timeout after 60 seconds
        };

        const credential = await navigator.credentials.create({ publicKey });

        if (credential) {
            console.log("Credential created successfully:", credential);

            // Send the public key and data to the server to complete registration
            await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: credential.id,
                    rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
                    type: credential.type,
                    response: {
                        attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
                        clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON)))
                    }
                })
            });

            alert('Passkey created and stored on the device successfully!');
        }
    } catch (err) {
        console.error('Error during passkey creation:', err);
        alert('Failed to create passkey');
    }
}
