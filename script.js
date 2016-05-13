/*********************************************** DOCUMENT.READY *****************************************/
$(document).ready(function () {
    //hiding all other wrappers beside the landing page
    $('#read, #watch, #listen, #error, .next, .prev').hide();

    randomizeOptions();

    $("#now-button").click(nowClicked);

    $("#random-btn").click(randomizeOptions);

    $("#startOver").click(function () {
        iWant.queueArray = [];
        iWant.index = 0;
        $('#read, #watch, #listen, #error').hide();
        $('#landing').show();
    });
    
    $('.next').click(next);
    $('.prev').click(prev);

});//////end of document.ready

/*********************************************** GLOBAL VARIABLES *****************************************/
var iWant = {

    verbArray: ["read", "listen to", "watch"],
    nounArray: ["cats", "dogs", "space", "nature", "cars", "football", "politics", "comics", "robots", "horses", "science", "ghosts", "Disney", "America", "England", "Japan", "the ocean", "fire", "blues", "hip hop", "basketball", "fashion", "babies", "cute baby animals", "technology", "sloths", "magic", "otters", "bacon", "mysteries"],
    queueArray: [],
    index: 0,
    selectedVerb : null,
    selectedNoun: null
};
/********************************** LANDING PAGE FUNCTIONS ************************************************/


/**
 * randomizeOptions - randomizeOptions function for randomizing verbs and nouns in landing page
 */

function randomizeOptions() {
    var randomVerb = iWant.verbArray[generateRandomNumber(iWant.verbArray.length)];
    var randomNoun = iWant.nounArray[generateRandomNumber(iWant.nounArray.length)];
    console.log("random verb: ", randomVerb);
    displayOptions(randomVerb, randomNoun);
}

/**
 * generateRandomNumber - this function generates a random number to be used in randomize options
 * @param length {number}
 * @return {number}
 */
function generateRandomNumber(length) {

   return Math.floor(Math.random()*length);

}
/**
 * displayOptions - this function generates a random number to be used in randomize options
 * @param {string, string}
 */
function displayOptions(randomVerb, randomNoun) {
    $(".noun").val(randomNoun);
    
    $(".verb option").attr("selected", false);
    switch (randomVerb){
        case "listen":
            $(".verb option[value='listen']").attr("selected", true);
            break;
        case "watch":
            $(".verb option[value='watch']").attr("selected" , true);
            break;
        case "read":
            $(".verb option[value='read']").attr("selected" , true);
            break;
    }
}

/**
 * nowClicked
 * @param 
 * @return 
 */

function nowClicked() {
    iWant.selectedNoun = $(".noun").val();
    iWant.selectedVerb = $(".verb").val();
    
    switch (iWant.selectedVerb) {
        case "read":
            readAjax();
            break;
        case "listen":
            listenAjax();
            break;
        case "watch":
            watchAjax();
            break;
    }
    $('.next, .prev').show()
}
/**************************************** AJAX CALLS ********************************************************/

/****************** READ AJAX ****************************/

/**
 * readAjax - pulling text of tweets from twitter api, and creating object with username, and text of tweet
 */

function readAjax() {
    $.ajax({
        dataType: 'json',
        data: {
            search_term: iWant.selectedNoun,
        },
        method: 'post',
        url: 'http://s-apis.learningfuze.com/hackathon/twitter/index.php',
        success: function(result) {
            for (i=0; i < result.tweets.statuses.length; i++){
                var tweet = result.tweets.statuses[i];

                var username = tweet.user.screen_name;
                var text = tweet.text;
                var name = tweet.user.name;
                var avatarUrl = tweet.user.profile_image_url_https;
                var retweets = tweet.retweet_count;
                var favorites = tweet.favorite_count;

                var tweet_object = {
                    'avatarUrl': avatarUrl,
                    'name': name,
                    'userName': '@' + username,
                    'text': text,
                    'retweets': retweets,
                    'favorites': favorites
                };

                iWant.queueArray.push(tweet_object);
            }
            displayRead();
        }
    })
}

