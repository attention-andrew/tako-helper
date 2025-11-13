// 6-11-25
// Script for loading YTV, speed controls, & looping video @ certain times¬

/*
TODO:
    [x] - update function for handleUrlSubmit(event) to only grab id
        [x] - take user video 'id' & insert into player 'onYouTubeIframeAPIReady()'
    [ ] - make s & d speed controls in increments of 10% speed change
        - 2 problems:
            - 1: event.target.setPlaybackRate(1-0.3); not working
            - 2: only when I click off the video is when my keyControls() works
*/

// using YT-API
var tag = document.createElement('script');

// loads IFrame Player API asynchronously
// basically, dynamically create & insert <script>, API loads in a certain way. webpage wont block rending while waiting 4 script
// *notes: creates <script> -> checks <script>[0] -> places <script> at [0] (otherwise following scripts would not have this youtube api)
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// 480x270 | 854x480 | 1280x720 | 1920x1080
// no format: https://www.youtube.com/watch?v=pQI64hD2sJw

var yt_id; // for the embed id
var player;
const overlay = document.querySelector(".overlay");

// function to get embed ID
function getEmbedId(url) {

    let videoId = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/);

    return(videoId[1]);

}


function onPlayerReady(event) {
    console.log(player.getAvailablePlaybackRates());
    // document.addEventListener("keydown", function(e) {
    //     speedControls(e);
    // });
    // document.addEventListener("click", function(c) {
    //     playPauseVideo(c);
    // });
    document.addEventListener("keydown", function(e) {
    speedControls(e);
    });
    overlay.addEventListener("click", function(c) {
    playPauseVideo(c);
    });
}


function playPauseVideo(event) {
    //overlay.addEventListener("click", (event) => {
    const mClick = event.mouseClick;
    const state = player.getPlayerState();

    if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.CUED) {
        player.playVideo();
    } else if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    }

    //});    
}


function speedControls(event) {
    var v = player.getPlaybackRate();

    const keyName = event.key;
    if (keyName === "x") {
        player.setPlaybackRate(10);
        console.log(`${player.getPlaybackRate()} x - 10x speed`);
        console.log(`${keyName} max speed pressed.`);
        // this sets it to 2x speed then once video is playing just 1x speed
    } 
    if (keyName === "s" && (v >= 0.1 || v <= 5)) {
        //event.target.setPlaybackRate(v-0.1);
        player.setPlaybackRate(player.getPlaybackRate() - 0.1);
        console.log(`${player.getPlaybackRate()} s - speed`);
        console.log(`${keyName} pressed.`);
    } else if (keyName === "d") {
        player.setPlaybackRate(player.getPlaybackRate() + 0.1);
        console.log(`${player.getPlaybackRate()} d - speed`);
        console.log(`${keyName} pressed.`)
        // ^ these sequences repeat 3 times, then each additional +0.1 will increase the repeat by 1
            // also capping out at 0.25x to 2x speed
    }
}




// function for when user submits url, grabs the Value
function handleUrlSubmit(event) {
    event.preventDefault(); // prevents from submitting normally
    const userUrl = document.getElementById('youtube_url').value;

    // grabbing id w/ function getEmbedId(url, id)
    yt_id = getEmbedId(userUrl);

    player = new YT.Player('player', {
        height: '480',
        width: '854',
        videoId: yt_id,
        playerVars: { 'controls': 0 },
        events: {
            'onReady': onPlayerReady
        }
    });   

    return false; // prevents form from submitting
}

