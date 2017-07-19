(function () {
  const companyId = 111;
  const userSession = Cookies.get('user_session');
  const formHeader = document.getElementById('formHeader');
  const fieldset = document.getElementsByTagName('fieldset')[0];
  fetch('server/account.php/'+companyId+'?user_session='+userSession)
  .then(response => response.json())
  .then(jsonResponse => {
    if (jsonResponse.status !== 200) throw Error(jsonResponse.message)
    return jsonResponse;
  })
  .then(account =>{
    formHeader.innerHTML = account.name;
    let accountForm = document.getElementById('accountForm');
    for (let key in account) {
      if (accountForm[key] && typeof accountForm[key] !== 'string') {
          let fields = document.getElementsByName(key);
          for (let field = 0; field < fields.length; field++){
            fields[field].value = account[key];
          }
      }
    }


  })
  .catch(error => console.log(error.message))
}());
