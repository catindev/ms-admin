(function() {
  const url = location.href;
  const accountUrl = location.pathname.match(/\accounts\/\d+\w+/gi).join("");
  const sidebarList = document.getElementById("sidebarList");
  const sidebarLinks = sidebarList.getElementsByTagName("a");
  const icons = document.querySelector('.icons');
  const iconsLink = icons.getElementsByTagName('a');
  let count = 0;
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

  icons.innerHTML = linksSettings.reduce((res,link) => {
    count++
    return res + `<a class='icons__link' href=${link.url}>
      <img class="icons__img" src='/static/images/sidebar/${count}.svg'/>
     </a>`
  },'');

  for (var i = 0; i < sidebarLinks.length; i++) {
    if (sidebarLinks[i].href === url && iconsLink[i].href === url) {
      iconsLink[i].style.background = '#343a40';
      iconsLink[i].querySelector('img').style.filter = 'invert(100%)';
      sidebarLinks[i].classList.add("sidebar__activeLink");
    }
  }
})();
