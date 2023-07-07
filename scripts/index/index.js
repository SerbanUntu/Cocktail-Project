"use strict";
//* Homepage
const greeting = document.getElementById('username-greeting');
const username = JSON.parse(localStorage.getItem('username') || 'null');
// Update greeting
if (username !== null) {
    greeting.innerText = `Welcome back, ${username}!`;
}
//Navbar indicator
const buttonINDEX = document.getElementById('navbar-homepage-button');
buttonINDEX.classList.add("navbar-selected-button");
