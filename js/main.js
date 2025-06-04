const btnTestInterpol = document.querySelector('.btn--interpol');
const btnTestRanUser = document.querySelector('.btn--random-user');
const displayHTML = document.querySelector('.wrapper__results');
let cleanRDI;
let interpolData

// https://ws-public.interpol.int/notices/v1/red/${id}/images/${._embedded.images[0]}
async function getInterpolAPI(id) {
    try {
        const response = await fetch(`https://ws-public.interpol.int/notices/v1/red/${id}`);
        interpolData = await response.json();
        return interpolData
    } catch (error) {
       console.log("Error: ", error);
    }
}

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

function displayInterpol(data, dataImg) {
    displayHTML.innerHTML = "";
    displayHTML.innerHTML += `
    <div class="single__container">
        <div class="single__img"><img src="https://ws-public.interpol.int/notices/v1/red/${dataImg}/images/" alt=""></div>
        <div class="single__infos">
            <div class="single__name">${data.name} ${(data.forename).toLowerCase()}</div>
            <div class="single__sex">${data.sex_id}</div>
            <div class="single__nationality">${data.nationalities.join(', ')}</div>
            <div class="single__warrant">${data.arrest_warrants.map(g => g.charge).join(' | ')}</div>
        </div>
    </div>
    `
}


async function getRandomUserAPI(amount = 50) {
    try {
        const response = await fetch(`https://randomuser.me/api/?inc=gender,name,nat,picture&results=${amount}`)
        const data = await response.json();
        console.log(data.results);
        return (data.results)
    
    } catch (error) {
        console.log('Error: ', error);
    }
}



btnTestInterpol.addEventListener('click', async (e) => {
    const id = await getRandomInterpolIdAPI(); 
    await getInterpolAPI(id);
    displayInterpol(interpolData, cleanRDI);
});


btnTestRanUser.addEventListener('click', async (e)=>{
    await getRandomUserAPI();
})
