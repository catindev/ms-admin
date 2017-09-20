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
    if (items.length === 0 ) return editTrunkForm.innerHTML = `<p class='noTrunks'>Транков нет</p>`;
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
        <button onclick=clicked='save' name=saveBtn type="submit" class="btn btn-primary saveBtn">
          Сохранить
        </button>
        <button onclick=clicked='edit' name=editBtn type="submit" class="btn btn-danger editBtn">
          Отключить
        </button>
        </fieldset>
      </form>`;
      let form = document.getElementById(item.id);
      let {phone,name,saveBtn,editBtn} = form;
      if (!item.active) {
        [phone,name,saveBtn].forEach((elem)=>elem.disabled = true);
        editBtn.innerHTML = 'Включить';
      }
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
          <input disabled type="text" class="form-control" name="phone" value=${phone.value}>
          </div>
          <div class="form-group">
          <input disabled type="tel" class="form-control" name="name" value=${name.value}>
          </div>
          <button disabled onclick=clicked='save' name='saveBtn' type="submit" class="btn btn-primary saveBtn">
            Сохранить
          </button>
          <button onclick=clicked='edit' name='editBtn' type="submit" class="btn btn-danger editBtn">
            Включить
          </button>
          </fieldset>
        </form>` + editTrunkForm.innerHTML;
        let newTrunkForm = document.getElementById(id);
        let addingFields = addTrunkForm.getElementsByTagName('input');
        newTrunkForm.classList.add('new-trunk');
        setTimeout(() => newTrunkForm.classList.remove('new-trunk'),400);
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
  const saveMsg = document.getElementsByName('saveMsg')[0];
  const editTrunkFieldset = form.querySelector('fieldset');
  const saveBtn = form.querySelector('.saveBtn');
  const editBtn = form.querySelector('.editBtn');
  alertMessage.style.display = 'none';
  form['phone'].parentElement.classList.remove('has-error');
  form['name'].parentElement.classList.remove('has-error');
  if (clicked === 'save') {
    const { phone,name } = form;
    const body = JSON.stringify({phone:phone.value, name:name.value});
    editTrunkFieldset.disabled = true;
    saveBtn.innerHTML = 'Сохраняем...';
    fetch(Config.API_HOST + url + '/'+ form.id + "?user_session=" + userSession, {
      method: "put",
      headers: { "Content-type": "application/json" },
      body
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.status !== 200) throw jsonResponse;
        return jsonResponse;
      })
      .then(response => {
        if (saveMsg) {
          saveMsg.classList.add('saveMsg');
          //Время за которое сообщение "Сохранено" исчезнет при пересохранении
          setTimeout(() => {
            editTrunkFieldset.disabled = false;
            saveBtn.innerHTML = 'Сохранить';
            saveMsg.parentNode.removeChild(saveMsg);
            editTrunkFieldset.innerHTML +=
            `<small name='saveMsg' class="text-muted">Сохранено</small>`
          },500);
        }else {
            saveBtn.innerHTML = 'Сохранить';
            editTrunkFieldset.disabled = false;
            editTrunkFieldset.innerHTML +=
            `<small name='saveMsg' class="text-muted">Сохранено</small>`;
          }
      })

      .catch(error => {
        saveBtn.innerHTML = 'Сохранить';
        showMessage('alert-danger',error.message,editTrunkFieldset);
        error.fields.forEach((name) =>{
          let field = form[name];
          field.parentElement.classList.add("has-error");
        })
      });

  }else if (clicked === 'edit') {
      const { phone,name,saveBtn } = form;
      let active;
      editTrunkFieldset.disabled = true;
      if (editBtn.innerHTML.trim() === 'Включить'){
        editBtn.innerHTML = 'Включаем...';
        active = true;
      }else{
        editBtn.innerHTML = 'Отключаем...';
        active = false;
      }
      const body = JSON.stringify({active});
      fetch(Config.API_HOST + url + '/'+ form.id + "?user_session=" + userSession, {
        method: "put",
        headers: { "Content-type": "application/json" },
        body
      })
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.status !== 200) throw jsonResponse;
          return jsonResponse;
        })
        .then(response => {
          editTrunkFieldset.disabled = false;
          let msg = form.querySelector('small');
          if (msg) {msg.parentNode.removeChild(msg)};
          if (editBtn.innerHTML === 'Включаем...'){
            return editBtn.innerHTML = 'Отключить',
                   [phone,name,saveBtn].forEach((elem) => elem.disabled=false);
          }
          editBtn.innerHTML = 'Включить';
          [phone,name,saveBtn].forEach((elem) => elem.disabled=true);
        })
        .catch(error => {
          editBtn.innerHTML = 'Включить';
          showMessage('alert-danger',error.message,editTrunkFieldset);
        })
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
