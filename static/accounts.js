(function functionName() {
const user = document.getElementById('user');
const errorBlock = document.getElementById('errorBlock');

//пользователь
const userSession = Cookies.get('user_session');
if (!userSession){
  setTimeout(() => {window.location.replace('index.html')},1500);
}else {
  fetch('server/user.php/'+{userSession},{
    credentials: 'include',
  })
  .then(response => response.json())
  .then(jsonResponse => {
    if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
    return jsonResponse;
  })
  .then( userData => {
    user.innerHTML += ' ' + userData.username;
  })
  .catch(error => {
    setTimeout(() => {window.location.replace('index.html')},1500);
  });

  //аккаунты
  fetch('server/accounts.php?user_session='+{userSession})
  .then(response => response.json())
  .then(jsonResponse => {
    if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
    return jsonResponse;
  })
  .then( accounts => {
    let companies = accounts.items;
    const accountsList = document.getElementById('accountsList');
    for (let index=0; index < companies.length; index++){
      let li = document.createElement('li');
      let a = document.createElement('a');
      for(let companyData in companies[index]){
        if (companyData === 'id'){
          a.href = companies[index]['id']}
        else if (companyData === 'name'){
          a.innerHTML = companies[index]['name']}
      }
      accountsList.appendChild(li);
      li.appendChild(a);
    }
  })
  .catch(error => {
    errorBlock.style.block = 'block';
    errorBlock.innerHTML = error.message;
  });
}

}())
