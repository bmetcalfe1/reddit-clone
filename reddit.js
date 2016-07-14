const util = require('util');

var inquirer = require('inquirer');
var request = require('request');
var prompt = require('prompt');

function getHomepage(callback) {
    var url = 'https://www.reddit.com/.json';
    
    request(url, function(err, response) {
            if (err) {
                callback(err);
            }
            else {
                try{
                    var jsonParsedResponse = JSON.parse(response.body);
                    callback(null, jsonParsedResponse);
            }
                catch (err) {
                    callback(err);    
                }
            }
        });
}

// getHomepage(function(err, response){
//      if (err) {
//             console.log(err);
//         }
//         else {
//             console.log(response.data.children);  
//         }
// });

function getSortedHomepage(sortingMethod, callback) {

    var url = 'https://www.reddit.com/' + sortingMethod + '/.json';
    
    request(url, function(err, response) {
            if (err) {
                callback(err);
            }
            else {
                try{
                    var jsonParsedResponse = JSON.parse(response.body);
                    callback(null, jsonParsedResponse);
            }
                catch (err) {
                    callback(err);    
                }
            }
        });
}

// getSortedHomepage('new', function(err, response){
//      if (err) {
//             console.log(err);
//         }
//         else {
//             console.log(response.data.children);  
//         }
// });

function getSubreddit(subreddit, callback) {

var url = 'https://www.reddit.com/r/' + subreddit + '/.json';
    
    request(url, function(err, response) {
            if (err) {
                callback(err);
            }
            else {
                try{
                    var jsonParsedResponse = JSON.parse(response.body);
                    callback(null, jsonParsedResponse);
            }
                catch (err) {
                    callback(err);    
                }
            }
        });
}

// getSubreddit('programming', function(err, response){
//      if (err) {
//             console.log(err);
//         }
//         else {
//             console.log(response.data.children);  
//         }
// });

function getSortedSubreddit(subreddit, sortingMethod, callback) {

var url = 'https://www.reddit.com/r/' + subreddit + '/'+ sortingMethod + '/.json';
    
    request(url, function(err, response) {
            if (err) {
                callback(err);
            }
            else {
                try{
                    var jsonParsedResponse = JSON.parse(response.body);
                    callback(null, jsonParsedResponse);
            }
                catch (err) {
                    callback(err);    
                }
            }
        });
}

// getSortedSubreddit('programming', 'new', function(err, response){
//      if (err) {
//             console.log(err);
//         }
//         else {
//             console.log(response.data.children);  
//         }
// });

function getSubreddits(callback) {
  // Load reddit.com/subreddits.json and call back with an array of subreddits
    var url = 'https://www.reddit.com/subreddits' + '/.json';
    
    request(url, function(err, response) {
            if (err) {
                callback(err);
            }
            else {
                try{
                    var jsonParsedResponse = JSON.parse(response.body);
                    callback(null, jsonParsedResponse);
            }
                catch (err) {
                    callback(err);    
                }
            }
        });
}

// getSubreddits(function(err, response){
//      if (err) {
//             console.log(err);
//         }
//         else {
//             console.log(response.data.children);  
//         }
// });

var menuChoices = [
    {name: 'Show homepage', value: 'homepage'},
    {name: 'Show a specific subreddit', value: 'choice'},
    {name: 'Show list of subreddits', value: 'subreddits'}
];

inquirer.prompt({
  type: 'list',
  name: 'menu',
  message: 'What do you want to do?',
  choices: menuChoices
}).then(

    function(answers) {
        if (answers.menu === 'homepage'){
            getHomepage(function(err, homeResponse){
                if (err) {
                    console.log(err);
                }
                else {
                    homeResponse.data.children.forEach(function(givenPost){
                        console.log("Title: " + givenPost.data.title);
                        console.log("URL: " + givenPost.data.url);
                        console.log("Number of upvotes: " + givenPost.data.ups);
                        console.log("Number of comments: " + givenPost.data.num_comments);
                    });
                }
            });
        }
        else if (answers.menu === 'choice') {
            prompt.get("subreddit", function (err, result){
                if (err) {
                    console.log(err);
                }
                else {
                    getSubreddit(result.subreddit, function(err, choiceResponse){
                        if (err) {
                            console.log(err);
                        }
                        else {
                            choiceResponse.data.children.forEach(function(givenPost){
                                console.log("Title: " + givenPost.data.title);
                                console.log("URL: " + givenPost.data.url);
                                console.log("Number of upvotes: " + givenPost.data.ups);
                                console.log("Number of comments: " + givenPost.data.num_comments);
                            });
                        }
                    });
                }
            });
        } // for the homescreen if else
        else if (answers.menu === 'subreddits') {
            getSubreddits(function(err, subListResponse){
                if (err) {
                    console.log(err);
                }
                else {
                    var listChoices = subListResponse.data.children.map(function(givenPost){
                        // push the 'return to main menu' to list choices w name: 'Go back to main menu', value: 'mainMenu'
                        return {
                            name: givenPost.data.display_name,
                            value: givenPost.data.display_name // what do i add for value
                        };
                    });
                    inquirer.prompt({ // put in a function?
                      type: 'list',
                      name: 'subredditMenu',
                      message: 'Which subreddit do you feel like?',
                      choices: listChoices
                    }).then(
                        function(answers) { 
                            getSubreddit(answers.subredditMenu, function(err, subPostResponse){
                                if (err) {
                                    console.log(err);
                                }// else if (answers.subredditMenu = 'mainMenu') {
                                else {
                                    //console.log(util.inspect(subResponse, { showHidden: true, depth: null }));
                                    var listPosts = subPostResponse.data.children.map(function(givenPost){
                                        // push the 'return to main menu' to list choices
                                            //name: 'Go back to main menu', value: 'mainMenu'
                                        return {
                                            name: givenPost.data.title,
                                            value: givenPost.data.title // what do i add for value
                                        };
                                    });
                                    inquirer.prompt({ // put in a function?
                                      type: 'list',
                                      name: 'subredditMenu',
                                      message: 'Which post do you want to see?',
                                      choices: listPosts
                                    }).then();
                                }
                            }); 
                        }
                    ); // for my subreddit then
                }
            });
        } // for the homescreen if else
        else {
            console.log("Not a valid input!");
        }
    } // for function answers
);

// module.exports = {
//     redditFunction: redditFunction,
//     getSortedHomepage:getSortedHomepage,
//     getSubreddit: getSubreddit,
//     getSortedSubreddit: getSortedSubreddit,
//     getSubreddits: getSubreddits
// }

