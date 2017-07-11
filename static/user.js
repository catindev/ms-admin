(function functionName() {
document.body.style.backgroundColor='#fff';
param = document.cookie;
fetch('server/users.php?'+param,)
.then(response => response.json())
.then(jsonResponse => {
  if (jsonResponse.status !== 200) throw Error(jsonResponse);
  return jsonResponse;
})
.then( userData => {
  console.log(userData);
})
.catch(error => {
  console.log(error);
  //setTimeout(() => {window.location.replace('index.html')},1500)
});

}())
