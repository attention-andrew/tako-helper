// 6-11-25
// Script for loading YTV, speed controls, & looping video @ certain times¬

/*
TODO:
    [x] - update function for handleUrlSubmit(event) to only grab id
        [x] - take user video 'id' & insert into player 'onYouTubeIframeAPIReady()'
    [x] - make s & d speed controls in increments of 10% speed change
        - problems: (just accepting this prob)
            - 1: only when I click off the video is when my keyControls() works
    [x] - once a video is loaded, you can't load a new one / override the player
    [ ] - loop functionality
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
var playerReady = false;
var loopOn = false;
var speedToggleButton = false;
var section = {
    start: 0,
    end: 5
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
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.CUED) {
        playing = false;
    } else if (state === YT.PlayerState.PLAYING) {
        playing = true;
    }

    if ((event.data == YT.PlayerState.PLAYING || event.data == YT.PlayerState.CUED || event.data == YT.PlayerState.PAUSED) && loopOn) {
    console.log("loop is on from loopConrolBasic | duration is: " + duration);
    console.log(loopOn);
    setTimeout(restartVideoSection, (duration / player.getPlaybackRate()) * 1000);
    //* ^ need check to be continuous calc
    }

    if (speedToggleButton && loopOn) { //speedToggleButton needs to be created
        setTimeout(restartVideoSection, durationCalculator());
    } else if (speedToggleButton == false && loopOn) {
        setTimeout(restartVideoSection, durationCalculator());
    }

}

function restartVideoSection() {
    player.seekTo(section.start);
}

function durationCalculator() {
    (duration / player.getPlaybackRate()) * 1000;
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
        const loop = document.createElement('button');
        loop.id = 'toggle-loop';
        const back5 = document.createElement('button');
        const foreward5 = document.createElement('button');
        loop.textContent = 'Toggle Loop: Off';
        back5.textContent = '-5s';
        foreward5.textContent = '+5s';
        loopBasicDiv.appendChild(loop);
        loopBasicDiv.appendChild(back5);
        loopBasicDiv.appendChild(foreward5);

        const buttons = [ loop, back5, foreward5 ];

        buttons.forEach((button, index) => {
            button.addEventListener("click", function(e) {
                loopConrolBasic(e, index);
            });
        });

        return loop;
    }


}

function setPlaybackRateDiv(event) {
    var x = player.getPlaybackRate();
    currentPlayback = "Playback Speed: " + x;
    currentPlaybackDiv.textContent = currentPlayback;
}


function speedControls(event, index) {
    var v = player.getPlaybackRate(); 

    const keyName = event.key;

    //* flag code
    // if (index === 0 && speedToggleButton === false) {
    //     speedToggleButton = true;
    // } else {
    //     speedToggleButton = false;
    // }
    //* end code


    if ((keyName === "s" || index === 0)  && v <= 4) {
        if (v === 0.3 && speedToggleButton === false) {
            speedToggleButton = true;
        } 
        else if (v === 0.3 && speedToggleButton === true) {
            speedToggleButton = false;
        } 
        else if (((keyName === "s" || index === 0) && speedToggleButton === false) && v <= 4) {
        v -= 0.1;
        speedToggleButton = true;
        } else if (((keyName === "s" || index === 0) && speedToggleButton === true) && v <= 4) {
        v -= 0.1;
        speedToggleButton = false;
        }
    } else if (((keyName === "d" || index === 2) && speedToggleButton === false) && (v >= 0.3 && v < 4)) {
        v += 0.1;
        speedToggleButton = true;
        } else if (((keyName === "d" || index === 2) && speedToggleButton === true) && (v >= 0.3 && v < 4)) {
        v += 0.1;
        speedToggleButton = false;
        }
    
    //else if (((keyName === "d" || index === 2) && speedToggleButton === false) && (v >= 0.3 && v < 4)) {
    //     v += 0.1;
    //     speedToggleButton = true;
    //     console.log("this elseif 'd-press' may break it")
    // } else {
    //     v += 0.1;
    //     speedToggleButton = false;
    // }
    if (index === 1 && speedToggleButton === false) {
        v = 1;
        player.setPlaybackRate(v);
       // speedToggleButton = true;

        currentPlayback = "Playback Speed: " + v.toString();
        currentPlaybackDiv.textContent = currentPlayback;
    // } else {
    //     v = 1;
    //     player.setPlaybackRate(v);
    //     speedToggleButton = false;

    //     currentPlayback = "Playback Speed: " + v.toString();
    //     currentPlaybackDiv.textContent = currentPlayback;
    }


    // sets pbr & debug stuff
    if (keyName === "s" || keyName === "d" || index === 0 || index === 2) {
        v = Math.round((v + Number.EPSILON) * 100) / 100;
        player.setPlaybackRate(v);

        currentPlayback = "Playback Speed: " + v.toString();
        currentPlaybackDiv.textContent = currentPlayback;

        console.log(`${v} - speed`);
        if (keyName === "s" || keyName === "d") {
            console.log(`${keyName} pressed. SpeedToggle: ${speedToggleButton}`);
        } else if (index === 0 || index === 2) {
            console.log(`Button ${index} pressed. SpeedToggle: ${speedToggleButton}`);
        }

    }
}


function loopConrolBasic(event, index) {
    // use player.seekTo(number) to set the seek
    // may need to do something like: start: num, end: num, loop: on & create new player
        // player.loadVideoById({'videoId': 'bHQqvYy5KYo',
        //              'startSeconds': 5,
        //              'endSeconds': 60});


    // !FROM STACKOVERFLOW | maybe best 4 advanced loopControls (or just combo here)
    // var section = {
    //     start: 30,
    //     end: 33
    // };

    // * this is triggered when player is ready
    // function onPlayerReady(event) {
    //     player.seekTo(section.start);
    //     player.playVideo();
    // }

    // * when playing, 
    // function onPlayerStateChange(event) {
    //     if (event.data == YT.PlayerState.PLAYING) {
    //         var duration = section.end - section.start;
    //         setTimeout(restartVideoSection, duration * 1000);
    //     }
    // }

    // function restartVideoSection() {
    //     player.seekTo(section.start);
    // }

    const loop = document.getElementById('toggle-loop');

    if (index === 0 && loopOn === false) {
        loop.textContent = 'Toggle Loop: On'
        loopOn = true;
        restartVideoSection();
        // console.log(loop.textContent + " " + loopOn);
    } else {
        loop.textContent = 'Toggle Loop: Off'
        loopOn = false;
        // console.log(loop.textContent + " " + loopOn);
    }

    // console.log(`Button ${index} pressed.`);

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
