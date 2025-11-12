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


// TODO: [ ] - make s & d speed controls in increments of 10% speed change
function onPlayerReady(event) {
    document.addEventListener("keydown", function(e) {
        speedControls(e);
    });
    // ADD STUFF HERE FOR PLAY/PAUSE!!!!!!!!!!!!!!!!!!!!!!
}



function playPauseVideo(event) {
    overlay.addEventListener("click", (event) => {
        const mClick = event.mouseClick;

        if (event.data == YT.PlayerState.PAUSED) {
            player.playVideo();
        } else if (event.data == YT.PlayerState.PLAYING) {
            player.pauseVideo();
        }

    });    
}



function speedControls(event) {
    var v = player.getPlaybackRate();

    document.addEventListener("keydown", (event) => {
            const keyName = event.key;
            if (keyName === "s" && (v >= 0.1 || v <= 5)) {
                //event.target.setPlaybackRate(v-0.1);
                player.setPlaybackRate(player.getPlaybackRate() - 0.1);
                console.log(`${player.getPlaybackRate()} player.getPlaybackRate`);
                console.log(`${keyName} pressed.`);
            } else if (keyName === "d") {
                player.setPlaybackRate(player.getPlaybackRate() + 0.1);
                console.log(`${keyName} pressed.`)
            }
        });

        // TODO: [ ] - use 'getPlaybackRate' & 'setPlaybackRate(*rate)' to bind hotkeys with
            // 'onPlaybackRateChange' - "fires" when vid playback rate *changes*
        /* Logic:
            Key press -> check (0.10 <= V <= 5) -> update V if 's' or 'd' pressed -> repeat!
        */
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

