let currentSong = new Audio();

function secondsToMMSS(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let response = await fetch("http://localhost:3000/home");
  let songs = await response.json();
  return songs;
}

const playMusic = (track, name, image, pause = false) => {
  currentSong.src = track;
  if (!pause) {
    currentSong.play();
    play.src = "/svgs/pause.svg";
  }
  // document.querySelector(".songinfo").innerHTML =  image;
  //   const img = document.createElement("img");
  //  img.src = image;

  //  img.alt = "Image description";

  //  document.querySelector(".songinfo").innerHTML = ;

  document.querySelector(".songinfo").innerHTML = `<div class="songinfo-div"> 
  <div> <img style="width : 70px" src="${image}" alt="img description"> </div> 
 <div>${name} </div>
 </div>`;

  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

const fetchPlaylist = async (id) => {
  let response = await fetch(`http://localhost:3000/playlist?id=${id}`);
  let { songs } = await response.json();
  let songUL = document.querySelector(".sg-name").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li onclick="playMusic('${song.downloadUrl[4].link}', '${song.name}',' ${song.image[1].link}')">
    <div class="container-lib-sg flex align_item gap"><div class="lib-sg-1 flex align_item gap">
    <img style="width: 40px" src="${song.image[1].link}" alt="">
        </div>
    <div class="lib-sg-2 flex">
        <span>${song.name}</span>
        <span>${song.primaryArtists}</span>
    </div>
    <div class="lib-sg-3 flex align_item ">
        <img class="invert" src="svgs/playleft.svg" alt="">
    </div>
</li>`;
  }
};

async function main() {
  let songs = await getSongs();
  let songUL = document.querySelector("#container");

  for (const song of songs) {
    songUL.innerHTML += `<div class="card border">
            <img class="border" src="${song.image[1].link}" alt="playlist">
            <img onclick="fetchPlaylist(${song.id})" class="circle-g" src="svgs/play.svg" alt="">
            <h4>${song.title}</h4>
            <p>${song.subtitle}</p>
        </div>`;
  }

  // Attach an event to play if pause and pause if play
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/svgs/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/svgs/play.svg";
    }
    0;
  });

  // listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    // document.querySelector(".songtime").innerHTML = ;
    document.querySelector(".songtime").innerHTML = `${secondsToMMSS(
      currentSong.currentTime
    )} / ${secondsToMMSS(currentSong.duration)}`;
    document.querySelector(".seekbar-circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    // console.log("OffsetX:", e.offsetX, "Width:", e.target.getBoundingClientRect().width, "Percent:", percent);
    document.querySelector(".seekbar-circle").style.left = percent + "%";
    // Calculate the new current time based on the percentage of the total duration
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // spacebar event to play/pause music
  window.addEventListener("keydown", (e) => {
    console.log(e);
    if (e.keyCode == 32) {
      e.preventDefault();
      play.click();
    }
  });
}

let slider = document.querySelector(".range").getElementsByTagName("input")[0];

slider.oninput = function () {
  currentSong.volume = parseInt(this.value) / 100;
  //   this.style.background =
  //     "linear-gradient(to right, #82CFD0 0%, #82CFD0 " +
  //     value +
  //     "%, #fff " +
  //     value +
  //     "%, white 100%)";
};

let buttimg = document.querySelector(".vol-icon");
let flag = 0;
let button = document.querySelector(".vol-butt");

button.addEventListener("click", () => {
  if (flag == 0) {
    currentSong.muted = true;
    // buttimg.src===newsrc;
    flag = 1;
  } else {
    flag = 0;
    // buttimg.src===oldsrc;
    currentSong.muted = false;
  }
});

main();
