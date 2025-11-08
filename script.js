// 6-11-25
// Script for loading YTV, speed controls, & looping video @ certain times¬

/*
TODO:
    [ ] - update function for handleUrlSubmit(event) to only grab id
        [ ] - take user video 'id' & insert into player 'onYouTubeIframeAPIReady()'
*/

// api key: AIzaSyA49C9N7yqQnid1HUEFoLI84Qq3eQIXY1w



// Set_ID result: `https://www.youtube.com/embed/${URL_ID}`


// function to get embed ID
function getEmbedId(url, id) {
    const index = url.indexOf(id); // when calling function, use "v="
    if (index === -1) {
        alert("Url Not Found");
        return ""; // not found
    }
    return url.substring(index + id.length); // get substring after "v=" (the id)
}



// function for when user submits url, grabs the Value
function handleUrlSubmit(event) {
    event.preventDefault(); // prevents from submitting normally
    const userUrl = document.getElementById('youtube_url').value;

    // grabbing id
    

    const iFrame = document.getElementById('user_url').src = userUrl; // update w/ id

    return false; // prevents form from submitting
}

// using the userUrl later:
// const userInput = "the url: " + userUrl;


// using YT-API
var tag = document.createElement('script');

// loads IFrame Player API asynchronously
// basically, dynamically create & insert <script>, API loads in a certain way. webpage wont block rending while waiting 4 script
// *notes: creates <script> -> checks <script>[0] -> places <script> at [0] (otherwise following scripts would not have this youtube api)
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// 480x270 | 854x480 | 1280x720 | 1920x1080
var player;
function onYouTubeIframeAPIReady() {
    player = new onYouTubeIframeAPIReady.Player('player', {
        height: '480',
        width: '854',
        // videoId: 'USER_ID',
    });
}

