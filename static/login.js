(function() {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const { login, password } = loginForm;
    if (!login.value || !password.value) return errorShake();

    const body = JSON.stringify({
      login: login.value,
      password: password.value
    });
    fetch(" https://fake-admin-api.glitch.me/login", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
        return jsonResponse;
      })
      .then(sessionData => {
        const expires = new Date(new Date().getTime() + 60 * 1000);
        Cookies.set("user_session", sessionData.session, { expires });
        window.location.replace("accounts.html");
      })
      .catch(error => {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = error.message;
        errorShake();
      });
  });

  function errorShake() {
    const loginContainer = document.getElementById("loginContainer");
    loginContainer.classList.add("shake");
    setTimeout(() => loginContainer.classList.remove("shake"), 1000);
  }
})();
