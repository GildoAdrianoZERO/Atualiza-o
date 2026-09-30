// --- LÓGICA DO SANITIZADOR UNITÁRIO ---
const inputDoc = document.getElementById('docInput');
const outputDoc = document.getElementById('docOutput');

inputDoc.addEventListener('input', function(e) {
    // Atualizado para aceitar letras, cobrindo o novo CNPJ Alfanumérico e Chaves Municipais
    const cleanedValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    outputDoc.value = cleanedValue;
});


// --- LÓGICA DO EXTRATOR DE CHAVES EM MASSA (MULTI-PADRÃO) ---
const textInput = document.getElementById('textInput');
const keysOutput = document.getElementById('keysOutput');
const keyCount = document.getElementById('keyCount');

textInput.addEventListener('input', function(e) {
    const text = e.target.value;
    const foundKeys = [];
    
    // PASSO 1: Prepara o texto removendo o que não for letra ou número, juntando tudo.
    const allChars = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // PASSO 2: Extração de Chaves SEFAZ (NF-e, CT-e, NFC-e, MDF-e) -> 44 Caracteres
    // Regra Matemática: UF(2) + AAMM(4) + CNPJ(14 alfanum) + Mod(55,57,65) + Restante(22 num)
    const regex44 = /[1-5]\d\d{2}(?:0[1-9]|1[0-2])[A-Z0-9]{14}(?:5[5-9]|65)\d{22}/g;
    const matches44 = allChars.match(regex44) || [];
    foundKeys.push(...matches44);
    
    // PASSO 3: Extração de NFS-e Portal Nacional -> 50 Caracteres
    // Regra Matemática: Mun_IBGE(7) + Amb(1) + Insc(1) + CPF/CNPJ(14 alfanum) + Num(13) + AAMM(4) + Rest(10)
    const regex50 = /[1-5]\d{6}[12][12][A-Z0-9]{14}\d{13}\d{2}(?:0[1-9]|1[0-2])\d{10}/g;
    const matches50 = allChars.match(regex50) || [];
    foundKeys.push(...matches50);
    
    // PASSO 4: Extração de NFS-e Municipal (Chaves soltas)
    // Como não há um padrão único (cada município faz de um jeito), rastreamos
    // no texto ORIGINAL procurando por palavras isoladas que se assemelhem a uma chave.
    const regexMunicipal = /\b[A-Z0-9]{8,15}\b/gi;
    const matchesMun = text.match(regexMunicipal) || [];
    
    matchesMun.forEach(match => {
        const cleanMatch = match.toUpperCase();
        
        // Define uma potencial chave municipal se for alfanumérica (ex: SP)
        // Ou um código numérico entre 11 e 15 caracteres que não seja CPF ou CNPJ vazio
        const hasLetters = /[A-Z]/.test(cleanMatch);
        const hasNumbers = /[0-9]/.test(cleanMatch);
        
        if ((hasLetters && hasNumbers) || (!hasLetters && cleanMatch.length >= 11 && cleanMatch.length !== 14)) {
            // Garante que não é um "pedaço" de uma chave de 44 ou 50 que já capturamos
            const isPartOfNational = foundKeys.some(k => k.includes(cleanMatch));
            
            if (!isPartOfNational) {
                foundKeys.push(cleanMatch);
            }
        }
    });
    
    // Atualiza a interface
    if (foundKeys.length > 0) {
        // Remove duplicatas caso tenha colado a mesma chave
        const uniqueKeys = [...new Set(foundKeys)];
        
        keysOutput.value = uniqueKeys.join('\n');
        keyCount.innerText = uniqueKeys.length;
    } else {
        keysOutput.value = '';
        keyCount.innerText = '0';
    }
});


// --- FUNÇÃO GLOBAL DE COPIAR ---
function copyToClipboard(inputId, btnId) {
    const inputElement = document.getElementById(inputId);
    const btnElement = document.getElementById(btnId);
    const valueToCopy = inputElement.value;
    
    if (!valueToCopy) return;

    navigator.clipboard.writeText(valueToCopy).then(() => {
        const originalText = btnElement.innerText;
        btnElement.innerText = 'Copiado!';
        btnElement.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}