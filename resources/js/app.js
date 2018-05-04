

// Initialize Parent Card Object
let MyParentCardObj = {};
const gitconnect = new GitConnect;

// UI
const gitUserUI = document.getElementById('git-user');
const repoNameUI = document.getElementById('repo-name');
const branchUI = document.getElementById('branch-ui');
const submitBtn = document.getElementById('btn-input');
const clearInputForm = document.getElementById('clear-results');

// Initialize Firebase
const config = {
  apiKey: "AIzaSyDqM96DQL3V6Hc94P1uBAGyWiML-moreWM",
  authDomain: "gitslacked2.firebaseapp.com",
  databaseURL: "https://gitslacked2.firebaseio.com",
  projectId: "gitslacked2",
  storageBucket: "gitslacked2.appspot.com",
  messagingSenderId: "515555071574"
};
firebase.initializeApp(config);

const database = firebase.database();


// test push just uncomment lines below
//   database.ref().push({
//   user: "buddy",
//   repo: "cannon",
//   branch: "master"
// }
// );


// Firebase watcher + initial loader
database.ref().on("child_added", function (childSnapshot) {

  const user = childSnapshot.val().user,
    repo = childSnapshot.val().repo,
    branch = childSnapshot.val().branch;
  firebasechildkey = childSnapshot.key; // comma above?
  console.dir(firebasechildkey);



  // Instantiate UserBranchRepoCard object
  let cardObjName = "card" + firebasechildkey;
  // create initial object
 var userRepoBranchCard = new UserRepoBranchCard(user, repo, branch, cardObjName);
// var ui = new UI();
  // Do the first 2 Git API calls and add to the userRepoBranchCard object
  gitconnect.getUserRepoBranch(user, repo, branch)
    .then(data => {
      if(data.profile.message === 'Not Found'){
        
        ui.showAlert('User not found', 'alert alert-danger');

      } else {
        // Add information to object
        // userRepoBranchCard.firebasekey = firebasechildkey;
        MyParentCardObj[cardObjName] = userRepoBranchCard;
        MyParentCardObj[cardObjName].avatar_url = data.profile.avatar_url;
        MyParentCardObj[cardObjName].firebasekey = firebasechildkey;
        MyParentCardObj[cardObjName].name = data.profile.name;
        MyParentCardObj[cardObjName].bio = data.profile.bio;
        var profileEncodedUrl = encodeURI(data.profile.html_url);
        MyParentCardObj[cardObjName].repolink = profileEncodedUrl;
        MyParentCardObj[cardObjName].sha = data.profileRepoSha.object.sha;
        var shaSpecific1 = MyParentCardObj[cardObjName].sha.value;
        gitconnect.getRepoDetailedInfo(user, repo, branch, MyParentCardObj[cardObjName].sha)
        .then(data => {
          if(data.userRepoDetailWithComments === 'Not Found'){
            ui.showAlert('Details not found', 'alert alert-danger');
          } else {
            
            MyParentCardObj[cardObjName].message = data.userRepoDetailWithComments.commit.message;
            // MyParentCardObj[cardObjName].timeofCommit = toString(data.userRepoDetailWithComments.commit.commiter.date);
        
            // debugger;
            
            // building out the card and adding it to the page
              const cardSection = document.getElementById('card-space');
              const card = document.createElement('div');
              card.innerHTML = `
              <div class="card" id="${cardObjName}"style="width: 18rem;">
              <img class="card-img-top" src="${MyParentCardObj[cardObjName].avatar_url }" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">${MyParentCardObj[cardObjName].name}</h5>
                <p class="card-text">${MyParentCardObj[cardObjName].bio}</p>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">For ${MyParentCardObj[cardObjName].repo} </li>
                <li class="list-group-item">Most recent commit</li>
                <li class="list-group-item text-success">${MyParentCardObj[cardObjName].message}</li>
                <div class="input-group mt-3 p-1">
                <div class="input-group-prepend">
                  <span class="input-group-text slack-${cardObjName}" id="input-slack-msg">Message</span>
                </div>
                <input type="text" class="form-control" id="slack-msg-text" aria-label="Default" aria-describedby="input slack message">
              </div>
                  <a href="#" class="btn btn-primary m-3 slack">Send Slack Notification</a>
                  <a href="#" class="btn btn-light m-3 delete">Delete Card</a>
                </ul>
                <div class="card-body">
                  <a href="${MyParentCardObj[cardObjName].repolink}" class="card-link">${MyParentCardObj[cardObjName].repolink}</a>
                </div>
              </div>
              `
              cardSection.append(card);
            }
        })
        // MyParentCardObj[cardObjName].sha = data.profileRepoSha.sha;
        // console.dir(cardObjName);
        // console.dir(userRepoBranchCard);
        const objKeys = Object.keys(MyParentCardObj);
        console.log("objkeys: ", objKeys);
      }
    })

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
})


