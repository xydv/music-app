let currentSong = new Audio();
let inputsong = document.getElementById("songinput");
let tooltip = document.getElementById("songtooltips");
let songsarr = [];

function secondsToMMSS(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  if (formattedMinutes == "NaN") return "00:00";

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
  localStorage.setItem(
    "lastSongPlayed",
    JSON.stringify({
      track,
      name,
      image,
    })
  );
  document.querySelector(".songinfo").innerHTML = `<div class="songinfo-div"> 
  <div> <img style="width : 70px" src="${image}" alt="img description"> </div> 
 <div>${name} </div>
 </div>`;

  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

const fetchPlaylist = async (id) => {
  let response = await fetch(`http://localhost:3000/playlist?id=${id}`);
  let { songs } = await response.json();
  songsarr = songs.map((song) => {
    return {
      url: song.downloadUrl[4].link,
      image: song.image[1].link,
      name: song.name,
    };
  });
  let songUL = document.querySelector(".sg-name").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li class="playnash" onclick="playMusic('${song.downloadUrl[4].link}', '${song.name}',' ${song.image[1].link}')">
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

  if (!localStorage.getItem("lastSongPlayed")) {
    play.src = "/svgs/play.svg";
    document.getElementsByClassName("playnash")[0].click();
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

  document.getElementsByClassName("circle-g")[0].click();

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
    localStorage.setItem("lastSongPlayedTime", currentSong.currentTime);
    localStorage.setItem("lastSongDuration", currentSong.duration);
    // console.log(currentSong.currentTime, currentSong.duration);
    // document.querySelector(".songtime").innerHTML = ;
    document.querySelector(".songtime").innerHTML = `${secondsToMMSS(
      currentSong.currentTime
    )} / ${secondsToMMSS(currentSong.duration)}`;
    document.querySelector(".seekbar-circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";

    if (currentSong.currentTime == currentSong.duration) {
      next.click();
    }
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
    if (e.keyCode == 32) {
      if (e.target == inputsong) {
        return;
      }
      e.preventDefault();
      play.click();
    } else if (e.keyCode == 37) {
      e.preventDefault();
      previous.click();
    } else if (e.keyCode == 39) {
      e.preventDefault();
      next.click();
    }
  });
}

let slider = document.querySelector(".range").getElementsByTagName("input")[0];

slider.oninput = function () {
  localStorage.setItem("volume", this.value);
  currentSong.volume = parseInt(this.value) / 100;
  if (currentSong.volume) {
    volicon.src = "/svgs/unmute.svg";
  } else {
    volicon.src = "/svgs/mute.svg";
  }
};

let volbutton = document.querySelector(".vol-butt");
let volicon = document.querySelector(".vol-icon");

volbutton.addEventListener("click", () => {
  if (currentSong.volume) {
    volicon.src = "/svgs/mute.svg";
    currentSong.volume = 0;
    localStorage.setItem("volume", 0);
    slider.value = 0;
  } else {
    volicon.src = "/svgs/unmute.svg";
    currentSong.volume = 1;
    localStorage.setItem("volume", 100);
    slider.value = 100;
  }
});

previous.addEventListener("click", () => {
  let index = songsarr.map((song) => song.url).indexOf(currentSong.src);
  if (index - 1 >= 0) {
    let songtbp = songsarr[index - 1];
    playMusic(songtbp.url, songtbp.name, songtbp.image);
  }
});

next.addEventListener("click", () => {
  let index = songsarr.map((song) => song.url).indexOf(currentSong.src);
  if (index + 1 >= length) {
    let songtbp = songsarr[index + 1];
    playMusic(songtbp.url, songtbp.name, songtbp.image);
  }
});

inputsong.addEventListener("input", async (e) => {
  if (!e.target.value.trim()) {
    location.reload();
    return;
  }
  tooltip.innerText = `Search results for ${e.target.value}`;
  let response = await fetch(
    `http://localhost:3000/search?q=${e.target.value}`
  );
  let songs = await response.json();
  let songUL = document.querySelector("#container");
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `<div class="card border">
          <img class="border" src="${song.image[1].link}" alt="playlist">
          <img onclick="playMusic('${song.downloadUrl[4].link}', '${song.name}',' ${song.image[1].link}')" class="circle-g" src="svgs/play.svg" alt="">
          <h4>${song.name}</h4>
          <p>${song.primaryArtists}</p>
      </div>`;
  }
});

main();

window.addEventListener("load", () => {
  let savedSong = JSON.parse(localStorage.getItem("lastSongPlayed"));
  playMusic(savedSong.track, savedSong.name, savedSong.image);

  let lastTimer = parseFloat(localStorage.getItem("lastSongPlayedTime"));
  let lastSongDuration = parseFloat(localStorage.getItem("lastSongDuration"));

  document.querySelector(".seekbar-circle").style.left =
    (lastTimer / lastSongDuration) * 100 + "%";

  currentSong.currentTime =
    lastSongDuration * (lastTimer / lastSongDuration) || 0;

  play.src = "/svgs/play.svg";

  currentSong.volume = parseInt(localStorage.getItem("volume")) / 100 || 0.5;
  slider.value = localStorage.getItem("volume");

  if (localStorage.getItem("volume") == 0) {
    volicon.src = "/svgs/mute.svg";
  } else {
    volicon.src = "/svgs/unmute.svg";
  }
});
