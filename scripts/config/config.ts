//* Account page

const registrationForm: HTMLFormElement = document.getElementById('registration-form') as HTMLFormElement;
const deleteButton: HTMLButtonElement = document.getElementById('delete-account') as HTMLButtonElement;

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
const buttonCONFIG = document.getElementById('navbar-settings-button') as HTMLAnchorElement;
buttonCONFIG.classList.add("navbar-selected-button");