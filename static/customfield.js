(function() {
  const parameterName = document.getElementById("parameterName");
  const url = location.pathname;
  const alertMessage = document.getElementById("alertMessage");
  const parameterForm = document.getElementById("parameterForm");
  const saveBtn = document.querySelector("#parameterForm .btn");
  const fieldset = document.querySelector("#parameterForm fieldset");
  const textarea = document.getElementById('textarea');
  const select = document.getElementsByTagName('select')[0];

  select.addEventListener('change',() => {
    if (select.value !== 'text') return textarea.parentElement.style.display = 'block';
    textarea.parentElement.style.display = 'none';
  });

  fetch(Config.API_HOST + url + "?user_session=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(({type,list,name}) => {
        parameterName.innerHTML = name;
        document.forms[0].elements.name.value = name;
        let selected = document.querySelector(`option[value=${type}]`);
        selected.selected = true;
        if (selected.value === 'text') {
          return textarea.parentElement.style.display = 'none';
        }
        list.forEach(value => {
              if (list.indexOf(value) === list.length-1) return textarea.value += value;
              textarea.value += value + "\n";
        });

    })
    .catch(error => {
      alertMessage.innerHTML = error.message;
      fieldset.disabled = true;
      alertMessage.style.display = "block";
      alertMessage.classList.remove("alert-success");
      alertMessage.classList.add("alert-danger");
    });

    parameterForm.addEventListener("submit", function(event) {
      event.preventDefault();

      alertMessage.style.display = "none";
      fieldset.disabled = true;
      saveBtn.innerHTML = "Сохраняем...";

      const fields =  parameterForm.getElementsByClassName("form-control");
      const body = {};
      for (var i = 0; i < fields.length; i++) {
        fields[i].classList.remove("is-invalid");
        if (fields[i].name === 'list'){
          let textareaValues = fields[i].value.split('\n');
          if (select.value !== 'text') body[fields[i].name] = textareaValues;
        }else {
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
