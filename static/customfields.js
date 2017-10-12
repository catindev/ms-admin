(function() {
  const url = location.pathname;
  const sidebar = document.getElementById("sidebar");
  const addParameterForm = document.getElementById("addParameterForm");
  const field = document.querySelector("#addParameterForm .form-control");
  const btn = document.querySelector("#addParameterForm .btn");
  const parametersList = document.getElementById("parametersList");
  const errorBlock = document.querySelector(".errorWrapper");
  const errorMessage = document.getElementById("errorMessage");
  fetch(Config.API_HOST + url + "?session_token=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(({ items }) => {
      if (items.length === 0) return parametersList.innerHTML = `<li>Параметров нет</li>`;
      let counter = 0;
      parametersList.innerHTML = items.reduce( (result,parameter) => {
        counter += 1;
        return result + `
        <tr>
          <td>${counter}</td>
          <td><a href = ${url +'/'+ parameter['id']}>${parameter['name']}</a></td>
        </tr>
        `
      },"");
    })
    .catch(error => {
      document.body.classList.add("darken");
      errorMessage.innerHTML = error.message;
      errorBlock.style.display = "block";
    });
  btn.disabled = true;
  field.addEventListener("input", function() {
    btn.disabled = false;
    if (field.value.length === 0) {
      btn.disabled = true;
    }
  });
  addParameterForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const body = JSON.stringify({ name: field.value });
    field.disabled = true;
    btn.disabled = true;
    btn.innerHTML = "Добавляем...";
    fetch(Config.API_HOST + url + "?session_token=" + userSession, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
        return jsonResponse;
      })
      .then(parameterData => {
        window.location.replace(url + "/" + parameterData.id);
      })
      .catch(error => {
        alertMessage.innerHTML = error.message;
        alertMessage.style.display = "block";
        alertMessage.classList.remove("alert-success");
        alertMessage.classList.add("alert-danger");
        btn.disabled = false;
        btn.innerHTML = "Добавить";
        field.disabled = false;
      });
  });
})();
