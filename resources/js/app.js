

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
  firebasechildkey = childSnapshot.key;
  console.dir(firebasechildkey);



  // Instantiate UserBranchRepoCard object
  let cardObjName = "card" + firebasechildkey;
  console.log(cardObjName);
  console.log(user);

  // create initial object
 var userRepoBranchCard = new UserRepoBranchCard(user, repo, branch, cardObjName);

  // Do the first 2 Git API calls and add to the userRepoBranchCard object
  gitconnect.getUserRepoBranch(user, repo, branch)
    .then(data => {
      if(data.profile.message === 'Not Found'){
        ui.showAlert('User not found', 'alert alert-danger');
      } else {
        // Add information to object
        console.log(data.profile);
        // userRepoBranchCard.firebasekey = firebasechildkey;
        MyParentCardObj[cardObjName] = userRepoBranchCard;
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
            console.log(data.userRepoDetailWithComments);
            
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
                      <a href="#" class="btn btn-primary m-3">Send Slack Notification</a>
                      
                      
                    </ul>
                    <div class="card-body">
                      <a href="${MyParentCardObj[cardObjName].repolink}" target="_blank" class="card-link">Repo link</a>
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
})


function UserRepoBranchCard(user, repo, branch) {
  this.user = user;
  this.repo = repo;
  this.branch = branch;
  console.log("greetings from inside the constructor");
  console.dir(UserRepoBranchCard);
};

// UserRepoBranchCard.prototype.populateCardDetails = function () {
//   const gitconnect = new GitConnect;


// }

UserRepoBranchCard.prototype.pushToFirebase = function(userRepoBranchCardUI) {
  var newSnap = database.ref().push({
    user: userRepoBranchCardUI.user,
    repo: userRepoBranchCardUI.repo,
    branch: userRepoBranchCardUI.branch
  })

  var firebasekeyNewSnap = newSnap.name();
  userRepoBranchCardUI.firebasekey = firebasekeyNewSnap

  // Instantiate UserBranchRepoCard object
  let cardObjName = "card" + firebasekeyNewSnap;
  console.log(cardObjName);
  console.log(user);

  // create initial object
//  var userRepoBranchCard = new UserRepoBranchCard(user, repo, branch, cardObjName);

  // Do the first 2 Git API calls and add to the userRepoBranchCard object
  gitconnect.getUserRepoBranch(user, repo, branch)
    .then(data => {
      if(data.profile.message === 'Not Found'){
        ui.showAlert('User not found', 'alert alert-danger');
      } else {
        // Add information to object
        console.log(data.profile);
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
            console.log(data.userRepoDetailWithComments);
            
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
                      <a href="#" class="btn btn-primary m-3">Send Slack Notification</a>
                      
                      
                    </ul>
                    <div class="card-body">
                      <a href="${MyParentCardObj[cardObjName].repolink}" target="_blank" class="card-link">Repo link</a>
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

ui.clearInputFromForm = function() {
  gitUserUI.value = '';
  repoNameUI.value = '';
  branchUI.value = '';
}

// Add event listener for Add Repo
document.getElementById('btn-input').addEventListener('click', function(e){
  e.preventDefault();

  // Get form values
  const gitUser = gitUserUI.value;
  const gitRepo = repoNameUI.value;
  const gitBranch = branchUI.value;
 
  console.log("greetings from inside the form")
  console.log(gitUser);
  console.log(gitRepo);
  console.log(gitBranch);
  debugger;
  const userRepoBranchCardUI = new UserRepoBranchCard(gitUser, gitRepo, gitBranch);
  console.log("deep inside form");
  console.log(userRepoBranchCardUI);
  userRepoBranchCardUI.pushToFirebase(userRepoBranchCardUI);

  // Instantiate UI
  const ui = new UI();

 
  // validation would go here
  // Clear form
  ui.clearInputFromForm();

})
