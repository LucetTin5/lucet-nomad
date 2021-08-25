const gridContainer = document.querySelector('.video__grid');
const currentTime = Date.now();

const box = () => {
  const gridBox = document.querySelector('.video__box');
  const created = gridBox.querySelector('#createdAt');
  const savedValue = created.innerText;
  console.log(savedValue, Date.now(savedValue));
  const timeInfo = gridBox.querySelector('#createdAgo');
};

box();
