let pokemons = [' '];
let currentlyShowingAmount = 0;
let maxIndex = 150;
let currentList = [];
let favoriteList = [];

const typeColors = {
    'normal': '#BCBCAC',
    'fighting': '#BC5442',
    'flying': '#669AFF',
    'poison': '#AB549A',
    'ground': '#DEBC54',
    'rock': '#BCAC66',
    'bug': '#ABBC1C',
    'ghost': '#6666BC',
    'steel': '#ABACBC',
    'fire': '#FF421C',
    'water': '#2F9AFF',
    'grass': '#78CD54',
    'electric': '#FFCD30',
    'psychic': '#FF549A',
    'ice': '#78DEFF',
    'dragon': '#7866EF',
    'dark': '#785442',
    'fairy': '#FFACFF',
    'shadow': '#0E2E4C'
};
if(document.title=="PokeApi"){
    document.getElementById("index_body").addEventListener("load", getAllNames());
    document.getElementById("search-input").onkeydown = function() {search()};
    if(localStorage.getItem("log")==0) location.href = "./pages/authentication.html";
}
else if(document.title=="PokeApi Favorites"){
    document.getElementById("body_favorites").addEventListener("load", getAllNames());
    if(localStorage.getItem("log")==0) location.href = "authentication.html";
    
}
else if(document.title=="PokeApi Authentication"){
    document.getElementById("body_auth").addEventListener("load", auth());
    document.getElementById("checkb").onclick = function() {log_reg()};
    document.getElementById("lr_btn").onclick = function() {submit()};
}

async function getAllNames() {
    localStorage.setItem("username", "admin");
    localStorage.setItem("password", "admin");
    let url = 'https://pokeapi.co/api/v2/pokemon/?limit=898';
    let response = await fetch(url);
    let responseAsJson = await response.json();

    for (let i = 0; i < responseAsJson.results.length; i++) {
        pokemons.push({
            id: i + 1,
            name: responseAsJson.results[i].name,
            types: []
        });
    };

    getAllTypes();
};

async function getAllTypes() {
    for (let i = 0; i < 18; i++) {
        let url = 'https://pokeapi.co/api/v2/type/' + (i + 1)
        let response = await fetch(url)
        let responseAsJson = await response.json()

        const pokemonInType = responseAsJson.pokemon
        
        for(j = 0; j < pokemonInType.length; j++) {
            const pokemonId = pokemonInType[j].pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');

            if(pokemonId <= pokemons.length && pokemons[pokemonId]) {
                pokemons[pokemonId].types.push(responseAsJson.name);
            };
        };
    };

    loadingCompletion();
};

function loadingCompletion() {
    const loadingDiv = document.getElementById('loading-div');
    loadingDiv.classList.add('hideLoading');

    setTimeout(function() {
        loadingDiv.classList.replace('hideLoading', 'hide');
        document.body.style.overflow = 'unset';
    }, 500);

    pokemons.splice(0, 1);
    currentList = pokemons;
    
    updatePokemonList();
};

function updatePokemonList() {
    if (currentlyShowingAmount <= maxIndex) {
        renderPokemonListItem(currentlyShowingAmount);
    };
};

function renderPokemonListItem(index) {
    array=localStorage.getItem("favoritelocal");
    bcolor="white"
    if(array!=""){
        array=array.split(",");
        for (let i = 0; i < array.length-1; i++) {
            if(currentList[index].id==array[i]) bcolor="green"
        }
    }
    if(document.title=="PokeApi Favorites"){
        if(bcolor=="green"){
            document.getElementById('pokedex-list-render-container').insertAdjacentHTML('beforeend', `<div style="border: 3px solid ${bcolor}" class="pokebox" id="box${currentList[index].id}">
                                                                                                <img class="pokebox-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentList[index].id}.png">
                                                                                                <h3>${dressUpPayloadValue(currentList[index].name)}</h3>
                                                                                                ${getTypeContainers(currentList[index].types)}
                                                                                            </div>`);
            document.getElementById("box"+currentList[index].id).onclick = function() {addfavorite(currentList[index].id)};
    }}
        else{
            document.getElementById('pokedex-list-render-container').insertAdjacentHTML('beforeend', `<div style="border: 3px solid ${bcolor}" class="pokebox" id="box${currentList[index].id}">
                                                                                                <img class="pokebox-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentList[index].id}.png">
                                                                                                <h3>${dressUpPayloadValue(currentList[index].name)}</h3>
                                                                                                ${getTypeContainers(currentList[index].types)}
                                                                                            </div>`);
            document.getElementById("box"+currentList[index].id).onclick = function() {addfavorite(currentList[index].id)};
    }
    currentlyShowingAmount += 1;
    updatePokemonList();
};

