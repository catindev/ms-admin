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
    fetch(Config.API_HOST + "/sessions", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
        return jsonResponse;
      })
      .then(({ token }) => {
        const expires = new Date(new Date().getTime() + 31536000000);
        Cookies.set("user_session", token, { expires });
        window.location.replace("/accounts");
      })
      .catch(error => {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = error.message;
        const loginContainer = document.getElementById("loginContainer");
        loginContainer.classList.add("shake");
        setTimeout(() => loginContainer.classList.remove("shake"), 1000);
      });
  });
})();
