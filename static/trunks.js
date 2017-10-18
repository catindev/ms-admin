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
  const noTrunks = document.getElementById('noTrunks');

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
    if (items.length === 0 ) return noTrunks.style.display='block';
    items.forEach(item => {
        editTrunkForm.innerHTML +=
        `<fieldset>
          <form onsubmit=checkBtn(this,event) id=${item.id} class="form-row">
            <div class="col-auto">
            <input type="text" class="form-control" name="phone" value=${item.phone}>
            </div>
            <div class="col-auto">
            <input type="tel" class="form-control" name="name" value=${item.name}>
            </div>
            <div class='btns'>
            <button onclick=clicked='save' name='saveBtn' type="submit" class="btn btn-primary saveBtn">
              Сохранить
            </button>
            <button onclick=clicked='edit' name='editBtn' type="submit" class="btn btn-danger editBtn">
              Отключить
            </button>
            <p name='saveMsg' class="text-muted saveMsg">Сохранено</p>
            </div>
          </form>
          </fieldset>`

          let form = document.getElementById(item.id);
          let {phone,name,saveBtn,editBtn} = form;
          if (!item.active) {
            [phone,name,saveBtn].forEach((elem)=>elem.disabled = true);
            editBtn.innerHTML = 'Включить';
          }
    })
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
        noTrunks.style.display = 'none';
        const template =`
          <fieldset>
          <form onsubmit=checkBtn(this,event) id=${id} class="form-row">
            <div class="col-auto">
            <input disabled type="text" class="form-control" name="phone" value=${phone.value}>
            </div>
            <div class="col-auto">
            <input disabled type="tel" class="form-control" name="name" value=${name.value}>
            </div>
            <div class='btns'>
            <button disabled onclick=clicked='save' name='saveBtn' type="submit" class="btn btn-primary saveBtn">
              Сохранить
            </button>
            <button onclick=clicked='edit' name='editBtn' type="submit" class="btn btn-danger editBtn">
              Включить
            </button>
            <p name='saveMsg' class="text-muted saveMsg">Сохранено</p>
            </div>
          </form>
          </fieldset>`;
        editTrunkForm.insertAdjacentHTML('afterbegin',template);
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
  form['phone'].parentElement.classList.remove('has-error');
  form['name'].parentElement.classList.remove('has-error');
  event.preventDefault();
  const saveMsg = form.getElementsByClassName('text-muted')[0];
  const editTrunkFieldset = form.parentElement;
  const saveBtn = form.querySelector('.saveBtn');
  const editBtn = form.querySelector('.editBtn');

  alertMessage.style.display = 'none';

  if (clicked === 'save') {
    const saveMsgs = Array.from(document.getElementsByClassName('text-muted'));
    const { phone,name } = form;
    const body = JSON.stringify({phone:phone.value, name:name.value});

    saveMsgs.forEach( (item) => { item.style.opacity = 0 });
    editTrunkFieldset.disabled = true;
    saveBtn.innerHTML = 'Сохраняем...';

    requestOnEdit(saveBtn,saveBtn.innerHTML,body,editTrunkFieldset,form);

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

      requestOnEdit(editBtn,editBtn.innerHTML,body,editTrunkFieldset,form,active,[phone,name,saveBtn])
  };
};

function requestOnEdit(btn,btnTitle,body,fieldset,form,trunkStatus,elements) {
  const saveMsg = form.getElementsByClassName('text-muted')[0];
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
      if (btnTitle === 'Сохраняем...') {
        //Время за которое сообщение "Сохранено" исчезнет при пересохранении
        return setTimeout(() => {
          fieldset.disabled = false;
          saveMsg.style.opacity = 1;
          btn.innerHTML = 'Сохранить';
        },500);
      }else{
        saveMsg.style.opacity = 0;
        fieldset.disabled = false;
        if (trunkStatus){
          return btn.innerHTML = 'Отключить',
          elements.forEach((elem) => elem.disabled=false);
        }
        btn.innerHTML = 'Включить';
        elements.forEach((elem) => elem.disabled=true);
      }
    })
    .catch(error => {
      btnTitle === 'Cохнраняем...' ? btn.innerHTML = 'Сохранить' : btn.innerHTML = 'Включить';
      showMessage('alert-danger',error.message,fieldset);
    })
}

function showMessage(messageType,message,fieldset) {
  fieldset.disabled = false;
  if (messageType === 'alert-danger') {
    alertMessage.classList.remove('alert-success');
    alertMessage.classList.add('alert-danger');
    alertMessage.innerHTML = message;
    alertMessage.style.display = 'block';
  }
};
