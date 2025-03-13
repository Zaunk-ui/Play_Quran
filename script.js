let audio = new Audio();
let audioQueue = [];
let currentIndex = 0;

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

async function loadSurah() {
    let response = await fetch('https://api.alquran.cloud/v1/surah');
    let data = await response.json();
    let surahSelect = document.getElementById('surah');
    surahSelect.innerHTML = '';

    data.data.forEach(surah => {
        let option = document.createElement('option');
        option.value = surah.number;
        option.textContent = `${surah.number}. ${surah.englishName}`;
        surahSelect.appendChild(option);
    });

    loadAyat();
}

async function loadAyat() {
    let surahNumber = document.getElementById('surah').value;
    let response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,ar.alafasy,id.indonesian`);
    let data = await response.json();
    let container = document.getElementById('ayat-container');
    container.innerHTML = '';
    audioQueue = [];

    data.data[0].ayahs.forEach((ayat, index) => {
        let div = document.createElement('div');
        div.className = 'ayat';
        div.innerHTML = `<p>${ayat.text}</p>
                         <p><i>${data.data[2].ayahs[index].text}</i></p>
                         <p>${data.data[1].ayahs[index].text}</p>`;
        container.appendChild(div);
        audioQueue.push(data.data[1].ayahs[index].audio);
    });

    currentIndex = 0;
}

function playAll() {
    if (audioQueue.length === 0) return;
    currentIndex = 0;
    playNext();
}

function playNext() {
    if (currentIndex < audioQueue.length) {
        audio.src = audioQueue[currentIndex];
        audio.play();
        audio.onended = () => {
            currentIndex++;
            playNext();
        };
    }
}

loadSurah();