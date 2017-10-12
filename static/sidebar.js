(function() {
  const url = location.href;
  const accountUrl = location.pathname.match(/\accounts\/\d+\w+/gi).join("");
  //const companyId = accountUrl.replace(/[^0-9]/g, "");
  //const accountUrl = location.pathname;
  const sidebarList = document.getElementById("sidebarList");
  const sidebarLinks = sidebarList.getElementsByTagName("a");
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
      url: accountUrl + "/params"
    }
  ];

  linksSettings.map(link => {
    sidebarList.innerHTML +=
       `<li class='nav-item'>
        <a class='nav-link sidebar__links' href=${link.url}>${link.title}</a>
       </li>`;
  });
  for (var i = 0; i < sidebarLinks.length; i++) {
    if (sidebarLinks[i].href === url) {
      sidebarLinks[i].classList.add("sidebar__activeLink");
    }
  }
})();
