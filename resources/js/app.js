

// Initialize Parent Card Object
let MyParentCardObj = {};
const gitconnect = new GitConnect;


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



// cardObject["card"+fbkn] = userRepoBranchCard

//----------Need to add call to gitconnect.js ---------//
//
//---------Need to populate data specific to what we get back from calls --//
// userRepoBranchCard.everything
// Need to customize card fields specific to what we want to show

// building out the card and adding it to the page
// const cardSection = document.getElementById('card-space');
// const card = document.createElement('div');
//       card.innerHTML = `
//       <div class="card" style="width: 18rem;">
//       <img class="card-img-top" src="${avatar_urlTest}" alt="Card image cap">
//       <div class="card-body">
//         <h5 class="card-title">User name goes here</h5>
//         <p class="card-text"</p>
//       </div>
//       <ul class="list-group list-group-flush">
//         <li class="list-group-item">Firebase child key is </li>
//         <li class="list-group-item">Dapibus ac facilisis in</li>
//         <li class="list-group-item">Vestibulum at eros</li>
//       </ul>
//       <div class="card-body">
//         <a href="${repo_linkTest}" target="_blank" class="card-link">Repo link</a>
//         <a href="#" class="card-link" target="_blank">Another link</a>
//       </div>
//     </div>
//       `
// cardSection.append(card);


function UserRepoBranchCard(user, repo, branch) {
  this.user = user;
  this.repo = repo;
  this.branch = branch;
  console.log("greetings from inside the constructor");
  console.dir(UserRepoBranchCard);
};

UserRepoBranchCard.prototype.populateCardDetails = function () {
  const gitconnect = new GitConnect;


}

function UI() { };

UI.prototype.addUserRepoBranchCardToPage = function (userRepoBranchCard) {
  database.ref().push({
    user: "smh7",
    repo: "trains",
    branch: "master"
  });
  const cardSection = document.getElementById('card-space');
  const card = document.createElement('div');
  div.innerHTML = `
  <div class="card" style="width: 18rem;">
  <img class="card-img-top" src="${avatar_urlTest}" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${usernameTest}</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
  <div class="card-body">
    <a href="${repo_linkTest}" class="card-link">Repo link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
  `
}

