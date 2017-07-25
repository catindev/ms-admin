const userSession = Cookies.get("user_session");
const adminName = document.getElementById("adminName");
const errorBlock = document.getElementById("errorBlock");
const exitBtn = document.getElementById('exitBtn');
if (userSession && location.pathname === "/") {
  window.location.replace("/accounts");
} else if (userSession && location.pathname !== "/") {
  exitBtn.addEventListener('click', () => Cookies.remove('user_session'));
  fetch(Config.API_HOST + "/users/" + userSession)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(userData => {
      const userInfo = {};
      for (let key in userData) {
        if (key !== "status") {
          userInfo[key] = userData[key];}
      }
      adminName.innerHTML += " " + userData.username;
    })
    .catch(error => {
      errorBlock.style.display = "block";
      errorBlock.innerHTML = error.message;
    });
} else if (!userSession && location.pathname !== '/'){
  window.location.replace("/");
}
