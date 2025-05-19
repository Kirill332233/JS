let abc = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
           'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function obrabotka(sdvig) {
    let vvod = document.getElementById('inputText').value;
    let vivod = '';
    let processLog = document.getElementById('processLog');
    processLog.innerHTML = '';
    
    for (let a = 0; a < vvod.length; a++) {
        let simvol = vvod[a];
        let zaglav = false;
        let poz = -1;
        
        for (let i = 0; i < abc.length; i++) {
            if (simvol === abc[i]) {
                zaglav = true;
                poz = i;
                break;
            }
        }
        
        if (poz === -1) {
            for (let i = 0; i < abc.length; i++) {
                if (simvol === abc[i].toLowerCase()) {
                    poz = i;
                    break;
                }
            }
        }
        
        let logEntry = document.createElement('div');
        logEntry.className = 'process-step';
        
        if (poz !== -1) {
            let novPoz = (poz + sdvig + 26) % 26;
            let resultChar = zaglav ? abc[novPoz] : abc[novPoz].toLowerCase();
            vivod += resultChar;
            
            logEntry.innerHTML = `
                <span class="original-char">${simvol}</span>
                <span class="arrow">→</span>
                <span class="result-char">${resultChar}</span>
            `;
        } else {
            vivod += simvol;
            logEntry.innerHTML = `
                <span class="original-char">${simvol}</span>
                <span class="arrow">→</span>
                <span class="not-changed">не изменён</span>
            `;
        }
        
        processLog.appendChild(logEntry);
    }
    
    document.getElementById('outputText').value = vivod;
    processLog.scrollTop = processLog.scrollHeight;
}

document.getElementById('encryptBtn').addEventListener('click', () => obrabotka(13));
