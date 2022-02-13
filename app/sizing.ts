let b = document.querySelector('body');

b.style.setProperty(
  '--height',
  `${window.innerHeight}px`
);

window.addEventListener(
  'resize',
  function () {
    b.style.setProperty(
      '--height',
      `${window.innerHeight}px`
    );
  }
)