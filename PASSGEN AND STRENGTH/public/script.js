document.getElementById('generateBtn').addEventListener('click', generatePassword);
document.getElementById('saveBtn').addEventListener('click', savePassword);

function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';

    const passwordLength = document.getElementById('passwordLength').value || 12;  // Default length is 12 if none is provided

    for (let i = 0; i < passwordLength; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById('password').value = password;

    // Check and display password strength
    const strength = checkPasswordStrength(password);
    document.getElementById('strengthValue').textContent = strength;
}

function checkPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W]/.test(password)) strength++;

    if (strength <= 1) {
        return 'Weak';
    } else if (strength === 2) {
        return 'Medium';
    } else if (strength >= 3) {
        return 'Strong';
    } else {
        return 'N/A';
    }
}

function savePassword() {
    const password = document.getElementById('password').value;
    const strength = document.getElementById('strengthValue').textContent;

    if (password) {
        fetch('/save-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password, strength: strength }),
        })
        .then(response => response.json())
        .then(data => {
            alert('Password saved!');
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Generate a password first!');
    }
}
