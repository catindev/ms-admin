(function() {
  const field = document.querySelector(".form-row .form-control");
  const btn = document.querySelector(".form-row .btn");
  const errorBlock = document.querySelector(".errorWrapper");
  const errorMessage = document.getElementById('errorMessage');
  const addAccountForm = document.querySelector(".form-row");

  fetch(Config.API_HOST + "/accounts?session_token=" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(({items}) => {
      const accountsList = document.getElementById("accountsList");
      if (items.length > 0){
      noAccounts.style.display = 'none';
      accountsTable.style.display = 'table';
      let counter = 0;
      accountsList.innerHTML = items.reduce( (result,company) => {
        counter += 1;
        return result + `
        <tr>
          <td class='tableCell'>${counter}</td>
          <td><a href = ${'/accounts/'+ company['id']}>${company['name']}</a></td>
        </tr>
        `
      },"")}
    })
    .catch(error => {
      addAccountForm.style.display = 'none';
      document.body.classList.add('darken');
      errorMessage.innerHTML = error.message;
      errorBlock.style.display = 'block';
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
    fetch(Config.API_HOST + "/accounts?session_token=" + userSession, {
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
          alertMessage.innerHTML = error.message;
          alertMessage.style.display = "block";
          alertMessage.classList.remove("alert-success");
          alertMessage.classList.add("alert-danger");
          btn.disabled = false;
          btn.innerHTML = 'Добавить';
          field.disabled = false;
      });
  });

})();
