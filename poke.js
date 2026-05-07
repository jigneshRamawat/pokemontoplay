let limit = 20;
let offset = 0;
let pokemonTypeUrl = "https://pokeapi.co/api/v2/type/";
const URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
const serch = document.querySelector('#searchInput');
const serchResult = document.querySelector('#searchResult');
const container = document.querySelector('#container');
const button = document.querySelector('button');
const categorySelect = document.querySelector('#categorySelect');

async function getdata(URL){
    const res = await fetch(URL);
    const data = await res.json();
    return data;
}
let allpokemon = [];


window.addEventListener('load', async () => {
    const result = await getdata(URL);
     const arr =  result.results; 
     const promises = arr.map((i)=> getdata(i.url));

     const alldata = await Promise.all(promises);
     console.log(alldata);
     allpokemon =alldata;
     displaydata(alldata);

    loadPokemonTypes();

})

function displaydata(alldata, clear = true){
      if(clear){
        container.innerHTML = "";
    }
    alldata.map((item)=>{
        let card = document.createElement('div');
        card.classList.add('card')
        let cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        let cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        let cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        let cardImage = document.createElement('img');
        let h2 = document.createElement('h2');
        let p = document.createElement('p');
        h2.classList.add('title');
        p.classList.add('decription');
        cardImage.src = item.sprites.other.dream_world.front_default;
        h2.innerText = item.name;
        p.innerHTML = `<strong>Type:</strong> ${item.types[0].type.name}`;
        let backTitle = document.createElement('h2');
        let height = document.createElement('p');
        let weight = document.createElement('p');
        backTitle.innerText = item.name;
        height.innerText = `Height: ${item.height}`;
        weight.innerText = `Weight: ${item.weight}`;
        cardFront.append(cardImage,h2,p);
        cardBack.append(backTitle,height,weight)
        cardInner.append(cardFront,cardBack);
        card.append(cardInner);
        container.append(card);
        
     

    });

}

serch.addEventListener('keyup',()=>{
    const value = serch.value.toLowerCase();
    const filterpokemon = allpokemon.filter((i)=>{
        return i.name.toLowerCase().includes(value);

    })
    showSerchResult(filterpokemon);
 }
)

function showSerchResult(data){
    serchResult.innerHTML = "";
    data.map((item)=>{
        let div = document.createElement('div');
        div.classList.add('card');
        div.style.width = "200px";

        let img = document.createElement('img');
       
        img.src = item.sprites.other.dream_world.front_default;
        let h2 = document.createElement('h2');
        h2.style.color = "white";
        h2.style.textTransform = "capitalize";
        h2.innerText = item.name;
        let p = document.createElement('p');
        p.innerHTML = `<strong>Type:</strong> ${item.types[0].type.name}`;
        p.style.color = "white";
        div.append(img,h2,p);
        serchResult.append(div);
    })
}

button.addEventListener('click',async()=>{
     offset += limit;
    const result = await getdata(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
     const arr =  result.results; 
     const promises = arr.map((i)=> getdata(i.url));
     const alldata = await Promise.all(promises);
     console.log(alldata);
     allpokemon =[...allpokemon, ...alldata];
     displaydata(allpokemon);
})

categorySelect.addEventListener('change', ()=>{

    const value = categorySelect.value;

    if(value === ""){

        showSerchResult(allpokemon);

        return;
    }

    const filterpokemon = allpokemon.filter((item)=>{

        return item.types.some((type)=>{

            return type.type.name === value;

        });

    });

    showSerchResult(filterpokemon);

});

function showType(data){
    serchResult.innerHTML = "";
    data.map((item)=>{
        let div = document.createElement('div');
        div.classList.add('card');
        div.style.width = "200px";

        let h2 = document.createElement('h2');
        h2.innerText = item.name;
        h2.style.color = "white";
        div.append(h2);
        serchResult.append(div);
    })
}   
async function loadPokemonTypes(){

    const result = await getdata(pokemonTypeUrl);

    result.results.forEach((item)=>{

        let option = document.createElement('option');

        option.value = item.name;

        option.innerText = item.name;

        categorySelect.append(option);

    });

}