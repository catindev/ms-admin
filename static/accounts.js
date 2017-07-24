(function () {
  const errorBlock = document.getElementById("errorBlock");
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
    .catch(error => {
      errorBlock.style.display = "block";
      errorBlock.innerHTML = error.message;
    });

    const field = document.querySelector('.form-inline .form-control');
    const btn = document.querySelector('.form-inline .btn');
    btn.disabled = true;
    field.addEventListener('input',function (event) {
      btn.disabled = false;
      if (field.value.length === 0) {
        btn.disabled = true;
      }
    });

})();
