const form = document.querySelector('form');
const chatElement = document.querySelector('.chat');
const API_URL = 'http://localhost:4000/chat';

listAll();

form.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const formData = new FormData(form);
	const name = formData.get('name');
	const comment = formData.get('comment');

	const chat = {
		name,
		comment,
	};

	fetch(API_URL, {
		method: 'POST',
		body: JSON.stringify(chat),
		headers: {
			'content-type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((res) => {
			form.reset();
			setTimeout(() => {
				form.style.display = '';
			}, 30000);
			listAll();
		});
});

function listAll() {
	fetch(API_URL)
		.then((response) => response.json())
		.then((chat) => {
			chat.reverse();
            console.log(`chat : ${JSON.stringify(chat)}`);
            chatElement.innerHTML = '';
			chat.forEach((msg) => {
				const div = document.createElement('div');

				const header = document.createElement('h3');
				header.textContent = msg.name;

				const contents = document.createElement('p');
				contents.textContent = msg.comment;

				const date = document.createElement('small');
				date.textContent = new Date(msg.createdDate);

				div.appendChild(header);
				div.appendChild(contents);
				div.appendChild(date);
				chatElement.appendChild(div);
			});
		});
}
