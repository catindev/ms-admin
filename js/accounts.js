document.body.style.backgroundColor='#fff';
let accounts = (function () {
  for (let id = 1; id <= 10; id++) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    accList.appendChild(li);
    a.href = '#'+id;
    a.classList.add('accounts__link');
    a.innerHTML = 'account{' + id + '}'
    li.appendChild(a);
  }
}());
