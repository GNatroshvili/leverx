// here importing SCSS styles for settings page
import '../../styles/scss/reset.scss';
import '../../styles/scss/layout.scss';
import '../../styles/scss/header.scss';
import '../../styles/scss/settings.scss';

console.log('Settings page loaded');

// redirect to main page when Address Book button is clicked
const addressBookBtn = document.querySelector('.header-options-wrapper .page-title:nth-child(1)');
if (addressBookBtn) {
  addressBookBtn.addEventListener('click', () => {
    window.location.href = 'main.html';
  });
}
