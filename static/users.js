(function() {
  const url = location.pathname;
  const sidebar = document.getElementById('sidebar');
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
})();
