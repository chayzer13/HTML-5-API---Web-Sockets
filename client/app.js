const apiBase = 'https://jsonplaceholder.typicode.com';

async function fetchData() {
  const select = document.getElementById('data-select');
  const dataType = select.value;
  const dataList = document.getElementById('data-list');
  
  const loadingMessage = document.createElement('li');
  loadingMessage.textContent = 'Загрузка данных...';
  dataList.innerHTML = ''; 
  dataList.appendChild(loadingMessage);

  try {
    const response = await fetch(`${apiBase}/${dataType}`);
    const data = await response.json();

    dataList.innerHTML = '';
    
    if (data.length === 0) {
      const noDataMessage = document.createElement('li');
      noDataMessage.textContent = 'Нет данных для отображения';
      dataList.appendChild(noDataMessage);
    } else {
      data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = dataType === 'users' ? item.name : item.title;
        dataList.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    loadingMessage.textContent = 'Ошибка при загрузке данных';
  }
}

const socket = new WebSocket('ws://localhost:3000/chat');

socket.onopen = () => {
  console.log('WebSocket соединение установлено');
};

socket.onmessage = (event) => {
  const messagesList = document.getElementById('messages');
  const message = document.createElement('li');
  message.textContent = `Сервер: ${event.data}`;
  messagesList.appendChild(message);
};

socket.onerror = (error) => {
  console.error('Ошибка WebSocket:', error);
  const messagesList = document.getElementById('messages');
  const errorMessage = document.createElement('li');
  errorMessage.textContent = 'Ошибка соединения с сервером';
  messagesList.appendChild(errorMessage);
};

function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value;
  
  if (message) {
    try {
      socket.send(message);
      const messagesList = document.getElementById('messages');
      const messageElement = document.createElement('li');
      messageElement.textContent = `Вы: ${message}`;
      messagesList.appendChild(messageElement);
      input.value = '';
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      const messagesList = document.getElementById('messages');
      const errorMessage = document.createElement('li');
      errorMessage.textContent = 'Ошибка при отправке сообщения';
      messagesList.appendChild(errorMessage);
    }
  }
}

socket.onclose = () => {
  console.log('WebSocket соединение закрыто');
  const messagesList = document.getElementById('messages');
  const closeMessage = document.createElement('li');
  closeMessage.textContent = 'Соединение с сервером закрыто';
  messagesList.appendChild(closeMessage);
};

const eventSource = new EventSource('http://localhost:3000/events');

eventSource.onopen = () => {
  console.log('SSE соединение установлено');
};

eventSource.onmessage = (event) => {
  const updatesList = document.getElementById('sse-updates');
  const updateItem = document.createElement('li');
  try {
    const data = JSON.parse(event.data);
    updateItem.textContent = `Новый пост: ${data.title}`;
  } catch (e) {
    console.error('Ошибка при разборе данных SSE:', e);
    updateItem.textContent = 'Ошибка данных';
  }
  updatesList.appendChild(updateItem);
};

eventSource.onerror = (error) => {
  console.error('Ошибка SSE:', error);
  const updatesList = document.getElementById('sse-updates');
  const errorMessage = document.createElement('li');
  errorMessage.textContent = 'Не удалось получить обновления от сервера';
  updatesList.appendChild(errorMessage);
  eventSource.close(); 
};

eventSource.onclose = () => {
  console.log('SSE соединение закрыто');
  const updatesList = document.getElementById('sse-updates');
  const closeMessage = document.createElement('li');
  closeMessage.textContent = 'Соединение с сервером SSE закрыто';
  updatesList.appendChild(closeMessage);
};
