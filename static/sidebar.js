(function() {
  const url = location.href;
  const accountUrl = location.pathname.match(/\accounts\/[0-9]+/g).join("");
  const companyId = accountUrl.replace(/[^0-9]/g, "");
  const sidebarList = document.getElementById("sidebarList");
  const sidebarLinks = sidebarList.getElementsByTagName("a");
  const linksSettings = [
    {
      title: "Настройки аккаунта",
      url: "/accounts/" + companyId
    },
    {
      title: "Пользователи",
      url: "/accounts/" + companyId + "/users"
    },
    {
      title: "Транки",
      url: "/accounts/" + companyId + "/trunks"
    },
    {
      title: "Параметры",
      url: accountUrl + "/customfields"
    }
  ];

  linksSettings.map(link => {
    sidebarList.innerHTML +=
       `<li>
        <a class='sidebar__links' href=${link.url}>${link.title}</a>
       </li>`;
  });
  for (var i = 0; i < sidebarLinks.length; i++) {
    if (sidebarLinks[i].href === url) {
      sidebarLinks[i].classList.add("sidebar__activeLink");
    }
  }
})();
