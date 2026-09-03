// Seleciona os elementos do DOM
const inputDoc = document.getElementById('docInput');
const outputDoc = document.getElementById('docOutput');
const copyBtn = document.getElementById('copyBtn');

// Adiciona um ouvinte de evento para limpar o dado enquanto o usuário digita
inputDoc.addEventListener('input', function(e) {
    // A Regex /\D/g significa "encontre tudo que NÃO for número"
    // O replace substitui essas ocorrências por vazio ('')
    const cleanedValue = e.target.value.replace(/\D/g, '');
    
    // Atualiza o campo de resultado
    outputDoc.value = cleanedValue;
});

// Função para copiar o resultado para a área de transferência
function copyToClipboard() {
    const valueToCopy = outputDoc.value;
    
    if (!valueToCopy) return;

    // Utiliza a API moderna de Clipboard
    navigator.clipboard.writeText(valueToCopy).then(() => {
        // Feedback visual no botão
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copiado!';
        copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)'; // Fica verde
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.background = ''; // Volta ao gradiente original
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}