(function functionName() {
const user = document.getElementById('user');
const errorBlock = document.getElementById('errorBlock');

//запрос пользователя
let session = JSON.stringify(Cookies.get());
fetch('server/user.php/'+session,{
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
  redirect(error,errorBlock);
});

//запрос аккаунтов
session = document.cookie;
fetch('server/accounts.php?'+session)
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
  redirect(error,errorBlock);
});
}())

function redirect(error,errorBlock) {
  errorBlock.innerHTML = error.message;
  errorBlock.style.display = 'block';
  setTimeout(() => {window.location.replace('index.html')},1500);
}
