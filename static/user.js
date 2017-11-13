const url = location.pathname;
(function() {
    const username = document.getElementById("username");
    const alertMessage = document.getElementById("alertMessage");
    const numMessage = document.getElementById('numMessage');
    const userForm = document.getElementById("userForm");
    const saveBtn = document.querySelector("#userForm .btn");
    const fieldset = document.querySelector("#userForm fieldset");
    const textarea = document.getElementById('textarea');
    const alertPassword = document.getElementById('alertPassword');
    const addNumForm = document.getElementById('addNumForm');
    const { phone } = addNumForm;

    addBtn.disabled = true;

    phone.addEventListener('keydown', () => {
      phone.value = phone.value.replace(/\D/,'');
    });

    phone.addEventListener('keyup', () => {
      phone.value = phone.value.replace(/\D/,'');
    });

    phone.addEventListener('input', () => {
      if (phone.value.length <= 1) {
        return addBtn.disabled = true;
      }else {
        return addBtn.disabled = false;
      }
    })

    fetch(Config.API_HOST + url + "?session_token=" + userSession)
        .then(response => response.json())
        .then(jsonResponse => {
            if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
            return jsonResponse;
        })
        .then(userData => {
            username.innerHTML = userData.name;
            if (userData.phones.length > 0) {
              noNumbers.style.display = 'none';
              userData.phones.forEach(phone => {
                insertNumber(phone);
              })
            }
            for (key in userData) {
                let fields = document.getElementsByName(key);
                for (var i = 0; i < fields.length; i++) {
                   if (key === "type") {
                        fields[i].querySelector(
                            `option[value=${userData[key]}]`
                        ).selected = true;
                    } else {
                        fields[i].value = userData[key];
                    }
                }
            }
        })
        .catch(error => {
            alertMessage.innerHTML = error.message;
            fieldset.disabled = true;
            alertMessage.style.display = "block";
            alertMessage.classList.remove("alert-success");
            alertMessage.classList.add("alert-danger");
        });

    userForm.addEventListener("submit", function(event) {
        event.preventDefault();
        alertMessage.style.display = "none";
        fieldset.disabled = true;
        saveBtn.innerHTML = "Сохраняем...";
        const fields = userForm.getElementsByClassName("form-control");
        const body = {};
        for (var i = 0; i < fields.length; i++) {
            // Вставляет в body имя поля и значение поля
            fields[i].classList.remove("is-invalid");
            body[fields[i].name] = fields[i].value;
        }

        fetch(Config.API_HOST + url + "?session_token=" + userSession, {
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
                alertMessage.style.display = "block";
                alertMessage.classList.remove("alert-danger");
                alertMessage.classList.add("alert-success");
                alertMessage.innerHTML = "Изменения сохранены";
                fieldset.disabled = false;
                saveBtn.innerHTML = "Сохранить";
            })
            .catch(error => {
                alertMessage.innerHTML = error.message;
                alertMessage.style.display = "block";
                alertMessage.classList.remove("alert-success");
                alertMessage.classList.add("alert-danger");
                fieldset.disabled = false;
                saveBtn.innerHTML = "Сохранить";
                if (error.status === 400) {
                    error.fields.forEach(name => {
                        let field = document.getElementsByName(name)[0];
                        field.parentElement.classList.add("is-invalid");
                    });
                }
            });
    });

    addNumForm.addEventListener('submit', function(event)  {
      event.preventDefault();
      const fieldset = addNumForm.getElementsByTagName('fieldset')[0];
      const editNumForms = document.getElementsByClassName('editNumForm');

      phone.classList.remove('is-invalid');
      numMessage.style.display = 'none';
      fieldset.disabled = true;
      addBtn.innerHTML = 'Добавляем...'

      const body = JSON.stringify({number:phone.value})

      fetch(Config.API_HOST+url + '/add.number?session_token=' + userSession, {
        method: 'put',
        headers: {'Content-type':'application/json'},
        body
      })
      .then(response => response.json())
      .then(jsonResponse =>{
        if (jsonResponse.status !== 200) throw new Error(jsonResponse.message);
        return jsonResponse;
      })
      .then(({number}) => {
        insertNumber(number);

        const editForm = editNumForms[0];

        noNumbers.style.display = 'none';
        editForm.classList.add('new-num');
        setTimeout(() => editForm.classList.remove('new-num'),400);
        addBtn.innerHTML = 'Добавить';
        fieldset.disabled = false;
        addBtn.disabled = true;
        phone.value = '';
      })
      .catch(error => {
        addBtn.innerHTML = 'Добавить';
        phone.classList.add('is-invalid');
        fieldset.disabled = false;
        numMessage.innerHTML = error.message;
        numMessage.style.display = 'block';
      })

    })

    function insertNumber(phone) {
        const template = `
        <form class="editNumForm" id=${phone}>
          <fieldset>
            <div>
              <input onkeyup='numberValidate(this)' onkeydown= 'numberValidate(this)'
                    class='numField form-control' type="text"
                    name="phone" value="${phone}">
              <div style='display:inline' onclick='requestOnEditPhone(event)'>
              <button type="button" name="save" class="btn btn-primary saveBtn"><span></span></button>
              <button type="button" name="delete" class="btn btn-danger delBtn"></button>
              <small class="saveMsg text-muted">Сохранено</small>
              </div>
            </div>
          </fieldset>
        </form>`;
        editNumbers.insertAdjacentHTML('afterbegin',template);
    }


})();

