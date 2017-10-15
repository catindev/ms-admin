(function() {
  const accountName = document.getElementById("accountName");
  const url = location.pathname;
  const alertMessage = document.getElementById("alertMessage");
  const errorMessage = document.getElementById("errorMessage");
  const accountForm = document.getElementById("accountForm");
  const author = document.getElementById('author');
  const saveBtn = document.querySelector("#accountForm .btn");
  const fieldset = document.querySelector("#accountForm fieldset");

  fetch(Config.API_HOST + url + "?user_session=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(account => {
      accountName.innerHTML = account.name;
      author.innerHTML = "Подключил " + account.author + " " + account.created;
      for (key in account) {
          let fields = document.getElementsByName(key);
          for (let field = 0; field < fields.length; field++) {
            if (key === 'maxWaitingTime' || key === 'maxConversationTime') {
              fields[field].value = account[key]/1000;
            }else if (key === "funnelSteps" || key === "noTargetReasons" ) {
              account[key].forEach(item => {
                if (account[key].indexOf(item) === account[key].length-1) {
                  return fields[field].value += item;
                }
                fields[field].value += item + "\n";
              })
            }else {
              fields[field].value = account[key];
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

  accountForm.addEventListener("submit", function(event) {
    event.preventDefault();
    alertMessage.style.display = "none";
    fieldset.disabled = true;
    saveBtn.innerHTML = "Сохраняем...";
    const fields =  accountForm.getElementsByClassName("form-control");
    const body = {};
    for (var i = 0; i < fields.length; i++) {
      // Вставляет в body имя поля и значение поля
      fields[i].classList.remove("is-invalid");
      if (fields[i].name === 'funnelSteps' || fields[i].name === 'noTargetReasons'){
        let textareaValues = fields[i].value.split('\n');
        body[fields[i].name] = textareaValues;
      }else if (fields[i].name === 'maxWaitingTime' || fields[i].name === 'maxConversationTime') {
        body[fields[i].name] = fields[i].value*1000;
      }else{
        body[fields[i].name] = fields[i].value;
      }
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
            field.classList.add("is-invalid");
          });
        }
      });
  });

})();
