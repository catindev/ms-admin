(function() {
  const url = location.pathname;
  const accountName = document.getElementById("accountName");
  const errorMessage = document.getElementById("errorMessage");
  const accountForm = document.getElementById("accountForm");
  const sidebar = document.querySelector(".nav-stacked");
  const saveBtn = document.querySelector(".form-group .btn");
  const fieldset = document.querySelector('.form-group fieldset');
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
      accountForm.style.display = "none";
      sidebar.style.display = "none";
      document.body.style.backgroundColor = "rgba(0,0,0,0.6)";
      errorMessage.innerHTML = error.message;
      errorBlock.style.display = "block";
    });

  accountForm.addEventListener("submit", function(event) {
    event.preventDefault();
    saveBtn.disabled = true;
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
        console.log(response);
        saveBtn.disabled = false;
        fieldset.disabled = false;
        saveBtn.innerHTML = "Сохранить";
      })
      .catch(error => {
        errorMessage.innerHTML = error.message;
        errorMessage.style.display = 'block';
        error.fields.map( (name) => {
          let field = document.getElementsByName(name)[0];
          field.style.borderColor = 'red';
        });
        saveBtn.disabled = false;
        fieldset.disabled = false;
        saveBtn.innerHTML = "Сохранить";
      });
  });
})();