function UserRepoBranchCard(user, repo, branch) {
  this.user = user;
  this.repo = repo;
  this.branch = branch;
};


UserRepoBranchCard.prototype.pushToFirebase = function(userRepoBranchCardUI) {
  var newSnap = database.ref().push({
    user: userRepoBranchCardUI.user,
    repo: userRepoBranchCardUI.repo,
    branch: userRepoBranchCardUI.branch
  })

  var firebasekeyNewSnap = newSnap.name();
  userRepoBranchCardUI.firebasekey = firebasekeyNewSnap; 

  // Instantiate UserBranchRepoCard object
  let cardObjName = "card" + firebasekeyNewSnap;

  // create initial object
//  var userRepoBranchCard = new UserRepoBranchCard(user, repo, branch, cardObjName);

  // Do the first 2 Git API calls and add to the userRepoBranchCard object
  gitconnect.getUserRepoBranch(user, repo, branch)
    .then(data => {
      if(data.profile.message === 'Not Found'){
        ui.showAlert('User not found', 'alert alert-danger');
      } else {
        // Add information to object
        // userRepoBranchCard.firebasekey = firebasechildkey;
        MyParentCardObj[cardObjName] = userRepoBranchCardUI;
        MyParentCardObj[cardObjName].avatar_url = data.profile.avatar_url;
        MyParentCardObj[cardObjName].firebasekey = firebasechildkey;
        MyParentCardObj[cardObjName].name = data.profile.name;
        MyParentCardObj[cardObjName].bio = data.profile.bio;
        MyParentCardObj[cardObjName].repolink = data.profile.html_url;
        MyParentCardObj[cardObjName].sha = data.profileRepoSha.object.sha;
        var shaSpecific1 = MyParentCardObj[cardObjName].sha.value;
        gitconnect.getRepoDetailedInfo(user, repo, branch, MyParentCardObj[cardObjName].sha)
        .then(data => {
          if(data.userRepoDetailWithComments === 'Not Found'){
            ui.showAlert('Details not found', 'alert alert-danger');
          } else {
            
            MyParentCardObj[cardObjName].message = data.userRepoDetailWithComments.commit.message;
            // MyParentCardObj[cardObjName].timeofCommit = toString(data.userRepoDetailWithComments.commit.commiter.date);
      
            // building out the card and adding it to the page
              const cardSection = document.getElementById('card-space');
              const card = document.createElement('div');
                    card.innerHTML = `
                    <div class="card" id="${cardObjName}"style="width: 18rem;">
                    <img class="card-img-top" src="${MyParentCardObj[cardObjName].avatar_url }" alt="Card image cap">
                    <div class="card-body">
                      <h5 class="card-title">${MyParentCardObj[cardObjName].name}</h5>
                      <p class="card-text">${MyParentCardObj[cardObjName].bio}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">For ${MyParentCardObj[cardObjName].repo} </li>
                      <li class="list-group-item">Most recent commit</li>
                      <li class="list-group-item text-success">${MyParentCardObj[cardObjName].message}</li>
                      <div class="input-group mt-3 p-1">
                      <div class="input-group-prepend">
                        <span class="input-group-text slack-${cardObjName}" id="input-slack-msg">Message</span>
                      </div>
                      <input type="text" class="form-control" id="slack-msg-text" aria-label="Default" aria-describedby="input slack message">
                    </div>
                        <a href="#" class="btn btn-primary m-3 slack">Send Slack Notification</a>
                        <a href="#" class="btn btn-light m-3 delete">Delete Card</a>
                      </ul>
                      <div class="card-body">
                        <a href="${MyParentCardObj[cardObjName].repolink}" class="card-link">${MyParentCardObj[cardObjName].repolink}</a>
                      </div>
                    </div>
                    `
              cardSection.append(card);
            }
        })
        // MyParentCardObj[cardObjName].sha = data.profileRepoSha.sha;
        console.dir(cardObjName);
        console.dir(userRepoBranchCard);
        const objKeys = Object.keys(MyParentCardObj);
        console.log("objkeys: ", objKeys);
      }
    })
  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
};

