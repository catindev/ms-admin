(function() {
  const username = document.getElementById("username");
  const url = location.pathname;
  const alertMessage = document.getElementById("alertMessage");
  const userForm = document.getElementById("userForm");
  const saveBtn = document.querySelector("#userForm .btn");
  const fieldset = document.querySelector("#userForm fieldset");

  fetch(Config.API_HOST + url + "?user_session=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(userData => {
      username.innerHTML = userData.name;
      for (key in userData) {
        let fields = document.getElementsByName(key);
        for (var i = 0; i < fields.length; i++) {
          if (key === "phones") {
            userData[key].forEach(phone => {
              fields[i].innerHTML += phone + "\n";
            });
          } else if (key === "type") {
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
})();
