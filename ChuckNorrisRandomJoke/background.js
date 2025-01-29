chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {

        function b64DecodeUnicode(str) {
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }

        fetch('https://api.github.com/repos/dxandre/ChuckBase/contents/facts.json')
            .then(response => response.json())
            .then(data => {

                var encodedContent = data.content;
                var decodedContent = b64DecodeUnicode(encodedContent);
                var facts = JSON.parse(decodedContent);
                var randomFact = facts[Math.floor(Math.random() * facts.length)].fact;

                chrome.storage.local.set({ 'joke': randomFact }, function () {
                    console.log('Text is saved in local storage');
                });
            })
            .catch(error => {
                console.error('Error fetching the JSON file:', error);
            });

    }
});

chrome.alarms.create("fetchJoke", { periodInMinutes: 27 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "fetchJoke") {

        function b64DecodeUnicode(str) {
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }

        fetch('https://api.github.com/repos/dxandre/ChuckBase/contents/facts.json')
            .then(response => response.json())
            .then(data => {

                var encodedContent = data.content;
                var decodedContent = b64DecodeUnicode(encodedContent);
                var facts = JSON.parse(decodedContent);
                var randomFact = facts[Math.floor(Math.random() * facts.length)].fact;

                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'Fact',
                    message: randomFact
                });

                chrome.storage.local.set({ 'joke': randomFact }, function () {
                    console.log('Text is saved in local storage');
                });

                updateBadge();
            })
            .catch(error => {
                console.error('Error fetching the JSON file:', error);
            });
    }
})

function updateBadge() {
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    chrome.action.setBadgeText({ text: '1' });
    chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
}