function numberValidate(phone) {
  phone.value = phone.value.replace(/[^+0-9]/gim,'');
}

function requestOnEditPhone(event) {
    //parentElement нужен для того чтобы узнать,имя или форму,если нажато на span
    const name = event.target.name ? event.target.name : event.target.parentElement.name;
    const form = event.target.form ? event.target.form : event.target.parentElement.form;


    const editNumFieldset = form.querySelector('fieldset');
    const saveMsgs = Array.from(document.getElementsByClassName('saveMsg'));
    const fields = Array.from(editNumbers.getElementsByTagName('input'));

    saveMsgs.forEach(item => {
      item.style.opacity = 0;
    })


    fields.forEach(item => {
      item.classList.remove('is-invalid');
    })

    editNumFieldset.disabled = true;
    if (name === 'save') {
      const saveMsg = form.querySelector('.saveMsg');
      const { phone } = form;
      const body = JSON.stringify({ number:form.id,newNumber:phone.value })

      fetch(Config.API_HOST+url + '/edit.number?session_token=' + userSession, {
        method: 'put',
        headers: {'Content-type':'application/json'},
        body
      })
      .then(response => response.json())
      .then(jsonResponse =>{
        if (jsonResponse.status !== 200) throw new Error(jsonResponse.message);
        return jsonResponse;
      })
      .then(data => {
        editNumFieldset.disabled = false;
        saveMsg.style.opacity = 1;
      })
      .catch(error => {
        phone.classList.add('is-invalid');
        editNumFieldset.disabled = false;
        numMessage.innerHTML = error.message;
        numMessage.style.display = 'block';
      })

    }else if (name === 'delete'){
      const body = JSON.stringify({ number:form.id });

      fetch(Config.API_HOST+url + '/remove.number?session_token=' + userSession, {
        method: 'put',
        headers: {'Content-type':'application/json'},
        body
      })
      .then(response => response.json())
      .then(jsonResponse =>{
        if (jsonResponse.status !== 200) throw new Error(jsonResponse.message);
        return jsonResponse;
      })
      .then(data => {
        editNumFieldset.disabled = false;
        form.classList.add('delete-num');
        setTimeout( () => {
          form.parentElement.removeChild(form)
          if (document.getElementsByClassName('editNumForm').length === 0){
            noNumbers.style.display = 'block';
          }
        },700)


      })
      .catch(error => {
        phone.classList.add('is-invalid');
        editNumFieldset.disabled = false;
        numMessage.innerHTML = error.message;
        numMessage.style.display = 'block';
      })

    }
}
