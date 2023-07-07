"use strict";
//* Account page
const registrationForm = document.getElementById('registration-form');
const deleteButton = document.getElementById('delete-account');
// Updates the username when the form is submitted
registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(registrationForm);
    localStorage.setItem('username', JSON.stringify(formData.get('config-username')));
    reloadUsername();
});
// Deletes the account by removing the username from storage
deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem('username', JSON.stringify(null));
    reloadUsername();
});
//Navbar indicator
const buttonCONFIG = document.getElementById('navbar-settings-button');
buttonCONFIG.classList.add("navbar-selected-button");
