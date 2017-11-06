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
            if (location.pathname === '/journal' && userData.access !== 'admin') {
              throw Error('Доступ закрыт');
            }
            if (location.pathname === '/journal' && userData.access === 'admin') {
              journalTable.style.display = 'table';
            }
            if (userData.access === 'admin') {
              journal.style.display = 'block';
            }

            const userInfo = {};
            for (let key in userData) {
                if (key !== "status") {
                    userInfo[key] = userData[key];
                }
            }
            adminName.innerHTML += " " + userData.login;
        })
        .catch(error => {
            document.body.classList.add('darken')
            errorBlock.style.display = "block";
            errorMessage.innerHTML = error.message;
        });
