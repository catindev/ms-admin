(function functionName() {
  const adminName = document.getElementById("adminName");
  const errorBlock = document.getElementById("errorBlock");

  //пользователь
  const userSession = Cookies.get("user_session");
  if (!userSession) {
    window.location.replace("index.html");
  } else {
    fetch("https://fake-admin-api.glitch.me/users/" + userSession)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
        return jsonResponse;
      })
      .then(userData => {
        adminName.innerHTML += " " + userData.username;
      })
      .catch(error => {
        errorBlock.style.display = "block";
        errorBlock.innerHTML = error.message;
      });

    //аккаунты
    fetch(
      "https://fake-admin-api.glitch.me/accounts?user_session=" + userSession
    )
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
  }
})();
