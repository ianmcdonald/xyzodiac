function logoHider() {
  let logo = document.querySelector('.logo');

  function checkYPos() {
    if (window.pageYOffset > 70) {
      logo.style.opacity = '0';
      logo.style.marginTop = '-2em';
    } else {
      logo.style.opacity = '1';
      logo.style.marginTop = '1em';
    }
  }

  window.addEventListener('scroll', checkYPos);  
}

logoHider();
