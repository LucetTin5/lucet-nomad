import '../scss/styles.scss';
import '../images/user.svg';
import '../images/thumb.png';
import '../images/comment.svg';

const pageTitle = document.title.split('|')[0].split(' ')[0];

if (pageTitle === 'Watch') {
  document.querySelector('main').setAttribute('style', 'padding-right: 30%');
}
