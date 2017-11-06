(function () {
  const cleanBtnWrap = document.querySelector('.cleanBtnWrap');

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

      journalTable.style.display = 'block';
      emptyJournal.style.display = 'none';

      data.innerHTML = items.reduce( (result,item) => {
        counter++;
        let payload = '';
        if (typeof item.payload === 'object') {
          payload += 'response: ' + item.payload.response;
          payload += "<br/>params: { "
          Object.keys(item.payload.params).forEach(elem => {
            payload += ' ' + elem + ' : ' + item.payload.params[elem] + ','
          })
          payload += ' }'
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
