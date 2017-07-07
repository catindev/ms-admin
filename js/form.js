let send_request = (function () {
  loginBtn.addEventListener('click',function(){
    let input_one = login_input.value;
    let input_two = password_input.value;
    if (input_one.length > 0 && input_two.length > 0) {
      let params = JSON.stringify({login:input_one,password:input_two});
      fetch('app.php', {
          method: 'post',
          credentials: 'include',
          headers: {
            "Content-type":"application/json",
          },
          body:params
        })
        .then(
          function (response){
            if (response.ok){
              response.json().then(function (data){
                let date = new Date(new Date().getTime() + 60*1000)
                let cookie = Cookies.set('cookie_name',data,{expires:date});
                forMsg.classList.remove('alert-danger');
                forMsg.classList.add('alert-success');
                forMsg.style.display = 'block';
                forMsg.innerHTML = 'Вы вошли в систему';
                setTimeout(function(){window.location.replace('accounts.html')},2000)
              })} else {
                response.json().then(function (data){
                  let error = data.message;
                  forMsg.classList.add('alert-danger');
                  forMsg.style.display = 'block';
                  forMsg.innerHTML = error;
                })
              }
        }
        )
        .catch(function (error){
          console.log('Opps');
        })

      }else {
        if (input_one.length === 0) {
          shake(login_input);
        }else if (input_two.length === 0) {
          shake(password_input);
        }else {
          shake(login_input);
        };
      };
  })
})();

function shake(field) {
  field.classList.add('shake');
  setTimeout(function () {
    field.classList.remove('shake');
  },1000);
}
