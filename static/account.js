(function() {
  const url = location.pathname;
  const accountName = document.getElementById("accountName");
  const alertMessage = document.getElementById("alertMessage");
  const accountForm = document.getElementById("accountForm");
  const sidebar = document.querySelector(".nav-stacked");
  const saveBtn = document.querySelector("#accountForm .btn");
  const fieldset = document.querySelector('#accountForm fieldset');
  fetch(Config.API_HOST + url + "?user_session=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(account => {
      accountName.innerHTML = account.name;
      for (key in account) {
        if (accountForm[key] && typeof accountForm[key] !== "string") {
          let fields = document.getElementsByName(key);
          for (let field = 0; field < fields.length; field++) {
            fields[field].value = account[key];
          }
        }
      }
    })
    .catch(error => {
      let hiddenElements = [accountForm,sidebar];
      hiddenElements.forEach((element) => element.style.display = 'none');
      document.body.classList.add('darken');
      alertMessage.innerHTML = error.message;
      errorBlock.style.display = 'block';
    });

  accountForm.addEventListener("submit", function(event) {
    event.preventDefault();
    alertMessage.style.display = 'none';
    fieldset.disabled = true;
    saveBtn.innerHTML = "Сохраняем...";
    const fields = accountForm.getElementsByTagName("input");
    const body = {};
    for (var i = 0; i < fields.length; i++) {
      // Вставляет в body имя поля и значение поля
      body[fields[i]["name"]] = fields[i].value;
    }

    fetch(Config.API_HOST + url + "?user_session=" + userSession, {
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
        alertMessage.style.display = 'block';
        alertMessage.classList.remove('alert-danger');
        alertMessage.classList.add('alert-success');
        alertMessage.innerHTML = 'Изменения сохранены';
        fieldset.disabled = false;
        saveBtn.innerHTML = "Сохранить";
      })
      .catch(error => {
        alertMessage.innerHTML = error.message;
        alertMessage.style.display = 'block';
        alertMessage.classList.remove('alert-success');
        alertMessage.classList.add('alert-danger');
        fieldset.disabled = false;
        saveBtn.innerHTML = "Сохранить";
        if (error.status === 400) {
          error.fields.forEach( (name) => {
            let field = document.getElementsByName(name)[0];
            field.parentElement.classList.add('has-error');
          });
        }
      });
  });
})();
