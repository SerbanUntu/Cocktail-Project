"use strict";
//* Templates
// Header template declaration
const usernameTemplate = document.createElement('template');
usernameTemplate.id = "username-template";
// Header template definition
usernameTemplate.innerHTML = `
  <header>
    <a href="./config.html"><p id="username"></p></a>
  </header>
`;
// Navbar template declaration
const navigationBarTemplate = document.createElement('template');
navigationBarTemplate.id = "navigation-bar-template";
// Navbar template definition
navigationBarTemplate.innerHTML = `
  <nav class="navigation-bar">
    <a id="navbar-homepage-button" class="navigation-bar-item" href="./index.html">Homepage</a>
    <a id="navbar-cocktails-button" class="navigation-bar-item" href="./cocktails.html">Cocktails</a>
    <a id="navbar-settings-button" class="navigation-bar-item" href="./config.html">Account</a>
  </nav>
`;
// Adds the templates to the webpage
document.body.insertBefore(usernameTemplate.content, document.body.childNodes[0]);
document.getElementById('main-content').insertBefore(navigationBarTemplate.content, document.getElementById('main-content').childNodes[0]);
reloadUsername();
// Updates the UI when the username is changed. Also used in config.ts
function reloadUsername() {
    const nameElement = document.getElementById('username');
    const username = JSON.parse(localStorage.getItem('username') || 'null');
    if (username === null) {
        nameElement.innerText = 'Create account';
    }
    else {
        nameElement.innerText = username;
    }
}
