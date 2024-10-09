chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.onActivated.addListener((activeInfo) => {
        chrome.tabs.get(activeInfo.tabId, function (tab) {
            if (tab.status === 'complete' && (tab.url.startsWith('http') || tab.url.startsWith('https'))) {
                // Страница загружена полностью и это не внутренние страницы браузера
                chrome.tabs.sendMessage(activeInfo.tabId, { action: "checkVolume" });
            } else {
                // Если вкладка еще не загружена, ждем пока она завершит загрузку
                chrome.tabs.onUpdated.addListener(function onTabUpdated(tabId, changeInfo, updatedTab) {
                    if (tabId === activeInfo.tabId && changeInfo.status === 'complete') {
                        if (updatedTab.url.startsWith('http') || updatedTab.url.startsWith('https')) {
                            chrome.tabs.sendMessage(tabId, { action: "checkVolume" });
                        }
                        // После отправки сообщения отписываемся от события
                        chrome.tabs.onUpdated.removeListener(onTabUpdated);
                    }
                });
            }
        });
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'show' || request.action === 'hide') {
        // Переслать сообщение на текущую активную вкладку
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
                sendResponse({ status: 'Message forwarded to content script' });
            });
        });
        return true; // Асинхронный sendResponse
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (['default', 'voiceBoost', 'bassBoost'].includes(request.action)) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
                sendResponse({ status: 'Message forwarded to content script' });
            });
        });
        return true; // Асинхронный sendResponse
    }
});
