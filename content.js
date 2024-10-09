let audioContext;
let gainNode;
let source;
let bassNode;
let trebleNode;
let currentVolume = 1; // По умолчанию громкость 100%

// Инициализация аудиоконтекста и узлов, если они еще не созданы
function initializeAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        bassNode = audioContext.createBiquadFilter();
        trebleNode = audioContext.createBiquadFilter();

        bassNode.type = 'lowshelf';
        trebleNode.type = 'highshelf';

        // Найти элемент audio или video на странице
        const mediaElement = document.querySelector('audio, video');
        if (mediaElement) {
            source = audioContext.createMediaElementSource(mediaElement);
            source.connect(bassNode).connect(trebleNode).connect(gainNode).connect(audioContext.destination);
        }
    }
    // Установить текущий уровень громкости при инициализации аудио
    gainNode.gain.setValueAtTime(currentVolume, audioContext.currentTime);
}

// Применение стандартного звука
function applyDefaultSound() {
    initializeAudio();
    bassNode.frequency.setValueAtTime(100, audioContext.currentTime);
    bassNode.gain.setValueAtTime(0, audioContext.currentTime);
    trebleNode.frequency.setValueAtTime(3000, audioContext.currentTime);
    trebleNode.gain.setValueAtTime(0, audioContext.currentTime);
}

// Применение буста голоса
function applyVoiceBoost() {
    initializeAudio();
    bassNode.frequency.setValueAtTime(100, audioContext.currentTime);
    bassNode.gain.setValueAtTime(-10, audioContext.currentTime);   // Уменьшаем низкие частоты
    trebleNode.frequency.setValueAtTime(3000, audioContext.currentTime);
    trebleNode.gain.setValueAtTime(10, audioContext.currentTime);  // Усиливаем высокие частоты
}

// Применение бас-буста
function applyBassBoost() {
    initializeAudio();
    bassNode.frequency.setValueAtTime(100, audioContext.currentTime);
    bassNode.gain.setValueAtTime(15, audioContext.currentTime);   // Усиливаем низкие частоты
    trebleNode.frequency.setValueAtTime(3000, audioContext.currentTime);
    trebleNode.gain.setValueAtTime(-5, audioContext.currentTime);  // Немного уменьшаем высокие частоты
}

// Обработчик сообщений для изменения громкости
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setVolume") {
        currentVolume = request.volume / 100; // Сохраняем текущее значение громкости
        setVolume(request.volume);
    } else if (request.action === "checkVolume") {
        if (gainNode) {
            sendResponse({ volume: gainNode.gain.value * 100 });
        }
    } else if (request.action === 'default') {
        applyDefaultSound();
    } else if (request.action === 'voiceBoost') {
        applyVoiceBoost();
    } else if (request.action === 'bassBoost') {
        applyBassBoost();
    }
    sendResponse({ status: 'Action performed' });
});

// Установка громкости
function setVolume(volume) {
    if (!audioContext) {
        initializeAudio();
    }
    const gainValue = volume / 100;
    gainNode.gain.setValueAtTime(gainValue, audioContext.currentTime);
    currentVolume = gainValue; // Обновляем текущую громкость
}
