const btnTestInterpol = document.querySelector('.btn--interpol');
const btnTestRanUser = document.querySelector('.btn--random-user');
const displayHTML = document.querySelector('.wrapper__results');
const scoreHTML = document.querySelector('.wrapper__score');

let score = 0;

let cleanRDI;
let interpolData;
let interpolImg;
let userData;


// == Fetch Interpol API Data of one data
async function getInterpolAPI(id) {
    try {
        const response = await fetch(`https://ws-public.interpol.int/notices/v1/red/${id}`);
        interpolData = await response.json();
        return interpolData
    } catch (error) {
       console.log("Error: ", error);
    }
}

// == Fetch Interpol API Image based on a random data
async function getInterpolImg(id) {
    try {
        const response = await fetch(`https://ws-public.interpol.int/notices/v1/red/${id}/images/`);
        const data = await response.json();
        interpolImg = data._embedded.images[0].picture_id;
        return interpolImg
    } catch (error) {
       console.log("Error: ", error);
    }
}

// == Fetch Interpol API for 100 data and pick a random one
async function getRandomInterpolIdAPI() {
    try {
        const response = await fetch(`https://ws-public.interpol.int/notices/v1/red?resultPerPage=100`);
        const data = await response.json();
        const dataNotices = data._embedded.notices;
        const randomData = dataNotices[Math.floor(Math.random() * dataNotices.length)];
        const randomDataID = randomData.entity_id;
        cleanRDI = randomDataID.replace("/", "-");
        console.log(randomData);
        console.log(cleanRDI);
        return cleanRDI
    } catch (error) {
       console.log("Error: ", error);
    }
}

// == Display Data of Interpol
function displayInterpol(data, dataImg) {
    displayHTML.innerHTML = "";
    let nationality;
    data.nationalities ? nationality = data.nationalities.join(', ') : "";


    displayHTML.innerHTML += `
    <div class="single__container">
        <div class="single__img"><img src="https://ws-public.interpol.int/notices/v1/red/${dataImg}/images/${interpolImg}" alt="picture interpole"></div>
        <div class="single__infos" data-info="interpol">
            <div class="single__name">${data.name} ${(data.forename).toLowerCase()}</div>
            <div class="single__sex"><span class="bold">Gender:</span> ${data.sex_id}</div>
            <div class="single__nationality"><span class="bold">Nationalities:</span> ${nationality}</div>
            <div class="single__warrant">
                <h3>Arrest Warrant:</h3>
                <p>${data.arrest_warrants.map(g => g.charge).join(' | ')}</p>
            </div>
        </div>
    </div>
    `
}

// == Fetch a random fake user API
async function getRandomUserAPI() {
    try {
        const response = await fetch(`https://randomuser.me/api/?inc=gender,name,nat,picture`)
        const data = await response.json();
        userData = data.results[0]
        console.log(userData);
        
        return (userData)
    
    } catch (error) {
        console.log('Error: ', error);
    }
}

// == Display a Random fake user
function displayRandomUser(data) {
    displayHTML.innerHTML = "";
    displayHTML.innerHTML += `
    <div class="single__container">
        <div class="single__img single__img--user"><img src="${data.picture.large}" alt="picture large"></div>
        <div class="single__infos">
            <div class="single__name">${(data.name.last).toUpperCase()} ${data.name.first}</div>
            <div class="single__sex"><span class="bold">Gender:</span> ${data.gender}</div>
            <div class="single__nationality"><span class="bold">Nationalities:</span> ${data.nat}</div>
        </div>
    </div>
    `
}

async function Init() {
    scoreHTML.textContent = `Score : ${score}`
    const id = await getRandomInterpolIdAPI(); 
    await getInterpolAPI(id);
    await getInterpolImg(id);
    await getRandomUserAPI();
    const functionsArray = [displayRandomUser(userData),displayInterpol(interpolData, cleanRDI)]

    functionsArray[Math.floor(Math.random() * functionsArray.length)];
}

Init();

btnTestInterpol.addEventListener('click', async (e) => {
    const dataAttr = document.querySelector('.single__infos');
    if (dataAttr.dataset.info == "interpol") {
        console.log("Nice guess");
        score++;
        Init();
    } else {
        console.log("Wrong guess");
        Init();
    }
});


btnTestRanUser.addEventListener('click', async (e)=>{
    const dataAttr = document.querySelector('.single__infos');
    if (dataAttr.dataset.info == "interpol") {
        console.log("Wrong guess");
        Init();
    } else {
        console.log("Nice guess"); 
        score++;
        Init();
        
    }
})
