(function() {
  const url = location.pathname;
  const accountUrl = url.match(/\accounts\/\d+\w+/gi).join("");
  const sidebarList = document.getElementById("sidebarList");
  let count = 0;
  const linksSettings = [
    {
      title: "Настройки аккаунта",
      url: accountUrl
    },
    {
      title: "Пользователи",
      url: `/${accountUrl}/users`
    },
    {
      title: "Транки",
      url: `/${accountUrl}/trunks`
    },
    {
      title: "Параметры",
      url: `/${accountUrl}/params`
    }
  ];


  sidebarList.innerHTML = linksSettings.reduce( (res,link) => {
    let active = url === link.url ? 'sidebar__activeLink' : '';
    return res + `<li class='nav-item'>
      <a class='nav-link sidebar__links ${active}' href=${link.url}>${link.title}</a>
    </li>`
  },'')

  icons.innerHTML = linksSettings.reduce( (res,link) => {
    let isActive = url === link.url;
    let activeIcon = isActive ? 'icons__link--active' : '';
    let activeImg = isActive ? 'icons__img--active' : '';
    count++
    return res + `<a class='icons__link ${activeIcon}' href=${link.url}>
      <img class="icons__img ${activeImg}" src='/static/images/sidebar/${count}.svg'/>
     </a>`
  },'');

})();
