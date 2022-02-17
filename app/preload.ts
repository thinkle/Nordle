for (let el of document.querySelectorAll(
  '.hide-while-load'
)) {
  console.log('Display',el)
  el.style.opacity = '1';
}

for (let el of document.querySelectorAll('.hide-after-load')) {
  console.log('Hide',el);
  el.style.display = 'none';
}