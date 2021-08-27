const form = document.querySelector('form');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const pwChecker = document.getElementById('pwSameChecker');

const emailChecker = document.getElementById('emailChecker');
const emailInput = document.getElementById('email');

const checkAvailability = async () => {
  emailChecker.disabled = true;
  try {
    const email = emailInput.value;
    console.log(email);
    const params = new URLSearchParams({ email }).toString();
    const res = await fetch(`/api/valid-email?${params}`);
    if (res.status === 200) {
      emailChecker.innerText = 'You can use it';
    }
    if (res.status === 400) {
      emailChecker.innerText = 'Try another One';
      emailChecker.disabled = false;
      emailInput.value = '';
    }
  } catch (err) {
    console.log(err);
  }
};
const checkSameness = (event) => {
  const {
    target: { value },
  } = event;
  if (password.value !== value) {
    pwChecker.innerText = 'cancel';
    pwChecker.style.color = '#d50000';
  } else {
    pwChecker.style.color = '#00e676';
    pwChecker.innerText = 'check_circle_outline';
    pwChecker.classList.add('matched');
  }
};
emailChecker.addEventListener('click', checkAvailability);
password2.addEventListener('input', checkSameness);
