//* Cocktails page

const cocktailForm = document.getElementById('cocktail-form') as HTMLFormElement;
const cocktailGrid = document.getElementById('cocktail-grid') as HTMLElement;
const cocktailDialog = document.getElementById('cocktail-dialog') as HTMLDialogElement;
const dialogButton = document.getElementById('close-dialog') as HTMLButtonElement;
const dialogContent = document.getElementById('dialog-content') as HTMLDivElement;
const cocktailFormButton = document.getElementById('search-cocktail-button') as HTMLInputElement;

// Close dialog from its button
dialogButton.addEventListener("click", (e) => {
    e.preventDefault();
    cocktailDialog.close();
})

// Removes the contents of the dialog upon closing
cocktailDialog.addEventListener("close", (e) => {
    e.preventDefault();
    dialogContent.innerHTML = '';
    document.getElementById('dialog-image')!.remove();
});

// Performs the search and displays the results when the user presses the search icon
cocktailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Resets the grid so that the old cards get replaced when a new search is made
    cocktailGrid.innerHTML = '';

    const formData = new FormData(cocktailForm);
    const searchText: FormDataEntryValue = formData.get('search-cocktail')!;
    const searchType: FormDataEntryValue = formData.get('search-type')!;

    // Calls the function to fetch the information about the drinks
    getCocktails(searchText, searchType).then(cocktails => {
        // If we search by ingredient, we wait until we have all information about the drinks,
        // or more than one second has passed, as per the ensureDrinksFetched function, before generating the grid
        if(searchType === 'by-ingredient') {
            // Uses the cursor loading animation until the grid is generated
            // TODO A loading div that covers the screen
            document.body.style.cursor = "wait";
            ensureDrinksFetched(numberOfDrinks).then((drinks) => {
                generateGrid(drinks);
                drinksGlobal = [];
                document.body.style.cursor = "auto";
            });
        }
        // If we don't search by ingredient, the grid is generated on the spot, using 
        // the return value of the getCocktails function.
        else {
            generateGrid(cocktails);
        }

        // Generates the grid using the provided information
        function generateGrid(cocktails: Cocktail[]) {
            cocktails.forEach(cocktail => {
                // Container of the cocktail card definition
                const cocktailCardContainer = document.createElement('div') as HTMLDivElement;
                cocktailCardContainer.className = "cocktail-card-container";

                // Cocktail card definition
                const cocktailCard = document.createElement('div') as HTMLDivElement;
                cocktailCard.className = "cocktail-card";
                cocktailCard.id = cocktail.id;
                
                // Cocktail card image definition
                const cardImg = document.createElement('img');
                cardImg.src = cocktail.image;
                cardImg.className = "cocktail-image";
                cardImg.draggable = false;

                // Alcoholic icon container definition
                const alcoholicIconContainer = document.createElement('div');
                alcoholicIconContainer.className = "alcoholic-icon-container";
                alcoholicIconContainer.innerHTML = `
                  <img class="alcoholic-icon-image" src="assets/images/alcoholic_icon.png" alt="Icon indicating alcohol content" />
                `;
                // Changes the icon based on the alcoholic number, defined in the Cocktail interface
                switch(cocktail.alcoholic) {
                    case 0: alcoholicIconContainer.style.opacity = '0'; break;
                    case 1: alcoholicIconContainer.style.backgroundColor = 'gray'; break;
                }

                // Cocktail card name definition
                const cardName = document.createElement('p');
                cardName.innerText = cocktail.name;
                cardName.className = "cocktail-name";
                
                //* Dialog functionality
                cocktailCard.onclick = function() {
                
                    // Defines the image inside the dialog
                    const img = document.createElement('img');
                    img.id = "dialog-image";
                    img.className = "dialog-image";
                    img.draggable = false;
                    img.src = cocktail.image;
                    cocktailDialog.insertBefore(img, cocktailDialog.childNodes[0]);

                    // Defines the title inside the dialog
                    const name = document.createElement('h1');
                    name.className = "dialog-name";
                    name.innerText = cocktail.name;
                    dialogContent.appendChild(name);

                    // First item tells whether the drink is alcoholic or not, based on the alcoholic number
                    // defined in the Cocktail interface
                    const alcoholic = document.createElement('div');
                    alcoholic.innerHTML = `
                      <p class="dialog-header">Alcoholic: <span id="dialog-alcoholic-text" class="dialog-text"></span></p>
                    `;
                    dialogContent.appendChild(alcoholic);
                    const alcoholicText = document.getElementById('dialog-alcoholic-text') as HTMLSpanElement;
                    switch(cocktail.alcoholic) {
                        case 0: alcoholicText.innerText = 'No'; break;
                        case 1: alcoholicText.innerText = 'Optional'; break;
                        default: alcoholicText.innerText = 'Yes'; break;
                    }

                    // Second item displays the ingredients
                    const ingredients = document.createElement('div');
                    ingredients.innerHTML = `
                      <p class="dialog-header">Ingredients: </p>
                      <ul id="dialog-ingredients-list" class="dialog-list"></ul>
                    `;
                    dialogContent.appendChild(ingredients);
                    cocktail.ingredients.forEach((ingredient) => {
                        const ingredientItem = document.createElement('li');
                        ingredientItem.innerText = ingredient;
                        ingredientItem.className = "dialog-text";
                        document.getElementById('dialog-ingredients-list')!.appendChild(ingredientItem);
                    });

                    // Third item displays the instructions
                    const instructions = document.createElement('div');
                    instructions.innerHTML = `
                      <p class="dialog-header">Instructions: <span id="dialog-instructions-text" class="dialog-text"></span></p>
                    `;
                    dialogContent.appendChild(instructions);
                    const instructionsText = document.getElementById('dialog-instructions-text') as HTMLSpanElement;
                    instructionsText.innerText = cocktail.instructions;

                    cocktailDialog.showModal();
                };

                cocktailCard.appendChild(cardImg);
                cocktailCard.appendChild(cardName);
                cocktailCard.appendChild(alcoholicIconContainer);
                cocktailCardContainer.appendChild(cocktailCard);
                cocktailGrid.appendChild(cocktailCardContainer);

                // Adds the class that gives the card an animation when hovering 
                cocktailCardContainer.onmouseover = function() {
                    cocktailCard.classList.add("cocktail-card-hover");
                }
                // Removes the class when the card is no longer hovered over
                cocktailCardContainer.onmouseleave = function() {
                    cocktailCard.classList.remove("cocktail-card-hover");
                }
            });
        }
    });
});

