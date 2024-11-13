document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.previousElementSibling;
        if (input.type === "password") {
            input.type = "text";
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        } else {
            input.type = "password";
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        }
    });
});

const passwordForm = document.getElementById('passwordForm');
const submitButton = document.querySelector('.submit-button');

passwordForm.addEventListener('input', () => {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if new password meets the requirements
    const isLongEnough = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    // Enable submit button if all requirements are met and passwords match
    if (isLongEnough && hasUppercase && hasLowercase && hasNumber && hasSymbol && newPassword === confirmPassword) {
        submitButton.disabled = false;
        submitButton.classList.add('active');
    } else {
        submitButton.disabled = true;
        submitButton.classList.remove('active');
    }
});