function increaseMaxIndex(by) {
    if (maxIndex + by <= currentList.length) {
        maxIndex += by;
    } else {
        maxIndex = currentList.length - 1;
    };
};

function getTypeContainers(typesArray) {
    let htmlToReturn = '<div class="row">';

    for (let i = 0; i < typesArray.length; i++) {
        htmlToReturn += `<div class="type-container" style="background: ${typeColors[typesArray[i]]};">
                                ${dressUpPayloadValue(typesArray[i])}
                            </div>`;
    };

    return htmlToReturn + '</div>';
};

function search() {
    setTimeout(function () {
        let searchResults = [];

        for (let i = 0; i < pokemons.length; i++) {
            if (pokemons[i].name) {
                if (pokemons[i].name.replaceAll('-', ' ').includes(document.getElementById('search-input').value.toLowerCase())) {
                    searchResults.push(pokemons[i]);
                };
            };
        };

        document.getElementById('pokedex-list-render-container').innerHTML = '';

        currentList = searchResults;
        currentlyShowingAmount = 0;
        maxIndex = 0;

        increaseMaxIndex(30);
        updatePokemonList();
    }, 1);
};

window.addEventListener('scroll', function () {
    addNewScrollPokemon();
});

function addNewScrollPokemon() {
    if (window.scrollY + 100 >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
        increaseMaxIndex(30);
        updatePokemonList();
    };
};

function dressUpPayloadValue(string) {
    let splitStr = string.toLowerCase().split('-');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    };
    return splitStr.join(' ');
};

let removeElement = (del) => {
    newlist=[]
    array=localStorage.getItem("favoritelocal")
    array=array.split(",")
    for (let i = 0; i < array.length; i++) {
        if(array[i]==del){
            continue
        }
        newlist+=array[i]+","
    }
    return newlist
  };

function addfavorite(postid){
    boxid=document.getElementById("box"+postid)
    if(boxid.style.border=="3px solid green"){
        boxid.style.border="3px solid white";
        localStorage.setItem("favoritelocal", removeElement(postid));
    }
    else{
        boxid.style.border="3px solid green";
        localStorage.setItem("favoritelocal", localStorage.getItem("favoritelocal")+postid+",");
    }
    
}

function auth(){
    if(localStorage.getItem("log")==1){
        location.href = "../index.html";
    }
    title=document.getElementById("title");
    nametext=document.getElementById("nametext");
    passwordtext=document.getElementById("password");
    lr_btn=document.getElementById("lr_btn");
    email=document.getElementById("email");
    logbox=document.getElementById("logbox");
    checkb=document.getElementById("checkb");
}

function log_reg(){
    if(checkb.className=="on"){
        title.innerHTML="Log-In"
        email.style.display="none"
        lr_btn.value="Login"
        logbox.style.height="400px";
        checkb.className="off"
    }
    else if(checkb.className=="off"){
        title.innerHTML="Register in PokeApi"
        email.style.display="block"
        lr_btn.value="Register"
        logbox.style.height="500px";
        checkb.className="on";
    }
console.log(checkb.className)
}

function submit(){
    if(checkb.className=="off"){
        console.log("btnindex");
        if(nametext.value==localStorage.getItem("username") && password.value==localStorage.getItem("password")){
                localStorage.setItem("log", 1);
                alert("Giriş Yapıldı!");
                window.location.reload(true);
        }
    }
    else if(checkb.className=="on"){
        if(nametext.value!="" && password.value!="" && email.value!=""){
            localStorage.setItem("username", nametext.value);
            localStorage.setItem("password", password.value);
            localStorage.setItem("email", email.value);
            alert("Kayıt Başarılı!");
            window.location.reload(true);
        }
}
}