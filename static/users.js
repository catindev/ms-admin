(function() {
  const url = location.pathname;
  const sidebar = document.getElementById("sidebar");
  const addUserForm = document.getElementById("addUserForm");
  const field = document.querySelector("#addUserForm .form-control");
  const btn = document.querySelector("#addUserForm .btn");
  const usersList = document.getElementById("usersList");
  const errorBlock = document.querySelector(".errorWrapper");
  const errorMessage = document.getElementById("errorMessage");
  fetch(Config.API_HOST + url + "?session_token=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(({ items }) => {
      if (items.length === 0) return usersList.innerHTML = `<li>Пользователей нет</li>`;
      usersList.innerHTML = items
        .map(user => `<li><a href = ${url +'/'+ user['id']}>${user['name']}</a></li>`)
        .join('');
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
  addUserForm.addEventListener("submit", function(event) {
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
      .then(userData => {
        window.location.replace(url + "/" + userData.id);
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
