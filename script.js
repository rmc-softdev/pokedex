const toggle = document.querySelector(".toggle");
const close = document.getElementById("close");
const open = document.getElementById("open");
const modal = document.getElementById("modal");

const search = document.getElementById("search"),
  searchTeam = document.getElementById("searchTeam"),
  submit = document.getElementById("submit"),
  submitTeam = document.getElementById("submitTeam"),
  showcase = document.querySelector(".pokeShowcase"),
  cards = document.querySelector(".pokeCards"),
  addteam = document.querySelector(".btn.add");
(pokecard = document.querySelector(".card")),
  (selectedPokeContainer = document.getElementById("selectedPokeContainer")),
  (chosenPokemon = document.querySelector(".chosenPokemon")),
  (imgContainer = document.querySelector(".imgContainer")),
  (infoContainer = document.querySelector(".infoContainer"));

let allNames = [];
let usefulData = [];
//Main section

// Fetching data from the main API
function fetchPokemons() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=151") //fetchs 151 pokes, the annoying thing is we have to wait for too many requisitions, I don't think this API has a way around it with a single request, at least I can't see it in the documentation, so we've restricted it to the Kanto Era;
    .then((dataBlob) => dataBlob.json())
    .then((allpokemons) => {
      allpokemons.results.forEach((pokemon) => fetchPokemonData(pokemon));
      allpokemons.results.forEach((pokemon) =>
        allNames.push(
          pokemon.name.charAt(0).toUpperCase() +
            pokemon.name.slice(1).toLowerCase()
        )
      ); // it "renders" an array with all the pokémon's name we'll be using, it's here because dealing with the pokeData to do so became troublesome because the way the API utilizes the nested objects
    });
  // getting each Poke's data themselves
  function fetchPokemonData(pokemon) {
    let url = pokemon.url;
    fetch(url)
      .then((dataBlob) => dataBlob.json())
      .then((pokeData) => {
        pokeData.name =
          pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1); //adjusts the first letter to uppercase
        usefulData.push(pokeData);
        displaysAllPokemons(); // initially showcases our Pokémons
      });
  }
}

fetchPokemons();

// This will handle & process all the relevant data in order to print it out with the display function
function processingPokeData() {
  usefulData.forEach((el) => {
    if (pokeMatchArray.includes(el.name)) {
      let cardsContainer = document.getElementById("cards-container"); // note the plural, this regards all of them
      let cardContainer = document.createElement("div");
      let cardinfoContainer = document.createElement("div");
      // attributes to be displayed at cardInfo
      let pokeName = document.createElement("h2");
      pokeName.innerText = el.name;
      let pokeNumber = document.createElement("h3");
      pokeNumber.innerText = `#${el.id}`;
      let pokeTypes = document.createElement("ul");
      let pokeAbilities = document.createElement("ul");

      cardContainer.classList.add("poke", "card");
      cardinfoContainer.classList.add("pokeInfo");
      pokeTypes.classList.add("pokeTypes");
      pokeAbilities.classList.add("pokeAbilities");
      pokeName.classList.add("pokeName");
      pokeNumber.classList.add("pokeNumber");

      renderAbilities(el.abilities, pokeAbilities);
      renderImage(el.id, cardContainer);
      renderTypes(el.types, pokeTypes); // it should append to the ul above as li

      cardinfoContainer.append(pokeName, pokeNumber, pokeTypes, pokeAbilities); // !IMPORTANT: it renders the whole card with useful infos!
      cardContainer.append(cardinfoContainer);
      cardsContainer.appendChild(cardContainer); // append each card to the "main" card container, notice the plural again
    }
  });
  pokeMatchArray = [];
}

// these are auxiliary functions that process & render the data
function renderAbilities(abilities, ul) {
  let text = document.createElement("h2");
  text.innerText = "Moves";
  ul.append(text);
  abilities.forEach((el) => {
    let abilitiesLi = document.createElement("li");
    abilitiesLi.innerText = el.ability.name;
    ul.append(abilitiesLi);
  });
}

function renderTypes(types, ul) {
  let text = document.createElement("h2");
  text.innerText = "Type";
  ul.append(text);
  types.forEach((type) => {
    let typeLi = document.createElement("li");
    let eachType = type["type"]["name"];
    typeLi.style.backgroundColor = `var(--${eachType})`; // retrieves from this nested object the type and inserts each to a li;
    typeLi.innerText = eachType;
    ul.append(typeLi);
  });
}

function renderImage(poke, containerDiv) {
  let pokeImgContainer = document.createElement("div");
  pokeImgContainer.classList.add("image");

  let pokeImage = document.createElement("img");
  pokeImage.srcset = `https://pokeres.bastionbot.org/images/pokemon/${poke}.png`; // the main API has lacking images, so we'll be using this one instead
  pokeImgContainer.append(pokeImage);
  containerDiv.append(pokeImgContainer);
}

// search mechanism
function findMatches(wordToMatch, namesArray) {
  const regex = new RegExp(`^${wordToMatch}`, "gi"); //the ^ inside the template is to make sure I get only the begining of it, if you forget about it remember to do names => console.log(regex)
  return namesArray.filter((names) => {
    return names.match(regex);
  });
}
//adjusts the first letter to uppercase)
let pokeMatchArray = [];
function displayMatches() {
  let cards_container = document.getElementById("cards-container");
  cards_container.innerHTML = ""; // cleans the result for a new search
  let matchPokeArray = findMatches(search.value.trim(), allNames); //temporary arr to hold our matches
  matchPokeArray.forEach((el) => pokeMatchArray.push(el));
  processingPokeData();
}

