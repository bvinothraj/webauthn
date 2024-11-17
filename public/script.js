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
        const response = await fetch('http://localhost:3000/api/users/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (response.ok) {
            responseMessage.textContent = `User created successfully! ID: ${data.userId}`;
            registerForm.reset();
        } else {
            responseMessage.textContent = `Error: ${data.message}`;
        }
    } catch (error) {
        responseMessage.textContent = `Request failed: ${error.message}`;
    }
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
