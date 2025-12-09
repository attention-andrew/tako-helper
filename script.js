// 6-11-25
// Script for loading YTV, speed controls, & looping video @ certain times¬

/*
TODO: :3
    [x] - update function for handleUrlSubmit(event) to only grab id
        [x] - take user video 'id' & insert into player 'onYouTubeIframeAPIReady()'
    [x] - make s & d speed controls in increments of 10% speed change
        - problems: (just accepting this prob)
            - 1: only when I click off the video is when my keyControls() works
    [x] - once a video is loaded, you can't load a new one / override the player
    [x] - +-5s loop functionality 
        [x] - fix: does a ~2s run before looping correctly once 
    ?[ ] - Loop start/end input box 
      *this should sync w/ buttons
      ?[ ] - Toggle Loop ON butt: section.start = "player.getCurrentTime():Number"
        ?[ ] - +-1s to start/end of loop (4 buttons total)
        *bc start/end individually need precision

    *[ ] - BUG pausing while loop is on will reset the loop
    * etc: also may not need speedToggleButton w/ current code
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
var loopStartEnd;
var playerReady = false;
var loop = false;
var loopTimeChange = false;
let loopTimer = null;
let remainingLoopTime = null;
let lastKnownTime = 0;
var lastState = 1;
var speedToggleButton = false; // may not need this anymore
var section = { // need to make dynamic for +-5s & custom loops
    start: 5,
    end: 10
};
duration = section.end - section.start;
var playing = false;
var currentPlayback = "";
const currentPlaybackDiv = document.getElementById("current-playback");
const speedControlsDiv = document.getElementById("speed-controls");
const loopBasicDiv = document.getElementById("loop-basic");


function getEmbedId(url) {
    let videoId = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/);

    return(videoId[1]);
}

function onPlayerStateChange(event) {
    const currentState = player.getPlayerState();
    // if (currentState === YT.PlayerState.PAUSED || currentState === YT.PlayerState.CUED) {
    //     playing = false;
    // } else if (currentState === YT.PlayerState.PLAYING) {
    //     playing = true;
    // }

    // ! if paused, capture remaining duration for loop
    if (currentState === YT.PlayerState.PAUSED ) {
        playing = false;

        if (loop) {
            // stop current timer
            if (loopTimer) clearTimeout(loopTimer);

            // calculate time left IN LOOP
            let now = player.getCurrentTime();
            remainingLoopTime = Math.max(section.end - now, 0);

            lastKnownTime = now; // useful for checking seeking
        }
    }

    if (currentState === YT.PlayerState.PLAYING) {
        playing = true;

        // detect if user SEEKED
        let curr = player.getCurrentTime();
        let seeked = Math.abs(curr - lastKnownTime) > 0.25; // threshold to detect dragging

        if (loop) {
            // if user dragged the timeline -> reset loop timing
            if (seeked) {
                remainingLoopTime = Math.max(section.end - curr, 0);
            }

            // clear old timer
            if (loopTimer) clearTimeout(loopTimer);

            // resume loop with corrected remaining time
            loopTimer = setTimeout(
                restartVideoSection, (remainingLoopTime / player.getPlaybackRate()) * 1000);
        }

        lastKnownTime = curr;
    }

    lastState = player.getPlayerState();


    //! Code for Input Box Loop Start/End
    //TODO: [ ] 1-check if input is empty
    //TODO: [ ] 2-get/store value from input box
    //TODO: [ ] 3-see if value(s) is valid (based on vid dur & start/end times)
    //TODO: [ ] 4-change section.start/end based on value(s)

    //? checking if input is empty
    if (document.getElementById('loop-start').value) {
        // input has value
    } else {
        // input empty
    }


}

function restartVideoSection() {
    player.seekTo(section.start);
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
    lastState = player.getPlayerState();
    
    // creates playback speed buttons
    if (playerReady === true) {
        const slow10 = document.createElement('button');
        const reset = document.createElement('button');
        const speed10 = document.createElement('button');
        slow10.textContent = '< -0.1';
        reset.textContent = 'Reset';
        speed10.textContent = '+0.1 >';
        speedControlsDiv.appendChild(slow10);
        speedControlsDiv.appendChild(reset);
        speedControlsDiv.appendChild(speed10);

        const buttons = [ slow10, reset, speed10 ];

        buttons.forEach((button, index) => {
            button.addEventListener("click", function(e) {
                speedControls(e, index);
            });
        });
    }

    document.addEventListener("keydown", function(e) {
        speedControls(e);
    });

    currentPlayback = "Playback Speed: 1";
    currentPlaybackDiv.textContent = currentPlayback;

    // create loop controls
    if (playerReady === true) {
        const loopTog = document.createElement('button');
        loopTog.id = 'toggle-loop';
        const back5 = document.createElement('button');
        const foreward5 = document.createElement('button');
        loopTog.textContent = 'Toggle Loop: Off';
        back5.textContent = '< -5s';
        foreward5.textContent = '+5s >';
        loopBasicDiv.appendChild(loopTog);
        loopBasicDiv.appendChild(back5);
        loopBasicDiv.appendChild(foreward5);

        const buttons = [ loopTog, back5, foreward5 ];

        buttons.forEach((button, index) => {
            button.addEventListener("click", function(e) {
                loopConrolBasic(e, index);
            });
        });

        loopStartEnd = document.createElement('div');
        loopStartEnd.id = 'toggle-start-end-times';
        loopBasicDiv.appendChild(loopStartEnd);

        return loopStartEnd; // not sure this is needed
    }
}

function setPlaybackRateDiv(event) {
    var x = player.getPlaybackRate();
    currentPlayback = "Playback Speed: " + x;
    currentPlaybackDiv.textContent = currentPlayback;
}


function speedControls(event, index) {
    let v = player.getPlaybackRate();
    v = (Math.round((v + Number.EPSILON) * 10) / 10);

    const keyName = event.key;

    if ((keyName === "s" || index === 0) && v <= 2) { // setting max 2 | seems like 2+ PBS supp are mixed
        v = Math.round((v - 0.1 + Number.EPSILON) * 100) / 100;
        v = Math.max(v,0.3); // prevents going below 0.3
        speedToggleButton = !speedToggleButton; // bruh this is much easier toggle
    }

    if ((keyName === "d" || index === 2) && v < 3) {
        v = Math.round((v + 0.1 + Number.EPSILON) * 100) / 100;
        v = Math.min(v,2);
        speedToggleButton = !speedToggleButton; 
    }
    
    if (index === 1) {
        v = 1;  
        player.setPlaybackRate(v);
        speedToggleButton = !speedToggleButton; 

        currentPlayback = "Playback Speed: " + v.toString();
        currentPlaybackDiv.textContent = currentPlayback;
        console.log(`Button ${index} pressed. SpeedToggle: ${speedToggleButton}`);
    }

    // sets pbr & debug stuff
    if (keyName === "s" || keyName === "d" || index === 0 || index === 2) {
        player.setPlaybackRate(v);

        currentPlayback = "Playback Speed: " + v.toString();
        currentPlaybackDiv.textContent = currentPlayback;

        if (keyName === "s" || keyName === "d") {
            console.log(`${keyName} pressed. SpeedToggle: ${speedToggleButton}`);
        } else if (index === 0 || index === 2) {
            console.log(`Button ${index} pressed. SpeedToggle: ${speedToggleButton}`);
        }

    }
}


function loopConrolBasic(event, index) {

    const loopTog = document.getElementById('toggle-loop');

    if (index === 0 && loop === false) {
        loopTog.textContent = 'Toggle Loop: On'
        loop = true;
        restartVideoSection();
    } else if (index === 0 && loop === true) {
        loopTog.textContent = 'Toggle Loop: Off'
        loop = false;
    }

    if (index === 1 && loop === true && section.start >= 5) {
        section.start -= 5;
        section.end -= 5;
        loopTimeChange = true;
        restartVideoSection();  
    }

    if (index === 2 && loop === true && section.start <= (player.getDuration() - 5)) {
        section.start += 5;
        section.end += 5;
        loopTimeChange = true;
        restartVideoSection();  
    }

    if (index === 0 || index === 1 || index === 2) {
        loopStartEnd.textContent = ('Loop Start: ' + section.start + ' Loop End: ' + section.end);

        if (index === 1 || index === 2) {
            console.log('+-5s on loop | start:', section.start, 'end:', section.end);
        }

    }

}


function createPlayer() {
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
}


// function for when user submits url, grabs the Value
function handleUrlSubmit(event) {
    event.preventDefault(); // prevents from submitting normally

    const userUrl = document.getElementById('youtube_url').value;

    // grabbing id w/ function getEmbedId(url, id)
    yt_id = getEmbedId(userUrl);

    if (player) {
        playerReady = false;
        console.log("player is defined now | time 2 destroy it");
        player.destroy(); 

        createPlayer()

    } else {
        console.log("player is not defined, building initial player");
        console.log("yt_id is: " + yt_id);
        playerReady = true;
     
        createPlayer();
    }

    return false; // prevents form from submitting
}
