// Define the URL for the WhatsApp API
const url = 'http://localhost:3000/sendMessage';

// Define the payload with the chat ID, message text, and session
const payload = {
    chatId: '919518364304@c.us',
    text: 'Hi there! Testing...',
    session: 'default'
};

// Send the POST request to the API
fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
})
.catch((error) => {
    console.error('Error:', error);
});
