(function() {
  fetch(Config.API_HOST + "/accounts?user_session=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(accounts => {
      let companies = accounts.items;
      const accountsList = document.getElementById("accountsList");
      for (let index = 0; index < companies.length; index++) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        for (let companyData in companies[index]) {
          if (companyData === "id") {
            a.href = "/accounts/" + companies[index]["id"];
          } else if (companyData === "name") {
            a.innerHTML = companies[index]["name"];
          }
        }
        accountsList.appendChild(li);
        li.appendChild(a);
      }
    })
    .catch(error => showError(error));

  const field = document.querySelector(".form-inline .form-control");
  const btn = document.querySelector(".form-inline .btn");
  const addAccountForm = document.querySelector(".form-inline");
  btn.disabled = true;
  field.addEventListener("input", function() {
    btn.disabled = false;
    if (field.value.length === 0) {
      btn.disabled = true;
    }
  });

  addAccountForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const body = JSON.stringify({ name: field.value });
    field.disabled = true;
    btn.disabled = true;
    btn.innerHTML = "Добавляем...";
    fetch(Config.API_HOST + "/accounts?user_session=" + userSession, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
        return jsonResponse;
      })
      .then(({status,id}) => {
        setTimeout(() => window.location.replace("/accounts/" + id),2000)
      })
      .catch(error => {
          setTimeout(() => {
          showError(error);
          field.disabled = false;
          btn.disabled = false;
          btn.innerHTML = "Добавить";
        },2000);
      });
  });
})();

function showError(error) {
  errorBlock.style.display = "block";
  errorBlock.innerHTML = error.message;
}