function displaysAllPokemons() {
  usefulData.sort((a, b) => (a.id > b.id ? 1 : -1));
  if (usefulData.length === 151) {
    usefulData.forEach((el) => {
      let cardsContainer = document.getElementById("cards-container"); // note the plural, this regards all of them
      let cardContainer = document.createElement("div");
      let cardinfoContainer = document.createElement("div");
      // attributes to be displayed at cardInfo
      let pokeName = document.createElement("h2");
      pokeName.innerText = el.name;
      let pokeNumber = document.createElement("h3");
      pokeNumber.innerText = `#${el.id}`;
      let pokeTypes = document.createElement("ul");
      let pokeAbilities = document.createElement("ul");
      //adding some classes to them
      cardContainer.classList.add("poke", "card");
      cardinfoContainer.classList.add("pokeInfo");
      pokeTypes.classList.add("pokeTypes");
      pokeAbilities.classList.add("pokeAbilities");
      pokeName.classList.add("pokeName");
      pokeNumber.classList.add("pokeNumber");
      //useful functions defined below
      renderAbilities(el.abilities, pokeAbilities);
      renderImage(el.id, cardContainer);
      renderTypes(el.types, pokeTypes); //  appends to the ul PokeTypes above as li
      cardinfoContainer.append(pokeName, pokeNumber, pokeTypes, pokeAbilities); // !IMPORTANT: it renders the whole card with useful infos!
      cardContainer.append(cardinfoContainer);
      cardsContainer.appendChild(cardContainer); // append each card to the "main" card container, notice the plural again
    });
  }
}

function renderSelectedImage(poke, pokeContainer) {
  let pokeImgContainer = document.createElement("div");
  pokeImgContainer.classList.add("selectedPokeImage");

  let pokeImage = document.createElement("img");
  pokeImage.srcset = `https://pokeres.bastionbot.org/images/pokemon/${poke}.png`; // the main API has lacking images, so we'll be using this one instead
  pokeImgContainer.append(pokeImage);
  pokeContainer.append(pokeImgContainer);
}

let teamMatchArray = [];
function processingPokeTeam() {
  const poke = findMatches(searchTeam.value.trim(), allNames);
  const searchedPoke =
    searchTeam.value.trim().charAt(0).toUpperCase() +
    searchTeam.value.trim().slice(1).toLowerCase(); // here I make sure you can get by even if you type something silly like piKaChU
  if (searchedPoke == poke) {
    usefulData.forEach((el) => {
      if (poke.includes(el.name)) {
        const poke = {
          id: el.id,
          name: el.name,
        };
        teamMatchArray.push(poke);
        let pokeContainer = document.createElement("div");
        let pokeInfoContainer = document.createElement("div");
        // attributes to be displayed at cardInfo
        let pokeEXP = document.createElement("h4");
        pokeEXP.innerHTML = `EXP: ${el.base_experience}`;
        let deleteButton = document.createElement("div");
        deleteButton.innerHTML = `<button class="btn delete" onclick="removePoke(${poke.id})">x</button>`;
        let pokeTypes = document.createElement("ul");
        //useful to styling
        pokeContainer.classList.add("selected", "poke");
        pokeContainer.setAttribute("id", poke.id);
        pokeInfoContainer.classList.add("selectedPokeInfo");
        pokeTypes.classList.add("selectedPokeTypes");
        deleteButton.classList.add("btn", "delete");
        //useful functions defined in the global scope
        renderSelectedImage(el.id, pokeContainer);
        renderTypes(el.types, pokeTypes); // it should append to the ul above as li

        pokeInfoContainer.append(pokeEXP, pokeTypes, deleteButton); // !IMPORTANT: it renders the whole card with useful infos!
        pokeContainer.append(pokeInfoContainer);
        selectedPokeContainer.appendChild(pokeContainer); // append each card to the "main" card container, notice the plural again
      }
    });
  }
  console.log(teamMatchArray);
  searchTeam.value = "";
}

function removePoke(id) {
  var element = document.getElementById(`${id}`);
  element.parentNode.removeChild(element);
}

//Team building section

/* If we want, we can also make it functional with the submit mechanism:

function submitSearch(e) {
  e.preventDefault();
  let cards_container = document.getElementById("cards-container");
  cards_container.innerHTML = ""; // cleans the result for a new search
  let matchPokeArray = findMatches(search.value, allNames);
  matchPokeArray.forEach(el => pokeMatchArray.push(el));
  processingPokeData();


  submit.addEventListener("submit", submitSearch);

}
*/

function addTeam(e) {
  e.preventDefault();
  processingPokeTeam();
  event.target.value = "";
}

//This regards the toggling of the Nav
toggle.addEventListener("click", () =>
  document.body.classList.toggle("show-nav")
);

// These handle the Sign Up Modal, the first one shows it
open.addEventListener("click", () => modal.classList.add("show-modal"));

// Hide modal
close.addEventListener("click", () => modal.classList.remove("show-modal"));

// Hide modal on outside click
window.addEventListener("click", (e) =>
  e.target == modal ? modal.classList.remove("show-modal") : false
);

//add Event Listeners
submitTeam.addEventListener("submit", addTeam);
submit.addEventListener("change", displayMatches);
submit.addEventListener("keyup", displayMatches);
