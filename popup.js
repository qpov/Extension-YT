const volumeSlider = document.getElementById('volumeSlider');
const volumeText = document.querySelector('.volume p');

// Сброс громкости до 100%
document.getElementById('reset').addEventListener('click', () => {
    volumeSlider.value = 100;
    updateVolume(100);
});

// Функция, которая срабатывает при изменении значения ползунка громкости
volumeSlider.addEventListener('input', function () {
    const volume = volumeSlider.value;
    updateVolume(volume);
});

function updateVolume(volume) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "setVolume", volume: volume });
    });
    volumeText.textContent = `Volume: ${volume}%`;
}

// Показать правую панель
document.getElementById('show').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'show' });
});

// Скрыть правую панель
document.getElementById('hide').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'hide' });
});

// Стандартный звук
document.getElementById('default').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'default' });
});

// Буст голоса
document.getElementById('voiceBoost').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'voiceBoost' });
});

// Бас-буст
document.getElementById('bassBoost').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'bassBoost' });
});

// Применить к активной вкладке
document.getElementById('selected').addEventListener('click', () => {
});

// Применить ко всем вкладкам
document.getElementById('all').addEventListener('click', () => {
});