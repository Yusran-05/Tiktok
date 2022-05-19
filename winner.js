// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click", function () {
  reloadVideo(tiktokDiv);
});



// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

showWinningVideo()

async function showWinningVideo() {

  const res = await sendGetRequest("getWinner");

  if (res == null) {
    location.assign("/");
  }
  else {
    document.getElementById("nickname").innerHTML = res.nickname;

    let winningUrl = res.url;
    addVideo(winningUrl, divElmt);
    loadTheVideosScript();
  }

}