/****************** WATCH AJAX ***************************/

/**
 * watchAjax - calls youtube API using search criteria, returns array of video objects containing title and ID of each. Returns max 50 results.
 */

function watchAjax() {
    $.ajax({

        dataType: 'json',
        data: {
            q: iWant.selectedNoun,
            maxResults: 50
        },
        method: 'POST',
        url: "http://s-apis.learningfuze.com/hackathon/youtube/search.php",
        success: function (response) {
            if (response.success) {
                console.log(response);
                //push response into resultsArray
                for(i=0;i<response.video.length;i++){
                    iWant.queueArray.push(response.video[i]);
                }
                console.log("results array", iWant.queueArray);
                
                //call display function
                displayWatch();

                // return results array
                return response;
            } else {
                console.log(response);

                //return error message
            }
        }

    });
}
/****************** LISTEN TO ***********************/

/**
 * listenAjax - calls iTunes API using search criteria, returns array of
 * @param input {string} - the search term to use
 */

function listenAjax() {
    //calls query with music as only criteria first
    $.ajax({

        dataType: 'jsonp',
        data: {
            term: iWant.selectedNoun,
            media: "music"
        },
        method: 'GET',
        url: "https://itunes.apple.com/search",
        success: function (response) {
            if (response) {
                console.log("music", response);
                var musicArray = response.results;
                //push response into queueArray

                for(var i=0; i< musicArray.length; i++){
                    var song = {
                        artist: musicArray[i].artistName,
                        album: musicArray[i].collectionName,
                        title: musicArray[i].trackName,
                        picture: musicArray[i].artworkUrl100,
                        audio: musicArray[i].previewUrl,
                        link: musicArray[i].trackViewUrl
                    };

                    iWant.queueArray.push(song);
                }
                console.log("q array: ", iWant.queueArray);

                displayListen();

                // console.log("array before randomize", iWant.queueArray);
                //randomize method on queue array
                // var currentIndex = iWant.queueArray.length;
                // var randomIndex;
                //
                // while (currentIndex > 0) {//if there are still indexes left to look at
                //     randomIndex = Math.floor(Math.random() * currentIndex);
                //     currentIndex--;
                //
                //     /*switches two indexes with use of variable for storing value of first to be switched*/
                //     var swap = iWant.queueArray[currentIndex];
                //     iWant.queueArray[currentIndex] = iWant.queueArray[randomIndex];
                //     iWant.queueArray[randomIndex] = swap;
                // }

                // console.log("array after randomize", iWant.queueArray);
                //call displayListen function
                //displayListen();

            } else {
                console.log("music error", response);

                //return error message
            }
        }///end of success

    });


    // $.ajax({
    //
    //     dataType: 'jsonp',
    //     data: {
    //         term: input,
    //         media: "podcast"
    //     },
    //     method: 'GET',
    //     url: "https://itunes.apple.com/search",
    //     success: function (response) {
    //         if (response) {
    //             console.log("podcast," , response);
    //
    //             //push response into queueArray
    //             for(i=0; i<response.results.length; i++){
    //                 iWant.queueArray.push(response.results[i]);
    //             }
    //
    //             // console.log("array before randomize", iWant.queueArray);
    //             //randomize method on queue array
    //             var currentIndex = iWant.queueArray.length;
    //             var randomIndex;
    //
    //             while (currentIndex > 0) {//if there are still indexes left to look at
    //                 randomIndex = Math.floor(Math.random() * currentIndex);
    //                 currentIndex--;
    //
    //                 /*switches two indexes with use of variable for storing value of first to be switched*/
    //                 var swap = iWant.queueArray[currentIndex];
    //                 iWant.queueArray[currentIndex] = iWant.queueArray[randomIndex];
    //                 iWant.queueArray[randomIndex] = swap;
    //             }
    //
    //             // console.log("array after randomize", iWant.queueArray);
    //
    //             // return results array
    //             return response;
    //
    //         } else {
    //             //return error message
    //             console.log("podcast error", response);
    //         }
    //     }
    //
    // });
}

