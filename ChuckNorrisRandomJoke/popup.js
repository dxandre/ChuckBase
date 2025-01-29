document.addEventListener('DOMContentLoaded', function () {

    chrome.storage.local.get('joke', function (data) {

        if (data.joke)
            document.getElementById('joke').innerText = data.joke;
        else
            document.getElementById('joke').innerText = 'No text saved yet.';

        chrome.action.setBadgeText({ text: '' });

    });
});

document.getElementById('addYoursBtn').addEventListener('click', function () {
    document.getElementById('factInput').placeholder = 'must be a fact...  ツ';
    var div = document.getElementById('factForm');
    if (div.style.display === 'none' || div.style.display === '') {
        div.style.display = 'block';
    } else {
        div.style.display = 'none';
    }
});

document.getElementById('submitBtn').addEventListener('click', () => {
    const factInput = document.getElementById('factInput').value;
    const token = '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';

    function containsReadableText(text) {
        var alphabeticCharacterPattern = /[A-Za-zΑ-Ωα-ω]/;
        return alphabeticCharacterPattern.test(text);
    }

    if (factInput === 'ChuckNorris'
        || factInput === ''
        || factInput.length < 11
        || !factInput.replace(/\s/g, '').length
        || !containsReadableText(factInput)) {
        document.getElementById('factInput').placeholder = 'too short to be true... ツ';
        document.getElementById('factInput').value = '';
    } else {
        submitFactToGitHub(factInput, token);
    }


});

function submitFactToGitHub(fact, token) {
    const repo = 'dxandre/ChuckBase';
    const path = 'db.json';
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.content) {
                try {
                    const decodedContent = new TextDecoder("utf-8").decode(Uint8Array.from(atob(data.content), c => c.charCodeAt(0)));
                    const content = JSON.parse(decodedContent);
                    content.push({ fact: fact });

                    const updatedContent = btoa(String.fromCharCode.apply(null, new TextEncoder().encode(JSON.stringify(content, null, 2))));
                    fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `token ${token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        },
                        body: JSON.stringify({
                            message: 'Add new fact',
                            content: updatedContent,
                            sha: data.sha
                        })
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok ' + response.statusText);
                            }
                            return response.json();
                        })
                        .then(result => {
                            document.getElementById('factInput').value = '';
                            document.getElementById('factForm').style.display = 'none';
                            document.getElementById('factInput').placeholder = 'must be a fact...  ツ';
                            console.log('Fact added successfully:', result);
                        })
                        .catch(error => {
                            console.error('Error updating file:', error);
                        });
                } catch (error) {
                    console.error('Error parsing JSON content:', error);
                }
            } else {
                console.error('Content field is missing in the API response. Full response:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching file:', error);
        });
}