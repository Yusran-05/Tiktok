let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i = 0; i < 2; i++) {
  let reload = reloadButtons[i];
  let heart = heartButtons[i];
  reload.addEventListener("click", function () { reloadVideo(videoElmts[i]) });
  heart.addEventListener("click", function () { heartVideo(heartButtons[i]) });

  heartButtons[i].classList.add("unloved");
} // for loop

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
// const urls = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
//   "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];

// for (let i = 0; i < 2; i++) {
//   addVideo(urls[i], videoElmts[i]);
// }
// load the videos after the names are pasted in! 

(async () => {
  loadTheVideosScript();

  const getVideos = await sendGetRequest("GetTwoVideos");

  if (getVideos.res == "pick winner") {
    location.assign("/winner");
  }
  else {
    for (let i = 0; i < 2; i++) {
      addVideo(getVideos[i].url, videoElmts[i]);
      heartButtons[i].setAttribute("videoId", getVideos[i].rowIdNum);
    }
  }

})();


async function next() {
  let lovedElem = document.querySelector("div.heart:not(.unloved)");
  let unlovedElem = document.querySelector("div.heart.unloved");

  if (lovedElem) {
    var better = lovedElem.getAttribute("videoId");
    var worse = unlovedElem.getAttribute("videoId");

    const res = await sendPostRequest("insertPref", { better, worse });

    if (res == "pick winner") {
      location.assign("/winner");
    }
    else {
      location.reload();
    }

  }
  else {
    alert("Please Select ant 1 favorite")
  }

}


