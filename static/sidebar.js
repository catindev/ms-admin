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
    }
  ];
  sidebarList.innerHTML = linksSettings.reduce((links, link) => {
    return (
      `<li>
      <a class='sidebar__links' href=${links.url}>${links.title}</a>
    </li>` +
      `<li>
      <a class='sidebar__links' href=${link.url}>${link.title}</a>
    </li>`
    );
  });
  for (var i = 0; i < sidebarLinks.length; i++) {
    if (sidebarLinks[i].href === url) {
      sidebarLinks[i].classList.add("sidebar__activeLink");
    }
  }
})();
