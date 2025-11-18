// 6-11-25
// Script for loading YTV, speed controls, & looping video @ certain times¬

/*
TODO:
    [x] - update function for handleUrlSubmit(event) to only grab id
        [x] - take user video 'id' & insert into player 'onYouTubeIframeAPIReady()'
    [ ] - make s & d speed controls in increments of 10% speed change
        - problems:
            - 1: only when I click off the video is when my keyControls() works
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
var playing = false;
var currentPlayback = "";
const currentPlaybackDiv = document.getElementById("current-playback");
const speedControlsDiv = document.getElementById("speed-controls");


function getEmbedId(url) {
    let videoId = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/);

    return(videoId[1]);
}

function onPlayerStateChange(event) {
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.CUED) {
        playing = false;
    } else if (state === YT.PlayerState.PLAYING) {
        playing = true;
    }
}


function playPauseVideo(event) {
    const mClick = event.mouseClick;
    const state = player.getPlayerState();

    if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.CUED) {
        player.playVideo();
        console.log(state);
        console.log(playing); // not sure y these aren't working
    } else if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        console.log(state);
        console.log(playing);
    }
}


function onPlayerReady(event) {
    // TODO: ADD BUTTONS FOR PB SPEED to this v function
    //  - 3 buttons: <-0.1 Reset +0.1>

    const slow10 = document.createElement('button');
    const reset = document.createElement('button');
    const speed10 = document.createElement('button');
    slow10.textContent = '< -0.1';
    reset.textContent = 'Reset';
    speed10.textContent = '+0.1 >';
    speedControlsDiv.appendChild(slow10);
    speedControlsDiv.appendChild(reset);
    speedControlsDiv.appendChild(speed10);


    document.addEventListener("keydown", function(e) {
        speedControls(e);
    });

    document.addEventListener("click", function(e) {
        speedControls(e);
    });

    currentPlayback = "Playback Speed: 1";
    currentPlaybackDiv.textContent = currentPlayback;

}

function setPlaybackRateDiv(event) {
    var x = player.getPlaybackRate();
    currentPlayback = "Playback Speed: " + x;
    currentPlaybackDiv.textContent = currentPlayback;
}


function speedControls(event) {
    var v = player.getPlaybackRate();

    const keyName = event.key;
    const buttonPress = event.button;
    console.log(typeof(buttonPress));
    console.log(buttonPress);
    

    if ((keyName === "s" || buttonPress === 0)  && v <= 4) {
        if (v === 0.3) {
            //v = 0.3;
        } else
        v -= 0.1;
    } else if (keyName === "d" && (v >= 0.3 && v < 4)) {
        v += 0.1;
    } 

    if (keyName === "s" || keyName === "d" || buttonPress === 0) {
        v = Math.round((v + Number.EPSILON) * 100) / 100;
        player.setPlaybackRate(v);


        currentPlayback = "Playback Speed: " + v.toString();
        speedControlsDiv.textContent = currentPlayback;

        console.log(`${v} - speed`);
        console.log(`${keyName} pressed.`);


            console.log(typeof(buttonPress));
            console.log(buttonPress); // BREAKS
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
        playerVars: { 
            'controls': 1,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onPlaybackRateChange': setPlaybackRateDiv
        }
    });   

    return false; // prevents form from submitting
}
