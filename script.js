// 6-11-25
// Script for loading YTV, speed controls, & looping video @ certain times¬

/*
TODO:
    [ ] - function for handleUrlSubmit(event)
*/

// api key: AIzaSyA49C9N7yqQnid1HUEFoLI84Qq3eQIXY1w

// function for when user submits url, grabs the Value
function handleUrlSubmit(event) {
    event.preventDefault(); // prevents from submitting normally
    const userUrl = document.getElementById('youtube_url').value;

    const iFrame = document.getElementById('user_url').src = userUrl;

    return false; // prevents form from submitting
}

// using the userUrl later:
// const userInput = "the url: " + userUrl;


