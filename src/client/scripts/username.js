const username = document.getElementById('username');
const generator = document.getElementById('usernameGenerator');

let count = 0;

const genUsername = () => {
  username.value = 'Random_' + Date.now().valueOf().toString().substr(0, 8);
  generator.remove();
};
generator.addEventListener('click', genUsername);
