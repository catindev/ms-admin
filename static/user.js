(function() {
    const username = document.getElementById("username");
    const url = location.pathname;
    const alertMessage = document.getElementById("alertMessage");
    const userForm = document.getElementById("userForm");
    const saveBtn = document.querySelector("#userForm .btn");
    const fieldset = document.querySelector("#userForm fieldset");
    const textarea = document.getElementById('textarea');
    const alertPassword = document.getElementById('alertPassword');

    fetch(Config.API_HOST + url + "?session_token=" + userSession)
        .then(response => response.json())
        .then(jsonResponse => {
            if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
            return jsonResponse;
        })
        .then(userData => {
            username.innerHTML = userData.name;
            for (key in userData) {
                let fields = document.getElementsByName(key);
                for (var i = 0; i < fields.length; i++) {
                    if (key === "phones") {
                        userData[key].forEach(phone => {
                            if (userData[key].indexOf(phone) === userData[key].length - 1) {
                                return fields[i].value += phone;
                            }
                            fields[i].value += phone + "\n";
                        });
                    } else if (key === "type") {
                        fields[i].querySelector(
                            `option[value=${userData[key]}]`
                        ).selected = true;
                    } else {
                        fields[i].value = userData[key];
                    }
                }
            }
        })
        .catch(error => {
            alertMessage.innerHTML = error.message;
            fieldset.disabled = true;
            alertMessage.style.display = "block";
            alertMessage.classList.remove("alert-success");
            alertMessage.classList.add("alert-danger");
        });

    userForm.addEventListener("submit", function(event) {
        event.preventDefault();
        alertMessage.style.display = "none";
        fieldset.disabled = true;
        saveBtn.innerHTML = "Сохраняем...";
        const fields = userForm.getElementsByClassName("form-control");
        const body = {};
        for (var i = 0; i < fields.length; i++) {
            // Вставляет в body имя поля и значение поля
            fields[i].classList.remove("is-invalid");
            if (fields[i].name === 'phones') {
                let textareaValues = fields[i].value.split('\n');
                body[fields[i].name] = textareaValues;
            } else {
                body[fields[i].name] = fields[i].value;
            }
        }

        fetch(Config.API_HOST + url + "?session_token=" + userSession, {
                method: "put",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(jsonResponse => {
                if (jsonResponse.status !== 200) throw jsonResponse;
                return jsonResponse;
            })
            .then(response => {
                alertMessage.style.display = "block";
                alertMessage.classList.remove("alert-danger");
                alertMessage.classList.add("alert-success");
                alertMessage.innerHTML = "Изменения сохранены";
                fieldset.disabled = false;
                saveBtn.innerHTML = "Сохранить";
            })
            .catch(error => {
                alertMessage.innerHTML = error.message;
                alertMessage.style.display = "block";
                alertMessage.classList.remove("alert-success");
                alertMessage.classList.add("alert-danger");
                fieldset.disabled = false;
                saveBtn.innerHTML = "Сохранить";
                if (error.status === 400) {
                    error.fields.forEach(name => {
                        let field = document.getElementsByName(name)[0];
                        field.parentElement.classList.add("is-invalid");
                    });
                }
            });
    });

})();
