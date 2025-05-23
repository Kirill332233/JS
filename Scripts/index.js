let abc = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
           'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function encryptText() {
    let inputText = document.getElementById('inputText').value;
    let outputText = '';
    let put = document.getElementById('put');
    
    put.innerHTML = '<div class="history-title">История шифрования:</div><div class="history-container"></div>';
    let historyContainer = put.querySelector('.history-container');
    
    for (let i = 0; i < inputText.length; i++) {
        let char = inputText[i];
        let position = abc.indexOf(char.toUpperCase());
        let isUpperCase = position !== -1 && char === char.toUpperCase();
        let logEntry = document.createElement('div');
        logEntry.className = 'history-step';
        
        if (position !== -1) {
            let newPosition = (position + 13) % 26;
            let resultChar = isUpperCase ? abc[newPosition] : abc[newPosition].toLowerCase();
            outputText += resultChar;
            
            logEntry.innerHTML = `
                <span class="original-char">"${char}"</span>
                <span class="arrow">→</span>
                <span class="result-char">"${resultChar}"</span>
            `;
        } else {
            outputText += char;
            logEntry.innerHTML = `
                <span class="original-char">"${char}"</span>
                <span class="arrow">→</span>
                <span class="not-changed">не изменён</span>
            `;
        }
        
        historyContainer.appendChild(logEntry);
    }
    
    document.getElementById('outputText').value = outputText;
    document.querySelector('.sidebar').classList.remove('hide');
}

document.getElementById('encryptBtn').addEventListener('click', encryptText);

document.querySelector('.info-btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('hide');
});

document.querySelector('.toggle-btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.add('hide');
});