(function() {
  const url = location.pathname;
  const accountUrl = location.pathname.match(/\accounts\/[0-9]+/g).join("");
  const editTrunkForm = document.getElementById('editTrunkForm');
  const addTrunkForm = document.getElementById('addTrunkForm');
  const editTrunkMessage = document.getElementById('editTrunkMessage');
  const addTrunkMessage = document.getElementById('addTrunkMessage');
  const newTrunkBtn = document.querySelector('#addTrunkForm .btn');
  const addTrunkFieldset = addTrunkForm.querySelector('fieldset');
  let clicked = '';
  fetch(Config.API_HOST + url + "?user_session=" + userSession)
  .then(response => response.json())
  .then(jsonResponse => {
    if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
    return jsonResponse;
  })
  .then(({items}) => {
    items.forEach(item => {
      editTrunkForm.innerHTML +=
      `<form onsubmit=checkBtn(this,event) id=${item.id} class="form-group edit-form">
        <fieldset>
        <input type="text" class="form-control" name="phone" value=${item.phone}>
        <input type="tel" class="form-control" name="name" value=${item.name}>
        <button onclick=clicked='edit' type="submit" class="btn btn-primary editBtn">
          Изменить
        </button>
        <button onclick=clicked='delete' type="submit" class="btn btn-danger deleteBtn">
          Удалить
        </button>
        </fieldset>
      </form>`
    });
  })
  .catch(error => {
    editTrunkMessage.innerHTML = error.message;
    editTrunkMessage.classList.add('alert-danger');
    editTrunkMessage.style.display = 'block';
  })
  addTrunkForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    addTrunkFieldset.disabled = true;
    addTrunkMessage.style.display = 'none';
    const { phone,name } = addTrunkForm;
    addTrunkForm.phone.parentElement.classList.remove('has-error');
    addTrunkForm.name.parentElement.classList.remove('has-error');
    const body = JSON.stringify({ phone: phone.value, name:name.value });
    fetch(Config.API_HOST + url+"?user_session=" + userSession,{
      method: "post",
      headers: { "Content-type": "application/json" },
      body
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.status !== 200) throw jsonResponse;
        return jsonResponse;
      })
      .then(({id}) => {
        addTrunkFieldset.disabled = false;
        addTrunkMessage.classList.remove('alert-danger');
        addTrunkMessage.classList.add('alert-success');
        addTrunkMessage.innerHTML = 'Транк добвален';
        addTrunkMessage.style.display = 'block';
        editTrunkForm.innerHTML +=
        `<form onsubmit=checkBtn(this,event) id=${id} class="form-group edit-form">
          <input type="text" class="form-control" name="phone" value=${phone.value}>
          <input type="tel" class="form-control" name="name" value=${name.value}>
          <button onclick=clicked='edit' type="submit" class="btn btn-primary editBtn">
            Изменить
          </button>
          <button onclick=clicked='delete' type="submit" class="btn btn-danger deleteBtn">
            Удалить
          </button>
        </form>`

      })
      .catch(error => {
        addTrunkFieldset.disabled = false;
        addTrunkMessage.classList.remove('alert-success');
        addTrunkMessage.classList.add('alert-danger');
        addTrunkMessage.innerHTML = error.message;
        addTrunkMessage.style.display = 'block';
        error.fields.forEach((name) =>{
          let field = document.getElementById(name);
          field.parentElement.classList.add("has-error");
        })
      });
  });
})();
function checkBtn(form,event) {
  event.preventDefault();
  if (clicked === 'edit') {
      alert('изменить транк ' + form.id)
  }else if (clicked === 'delete') {
      alert('удалить транк ' + form.id)
  }
}
