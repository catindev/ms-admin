function events() {
  loginBtn.addEventListener('click',function(){
    authorization(login_input,password_input)
  })
}

function shake(field) {
  field.classList.add('shake');
  setTimeout(function () {
    field.classList.remove('shake');
  },1000);
}

function authorization(field_one,field_two){
  let input_one = field_one.value;
  let input_two = field_two.value;

  if (input_one.length > 0 && input_two.length > 0) {
    let params = JSON.stringify([{login:input_one,password:input_two},{ status: 200, session: "fb21257948461a14d065f414762517df"}]);
    let server_error = JSON.stringify({status:500,message:"Техническая ошибка. Попробуйте позже или обратитесь в поддержку"});
    let login_error = JSON.stringify({ status: 400, message: "Неверный логин или пароль" });
    send_request('app.php',params,server_error,login_error);
  }else {
    if (input_one.length === 0) {
      shake(field_one);
    }else if (input_two.length === 0) {
      shake(field_two);
    }else {
      shake(field_one);
    };
  };
}

function send_request(url,params,server_error,login_error) {
  fetch(url, {
      method: 'post',
      credentials: 'include',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Content-Type": "application/json"

      },
      body:params
    })
    .then(
    function (response) {
      if (response.status !== 200) {
        console.log(response.status);
      }

    response.json().then(function (data) {
        let login = data[0]['login'];
        let password = data[0]['password'];
        if (login === 'test' && password === '111'){
          let date = new Date(new Date().getTime() + 60 * 1000);
          document.cookie = 'cookie_name='+JSON.stringify(data[1])+';'+'expires='+date.toGMTString();
          if (document.cookie.length > 0){
            console.log(document.cookie);
            setTimeout(function(){window.location.replace},2000);
          }
          
        }else if (login === 'badass' && password === '666') {
          console.log(server_error);
        }else {
          console.log(login_error);
        }
    });
    }
    )
    .catch(function (error) {
      console.log(server_error);
    });
}

events();
