//* Homepage

const greeting = document.getElementById('username-greeting') as HTMLElement;
const username: string = JSON.parse(localStorage.getItem('username') || 'null');

// Update greeting
if(username !== null) {
    greeting.innerText = `Welcome back, ${username}!`;
}

//Navbar indicator
const buttonINDEX = document.getElementById('navbar-homepage-button') as HTMLAnchorElement;
buttonINDEX.classList.add("navbar-selected-button");