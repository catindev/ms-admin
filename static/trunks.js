const url = location.pathname;
(function() {
  const accountUrl = location.pathname.match(/\accounts\/[0-9]+/g).join("");
  const editTrunkForm = document.getElementById('editTrunkForm');
  const addTrunkForm = document.getElementById('addTrunkForm');
  const alertMessage = document.getElementById('alertMessage');
  const addTrunkBtn = document.querySelector('#addTrunkForm .btn');
  const addTrunkFieldset = addTrunkForm.querySelector('fieldset');
  const addTrunkFields = addTrunkForm.getElementsByTagName('input');
  const numberField = document.getElementById('phone');
  numberField.addEventListener('keyup', () => {
    numberField.value = numberField.value.replace(/\D/,'')
  });
  numberField.addEventListener('keydown',() => {
    numberField.value = numberField.value.replace(/\D/,'')
  });
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
        <div class="form-group">
        <input type="text" class="form-control" name="phone" value=${item.phone}>
        </div>
        <div class="form-group">
        <input type="tel" class="form-control" name="name" value=${item.name}>
        </div>
        <button onclick=clicked='edit' type="submit" class="btn btn-primary editBtn">
          Сохранить
        </button>
        <button onclick=clicked='delete' type="submit" class="btn btn-danger deleteBtn">
          Удалить
        </button>
        <small style='display:none' class="text-muted">
          Сохранено
        </small>
        </fieldset>
      </form>`
    });
  })
  .catch(error => showMessage('alert-danger',error.message,editTrunkForm))
  addTrunkBtn.disabled = true;
  addTrunkForm.addEventListener('input',function () {
    let empty;
    for (var i = 0; i < addTrunkFields.length; i++) {
      if (addTrunkFields[i].value === ''){
        empty = true;
      }
    }
    if (empty) return addTrunkBtn.disabled = true;
    return addTrunkBtn.disabled = false;
  })
  addTrunkForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    addTrunkFieldset.disabled = true;
    alertMessage.style.display = 'none';
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
        editTrunkForm.innerHTML =
        `<form onsubmit=checkBtn(this,event) id=${id} class="form-group edit-form">
          <fieldset>
          <div class="form-group">
          <input type="text" class="form-control" name="phone" value=${phone.value}>
          </div>
          <div class="form-group">
          <input type="tel" class="form-control" name="name" value=${name.value}>
          </div>
          <button onclick=clicked='edit' type="submit" class="btn btn-primary editBtn">
            Сохранить
          </button>
          <button onclick=clicked='delete' type="submit" class="btn btn-danger deleteBtn">
            Удалить
          </button>
          <small style='display:none' class="text-muted">
            Сохранено
          </small>
          </fieldset>
        </form>` + editTrunkForm.innerHTML;
        newTrunkForm = document.getElementById(id);
        newTrunkForm.classList.add('new-trunk');
        setTimeout(() => newTrunkForm.classList.remove('new-trunk'),400);
        let addingFields = addTrunkForm.getElementsByTagName('input');
        addTrunkFieldset.disabled = false;
        addTrunkBtn.disabled = true;
        for (var i = 0; i < addingFields.length; i++) {
          addingFields[i].value = '';
        }
      })
      .catch(error => {
        showMessage('alert-danger',error.message,addTrunkFieldset);
        error.fields.forEach((name) =>{
          let field = document.getElementById(name);
          field.parentElement.classList.add("has-error");
        })
      });
  });
})();
function checkBtn(form,event) {
  event.preventDefault();
  const saveMsgs = document.getElementsByClassName('text-muted');
  const editTrunkFieldset = form.querySelector('fieldset');
  const saveMsg = form.getElementsByClassName('text-muted')[0];
  alertMessage.style.display = 'none';
  form['phone'].parentElement.classList.remove('has-error');
  form['name'].parentElement.classList.remove('has-error');
  if (clicked === 'edit') {
    saveMsg.style.display = 'none';
    for (var i = 0; i < saveMsgs.length; i++) {
      saveMsgs[i].style.display = 'none';
    }
    const { phone,name } = form;
    const editBtn = form.querySelector('.editBtn');
    const body = {phone:phone.value, name:name.value};
    editTrunkFieldset.disabled = true;
    editBtn.innerHTML = 'Сохраняем...';
    fetch(Config.API_HOST + url + '/'+ form.id + "?user_session=" + userSession, {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.status !== 200) throw jsonResponse;
        return jsonResponse;
      })
      .then(response => {
        editTrunkFieldset.disabled = false;
        editBtn.innerHTML = 'Сохранить';
        saveMsg.style.display = 'inline-block';
      })
      .catch(error => {
        editBtn.innerHTML = 'Сохранить';
        showMessage('alert-danger',error.message,editTrunkFieldset);
        error.fields.forEach((name) =>{
          let field = form[name];
          field.parentElement.classList.add("has-error");
        })
      });

  }else if (clicked === 'delete') {
      if( confirm('Удалить транк?') ){
      const deleteBtn = form.querySelector('.deleteBtn');
      editTrunkFieldset.disabled = true;
      deleteBtn.innerHTML = 'Удаляем...';
      fetch(Config.API_HOST + url + '/'+ form.id + "?user_session=" + userSession, {
        method: "delete",
        headers: { "Content-type": "application/json" },
      })
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.status !== 200) throw jsonResponse;
          return jsonResponse;
        })
        .then(response => {
          deleteBtn.innerHTML = 'Удалить';
          editTrunkFieldset.classList.add('delete-trunk');
          setTimeout(() => form.style.display = 'none',400);
        })
        .catch(error => {
          deleteBtn.innerHTML = 'Удалить';
          showMessage('alert-danger',error.message,editTrunkFieldset);
        })}
        return false;
  };
};
function showMessage(messageType,message,fieldset) {
  fieldset.disabled = false;
  if (messageType === 'alert-success') {
    alertMessage.classList.remove('alert-danger');
    alertMessage.classList.add('alert-success');
    alertMessage.innerHTML = message;
    alertMessage.style.display = 'block';
  }else if (messageType === 'alert-danger') {
    alertMessage.classList.remove('alert-success');
    alertMessage.classList.add('alert-danger');
    alertMessage.innerHTML = message;
    alertMessage.style.display = 'block';
  }
};
