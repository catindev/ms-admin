(function() {
  const field = document.querySelector(".form-inline .form-control");
  const btn = document.querySelector(".form-inline .btn");
  const errorBlock = document.querySelector(".errorWrapper");
  const errorMessage = document.getElementById('errorMessage');
  const addAccountForm = document.querySelector(".form-inline");
  const accounts = document.querySelector(".accounts");
  fetch(Config.API_HOST + "/accounts?user_session=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(accounts => {
      let companies = accounts.items;
      const accountsList = document.getElementById("accountsList");
      companies.map(company => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        for (let companyData in company) {
          if (companyData === "id") {
            a.href = "/accounts/" + company["id"];
          } else if (companyData === "name") {
            a.innerHTML = company["name"];
          }
        }
        accountsList.appendChild(li);
        li.appendChild(a);
      });
    })
    .catch(error => {
      addAccountForm.style.display = "none";
      accountsList.style.display = "none";
      document.body.style.backgroundColor = "rgba(0,0,0,0.6)";
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
      .then(accountData => {
        window.location.replace("/accounts/" + accountData.id);
      })
      .catch(error => {
          errorMessage.style.display = 'block';
          errorMessage.innerHTML = error.message;
          btn.disabled = false;
          btn.innerHTML = 'Добавить';
          field.disabled = false;
      });
  });
})();
