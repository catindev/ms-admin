const userSession = Cookies.get("user_session");
const adminName = document.getElementById("adminName");
const errorBlock = document.querySelector(".errorWrapper");
const exitBtn = document.getElementById('exitBtn');
    exitBtn.addEventListener('click', () => Cookies.remove('user_session'));
    fetch(Config.API_HOST + "/sessions?session_token=" + userSession)
        .then(response => response.json())
        .then(jsonResponse => {
            if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
            return jsonResponse;
        })
        .then(userData => {
            const userInfo = {};
            for (let key in userData) {
                if (key !== "status") {
                    userInfo[key] = userData[key];
                }
            }
            adminName.innerHTML += " " + userData.login;
        })
        .catch(error => {
            errorBlock.style.display = "block";
            errorBlock.innerHTML = error.message;
        });
