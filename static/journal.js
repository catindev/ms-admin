(function () {
  const cleanBtnWrap = document.querySelector('.cleanBtnWrap');
  const preloader = document.getElementById('preloader');

  fetch('http://papi.mindsales-crm.com/log')
  .then(response => response.json())
  .then(jsonResponse => {
    if (jsonResponse.status !== 200) throw new Error(jsonResponse.message);
    return jsonResponse;
  })
  .then(({items}) => {
    let counter = 0;
    if (items.length > 0) {
      if (items.length > 5) cleanBtnWrap.style.display = 'block';

      journalTable.style.display = 'table';
      emptyJournal.style.display = 'none';
      preloader.style.display = 'none';

      data.innerHTML = items.reduce( (result,item) => {
        counter++;
        let payload = '';
        if (typeof item.payload === 'object') {
          let c = 0
          for (key in item.payload){
            if (typeof item.payload[key] === "object") {
              payload += key + " : " + JSON.stringify(item.payload[key]);
            }else {
              payload += key + ` : ${item.payload[key]} ` + '</br>';
            }
          }


        }else if (typeof item.payload === 'string') {
          payload += item.payload;
        }
        return result + `
        <tr>
          <td>${counter}</td>
          <td>${item.when}</td>
          <td>${item.what}</td>
          <td>${payload}</td>
        </tr>
        `
      },'')
    }else{
      preloader.style.display = 'none';
      emptyJournal.style.display = 'block';
    }
  })
  .catch(error => {
    alertMessage.classList.add('alert-danger');
    alertMessage.innerHTML = error.message;
    alertMessage.style.display = 'block';
  })

  cleanBtn.addEventListener('click', () => {

    cleanBtn.innerHTML = 'Очищаяем...';
    cleanBtn.disable = true;

    fetch('http://papi.mindsales-crm.com/log/clean',{
      method:'post',
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw new Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(data => {
      location.reload();
    })
    .catch(error => {
      console.log(error.message);
      cleanBtn.innerHTML = 'Очистить журнал';
      cleanBtn.disable = false;
    })
  })

}())
