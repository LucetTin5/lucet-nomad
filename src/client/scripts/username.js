const username = document.getElementById('username');
const generator = document.getElementById('usernameGenerator');

let count = 0;

const genUsername = () => {
  if (count === 5) {
    generator.disabled = true;
    generator.innerText = 'Generator Terminated';
    generator.removeEventListener('click', genUsername);
  }
  username.value = 'Random_' + Date.now().valueOf().toString().substr(0, 8);
  count += 1;
};

generator.addEventListener('click', genUsername);
