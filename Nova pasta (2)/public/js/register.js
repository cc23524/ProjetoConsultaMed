document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cpf').addEventListener('input', cpfFormat);
    document.getElementById('password').addEventListener('input', checkPasswords);
    document.getElementById('password-confirm').addEventListener('input', checkPasswords);
    document.getElementById('nickname').addEventListener('input', checkNicknameExists);

    async function checkNicknameExists() {
        let nickname = document.getElementById('nickname').value;
        const messageElement = document.getElementById('nickname-message');
    
        if (!nickname) {
            messageElement.textContent = '';
            messageElement.style.color = 'initial';
            return;
        }
    
        let response = await fetch(`/checkNickname?nickname=${nickname}`);
        let data = await response.json();
    
        messageElement.textContent = data.message;
        messageElement.style.color = data.message === "Usuário disponível!" ? 'green' : 'red';
    }
    
    
    function cpfFormat(e) {
        var target = e.target;
        var value = target.value.replace(/\D/g, '');
    
        if (value.length <= 3) {} else if (value.length <= 6) {
            value = value.replace(/^(\d{3})(\d{0,3})/, "$1.$2");
        } else if (value.length <= 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
        } else {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
        }
    
        var newPosition = value.length;
    
        if (target.selectionEnd < newPosition) {
            if (newPosition === 4 || newPosition === 8 || newPosition === 12) newPosition--;
        }
    
        target.value = value;
        target.setSelectionRange(newPosition, newPosition);
    }

    function checkPasswords() {
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('password-confirm').value;
        var message = document.getElementById('password-message');
    
        if (!password && !confirmPassword) {
            message.textContent = "";
            return;
        }
    
        if (password !== confirmPassword) {
            message.textContent = "As senhas não conferem!";
            message.style.color = 'red';
            message.style.fontSize = "13";
        } else {
            message.textContent = "As senhas conferem!";
            message.style.color = 'green';
            message.style.fontSize = "13";
        }
    }
});
