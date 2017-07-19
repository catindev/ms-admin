(function () {
  const companyId = 222;
  const userSession = Cookies.get('user_session');
  const companyName = document.getElementById('companyName');
  fetch('server/account.php/'+companyId+'?user_session='+userSession)
  .then(response => response.json())
  .then(jsonResponse => {
    if (jsonResponse.status !== 200) throw Error(jsonResponse.message)
    return jsonResponse;
  })
  .then(account =>{
    companyName.innerHTML = account.name;
  })
  .catch(error => console.log(error.message))
}());
