(function() {
  const companyId = location.pathname.replace(/[^0-9]/gim,'');
  const formHeader = document.getElementById("formHeader");
  const form = document.getElementById('containerForm');
  const sidebar = document.querySelector('.nav-stacked');
  fetch(
    Config.API_HOST + '/accounts/' + companyId + "?user_session=" + userSession
  )
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
      return jsonResponse;
    })
    .then(account => {
      formHeader.innerHTML = account.name;
      let accountForm = document.getElementById("accountForm");
      for (key in account) {
        if (accountForm[key] && typeof accountForm[key] !== "string") {
          let fields = document.getElementsByName(key);
          for (let field = 0; field < fields.length; field++) {
            fields[field].value = account[key];
          }
        }
      };
    })
    .catch(error => showError(error,form,sidebar));
})();