// UI Constructor
function UI() {};

// not sure how well this one is working
UI.prototype.clearInputFromForm = function() {
  gitUserUI.value = '';
  repoNameUI.value = '';
  branchUI.value = '';
}

UI.prototype.deleteCard = function(target){
  let cardObjID2 = target.parentElement.parentElement.id;
  
  if(target.className === 'btn btn-secondary m-3 delete'){
    // Delete Object from MyParentObj - key is in id of 
   var fbkey = MyParentCardObj[cardObjID2].firebasekey;
   delete MyParentCardObj[cardObjID2];
   database.ref().child(fbkey).remove();

    // Delete from Firebase
    target.parentElement.parentElement.remove();
   // Need to remove object
  } else if(target.className === 'card-link'){
    // Need specific link
    // var specificURL = target.parentElement.children.lastChild
  //  var url = encodeURI(.html_url);
    var win = window.open(url, '_blank');
    win.focus();
  } else if(target.className === 'btn btn-primary m-3 slack'){
  
     var slackMsg = target.parentElement.children[3].children[1].value;
     console.log(slackMsg);
     var queryURL = "https://hooks.slack.com/services/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";
     $.ajax({
      data: 'payload=' + JSON.stringify({
      "text": slackMsg
      }),
      processData: false,
      type: "POST",
      url: queryURL
  });

  } 
}

// Show Alert
UI.prototype.showAlert = function(message, className) {
  // Create div
  const div = document.createElement('div');
  // Add Classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector('.container2');
  const form = document.querySelector('#repo-input');
  // Insert alert
  container.insertBefore(div, form);
  // Timeout after 3 seconds
  setTimeout(function(){
    document.querySelector('.alert').remove();
  }, 3000);
}
// Add event listener for Add Repo
document.getElementById('btn-input').addEventListener('click', function(e){
  e.preventDefault();

  // Get form values
  const gitUser = gitUserUI.value;
  const gitRepo = repoNameUI.value;
  const gitBranch = branchUI.value;
 

  // debugger;
  const userRepoBranchCardUI = new UserRepoBranchCard(gitUser, gitRepo, gitBranch);

  userRepoBranchCardUI.pushToFirebase(userRepoBranchCardUI);

  gitUserUI.value = '';
  repoNameUI.value = '';
  branchUI.value = '';

})

// Event Delegation - Event Listener for Card Delete
document.getElementById('card-space').addEventListener('click', function(e){
  // instantiate ui object
  const ui = new UI();
  ui.deleteCard(e.target);
  // Show alert
  // ui.showalert('Card Removed', 'success');

  e.preventDefault();

})

// Repo Link - Event Listener for within the cards
// might incorporate into delete
// document.getElementById('card-space').addEventListener('c')