interface Cocktail {
    name: string,
    image: string,
    id: string,
    alcoholic: number, /* 0 = non alcoholic, 1 = optional, 2 = alcoholic */
    instructions: string,
    ingredients: string[],
}

// The global array is used when searching by ingredient, 
// since we want the data of each drink to be saved between different function calls
let drinksGlobal: Cocktail[] = [];
let numberOfDrinks: number = 0;

// Function that fetches the information about cocktails to be displayed
async function getCocktails(searchText: FormDataEntryValue, searchType: FormDataEntryValue): Promise<Cocktail[]> {
    // Creates the correct url based on user input
    let url: string = "https://www.thecocktaildb.com/api/json/v1/1/search.php";
    if(typeof searchText === 'string') {
        if(searchType === 'by-name') {
            if(searchText.length == 1) {
                url += '?f=' + searchText;
            } else {
                url += '?s=' + searchText;
            }
        } else if(searchType === 'by-ingredient') {
            url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + searchText;
        } else if(searchType === 'random') {
            url = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
        } else if(searchType === 'by-id') {
            url = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + searchText;
        }
    }
    return await fetch(url)
    .then(res => res.json())
    .then(res => {
        let drinks: Cocktail[] = [];
        res.drinks.forEach((drink: {
            [property: string]: string;
        }) => {
            // Declare temporary variables used to extract information from the drinks object
            let alcoholicNumber: number = 1;
            let ingredientsList: string[] = [];
            // If we don't search by ingredient, we only need one function call to get all data
            if(searchType !== 'by-ingredient') {
                // Get the alcoholic number from the drink object
                if(drink.strAlcoholic == "Alcoholic") alcoholicNumber = 2;
                else if(drink.strAlcoholic == "Non alcoholic") alcoholicNumber = 0;

                // Format ingredients and store in array
                for(let i = 1; i <= 15; i++) {
                    let ingredientProperty: string = 'strIngredient' + i.toString();
                    let measureProperty: string = 'strMeasure' + i.toString();
                    let value: string = '';
                    if(drink[ingredientProperty] === null || drink[ingredientProperty] === undefined) {
                        break;
                    }
                    if(drink[measureProperty] !== null && drink[measureProperty] !== undefined) {
                        value += drink[measureProperty].trim();
                        value += ' ';
                    }
                    value += drink[ingredientProperty].trim();
                    ingredientsList.push(value);
                }
                // Creates a cocktail object with the relevant information to be displayed
                let cocktail = {
                    name: drink.strDrink,
                    image: drink.strDrinkThumb,
                    id: drink.idDrink,
                    alcoholic: alcoholicNumber,
                    instructions: drink.strInstructions,
                    ingredients: ingredientsList,
                };
                // The object is added to the global array if this is one of many calls
                if(searchType === 'by-id') {
                    drinksGlobal.push(cocktail);
                } else {
                    drinks.push(cocktail);
                }
            }
            // If we search by ingredient, one call will be made for each drink
            else {
                numberOfDrinks = res.drinks.length;
                getCocktails(drink.idDrink, 'by-id')
                .then((cocktails) => {
                    cocktails.forEach((cocktail) => {
                        drinksGlobal.push(cocktail);
                    });
                });
            }
        });
        return drinks;
    });
}

// Creates a promise that resolves when the information for each drink has been fetched, 
// or when more than 1 second has passed

// Used when searching by ingredient
function ensureDrinksFetched(len: number): Promise<Cocktail[]> {
    let time = Date.now();
    return new Promise(waitForDrinks);
    function waitForDrinks(this: any, resolve: any, reject: any)
    {
        if (drinksGlobal.length === len || Date.now() - time > 1000)
            resolve(drinksGlobal);
        else
            setTimeout(waitForDrinks.bind(this, resolve, reject), 30);
    }
}

//Navbar indicator
const buttonCOCKTAILS = document.getElementById('navbar-cocktails-button') as HTMLAnchorElement;
buttonCOCKTAILS.classList.add("navbar-selected-button");