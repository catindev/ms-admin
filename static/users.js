(function() {
  const url = location.pathname;
  const sidebar = document.getElementById("sidebar");
  const addUserForm = document.getElementById("addUserForm");
  const field = document.querySelector("#addUserForm .form-control");
  const btn = document.querySelector("#addUserForm .btn");
  const errorBlock = document.querySelector(".errorWrapper");
  const errorMessage = document.getElementById("errorMessage");
  fetch(Config.API_HOST + url + "?user_session=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(({ items }) => {
      const usersList = document.getElementById("usersList");
      items.forEach(user => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        for (let userData in user) {
          if (userData === "id") {
            a.href = url + "/" + user["id"];
          } else if (userData === "name") {
            a.innerHTML = user["name"];
          }
        }
        usersList.appendChild(li);
        li.appendChild(a);
      });
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
    fetch(Config.API_HOST + url + "?user_session=" + userSession, {
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
