(function() {
  const accountUrl = location.pathname.match(/\accounts\/\d+\w+/gi).join("");
  const sidebarList = document.getElementById("sidebarList");
  const linksSettings = [
    {
      title: "Настройки аккаунта",
      url: accountUrl
    },
    {
      title: "Пользователи",
      url: accountUrl + "/users"
    },
    {
      title: "Транки",
      url: accountUrl + "/trunks"
    },
    {
      title: "Параметры",
      url: accountUrl + "/customfields"
    }
  ];

  sidebarList.innerHTML = linksSettings
    .map(({ title, url }) => {
      const activeClass = '/' + url === location.pathname ? 'sidebar__activeLink' : '';

      return `<li>
        <a class='sidebar__links ${activeClass}' href=${url}>
          ${title}
        </a>
      </li>`;        
    })
    .join('');

})();