/**************************************** Display Functions ********************************************************/


/******************DISPLAY READ ****************************/

/**
 * displayRead - takes the values of each object in the queueArray and injects them into the DOM
 */

function displayRead() {
    $('#landing').hide();
    $('#read').show();
    $(".main-heading").text("I Want to " + iWant.selectedVerb + " something about " + iWant.selectedNoun);

    var j = 0;

    for(var i = iWant.index; i < iWant.index + 3; i++) {

    for(var i = iWant.index; i <= iWant.index + 3; i++) {
        var tweet = iWant.queueArray[i];
        var tweetdiv = '#tweet' + (j + 1);
        var avatar = tweetdiv + ' .avatar';
        var text = tweetdiv + ' .text';
        var name = tweetdiv + ' .name';
        var userName = tweetdiv + ' .userName';
        var retweets = tweetdiv + ' .retweets';
        var favorites = tweetdiv + ' .favorites';

        $(avatar).attr('src', tweet.avatarUrl);
        $(text).text(tweet.text);
        $(name).text(tweet.name);
        $(userName).text(tweet.userName);
        $(retweets).text(tweet.retweets);
        $(favorites).text(tweet.favorites);

        j++;
    }

    iWant.index += 3;

    if (iWant.index >= 15) {
        iWant.index = 0;
    }
}

/******************DISPLAY WATCH ***************************/

/**
 * displayWatch - inputs video ID from queue array into iframe src to play video
 */

function displayWatch(){
    
    var id = iWant.queueArray[iWant.index].id;
    $("#ytplayer").attr("src", "http://www.youtube.com/embed/" + id + "?autoplay=1");

    $('#landing').hide();
    $('#watch').show();
    $(".main-heading").text("I Want to " + iWant.selectedVerb + " something about " + iWant.selectedNoun);
    
    iWant.index++;
}

/******************DISPLAY LISTEN TO ***********************/

/**
 * displayListen - pulls a random song/podcast out of the queueArray and displays that item in the listen element of the page
 */

function displayListen() {
    $("#landing").hide();
    $("#listen").show();

    $(".main-heading").text("I Want to " + iWant.selectedVerb + " something about " + iWant.selectedNoun);
}

/******************DISPLAY ERROR ***********************/

/**
 * displayError - If it is called for something other than an ajax fail message, it will display the default please try again, otherwise it will display a message specific to the server failure
 * @param verb {string} - either read, listen, or watch depending on which ajax call is calling the function
 */

function displayError(verb) {
    $('#landing, #read, #listen, #watch').hide();
    $('#error').show();
    var error_div = $('#error div');

    switch(verb) {
        case 'read':
            error_div.text('Twitter cannot be reached. Please try again');
            break;
        case 'watch':
            error_div.text('YouTube cannot be reached. Please try again');
            break;
        case 'listen':
            error_div.text('iTunes cannot be reached. Please try again');
            break;
    }
}

/**
 * next - when next arrow is clicked, it calls the display function for the appropriate verb
 */

function next() {
    switch (iWant.selectedVerb) {
        case "read":
            displayRead();
            break;
        case "listen":
            displayListen();
            break;
        case "watch":
            displayWatch();
            break;
    }
}

/**
 * prev - when previous arrow is clicked, it decremenets the index to the appropriate number according to the current verb
 */

function prev() {
    if (iWant.selectedVerb == 'read') {
        if (iWant.index >= 6) {
            iWant.index -= 6;
        }
        else {
            iWant.index = 12;
        }
    }
    else {
        if (iWant.index > 0) {
            iWant.index--;
        }
    }
    next();
}
