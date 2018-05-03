class GitConnect {
  constructor() {
    this.client_id = '85bc589cc7000794212e';
    this.client_secret = '7ddd26bc7dda0f37d101e1352ce58709a60d9d13'; 

  }

  async getUser(user) {
    // 1st call for user details
    const profileResponse = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`);

    return {
      profile
    }
  }

  async getUserRepoBranch(user, repo, branch) {
    // 1st call for user details
    const profileResponse = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`);

    // 2nd call for SHA with 
    const profileShaResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/git/refs/heads/${branch}?client_id=${this.client_id}&client_secret=${this.client_secret}`)
  
  
    const profile = await profileResponse.json();
    const profileRepoSha = await profileShaResponse.json();

    return {
      profile,
      profileRepoSha
    }
  }
  async getRepoDetailedInfo(user, repo, branch, shaSpecific) {
   
    const repoDetails = await fetch(`https://api.github.com/repos/${user}/${repo}/commits/${shaSpecific}?client_id=${this.client_id}&client_secret=${this.client_secret}`);

    
    const userRepoDetailWithComments = await repoDetails.json();

    return {
      userRepoDetailWithComments
    }
  }
 
}