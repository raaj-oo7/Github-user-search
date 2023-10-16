const userCards = document.getElementById("user-cards");
const searchInput = document.getElementById("search");


const avatar = document.getElementById('avatar');
const username = document.getElementById('username');
const revealBtn = document.getElementById('reveal-btn');
const followersList = document.getElementById('followers-list');

// Function to fetch user data from GitHub API
async function fetchUserData(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Function to fetch followers
async function fetchFollowers(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/followers`);
    const followersData = await response.json();
    return followersData;
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
}


// Function to create and display user cards
function createUserCard(user) {
  const card = document.createElement("div");
  card.classList.add("user-card");

  card.innerHTML = `
  <div class="user-profile">
    <div><img src="${user.avatar_url}" alt="${user.login}" class="user-image "></div>
    <div class="user-name">${user.login}</div>
  </div>
  <div class="followers-reveal-button">
    <div class="user-followers">Followers</div>
    <button class="reveal-btn">Reveal</button>
  </div>
  <div>
    <ul class="followers-list">
        <li><img src="${user.avatar_url}" class="followers-image"></li>
        <li><img src="${user.avatar_url}" class="followers-image"></li>
        <li><img src="${user.avatar_url}" class="followers-image"></li>
    </ul>
  </div>
  `;


  const revealBtn = card.querySelector(".reveal-btn");
  const followersList = card.querySelector(".followers-list");

  revealBtn.addEventListener("click", async () => {
    if (followersList.children.length === 0) {
      const followersData = await fetchFollowers(user.login);

      if (followersData.length > 0) {
        revealBtn.textContent = "Revealed";

        followersData.slice(0, 3).forEach((follower) => {
          const followerItem = document.createElement("li");
          followerItem.innerHTML = `<a href="${follower.html_url}" target="_blank">${follower.login}</a>`;
          followersList.appendChild(followerItem);
        });
      }
    }
  });

  userCards.appendChild(card);
}


// search user by username
function searchUser() {
  const username = searchInput.value.trim();
  if (username === "") return;

  const storedUserData = localStorage.getItem(username);
  if (storedUserData) {
    const user = JSON.parse(storedUserData);
    createUserCard(user);
  } else {
    fetchUserData(username)
      .then((user) => {
        if (user) {
          createUserCard(user);

          localStorage.setItem(username, JSON.stringify(user));
        } else {
          alert("User not found.");
        }
      });
  }
}
searchInput.addEventListener("change", searchUser);


// display all user cards
async function fetchUserCards() {
  try {
    const usersResponse = await fetch('https://api.github.com/users');
    const usersData = await usersResponse.json();

    for (const user of usersData) {
      const card = createUserCard(user);
      userCards.appendChild(card);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

//  create a user card
function createUserCard(user) {
  const card = document.createElement("div");
  card.classList.add("user-card");

  const userProfile = document.createElement("div");
  userProfile.classList.add("user-profile");

  const userImage = document.createElement("div");
  userImage.classList.add("user-image");
  userImage.style.backgroundImage = `url(${user.avatar_url})`;

  const username = document.createElement("div");
  username.classList.add("user-name");
  username.textContent = user.login;

  const followersRevealButton = document.createElement("div");
  followersRevealButton.classList.add("followers-reveal-button");

  const userFollowers = document.createElement("div");
  userFollowers.classList.add("user-followers");
  userFollowers.textContent = "Followers";

  const revealButton = document.createElement("button");
  revealButton.classList.add("reveal-btn");
  revealButton.textContent = "Reveal";

  const followersList = document.createElement("ul");
  followersList.classList.add("followers-list");

  userProfile.appendChild(userImage);
  userProfile.appendChild(username);
  followersRevealButton.appendChild(userFollowers);
  followersRevealButton.appendChild(revealButton);

  card.appendChild(userProfile);
  card.appendChild(followersRevealButton);
  card.appendChild(followersList);

  //  display followers using reveal button
  revealButton.addEventListener("click", async () => {
    try {
      const followersResponse = await fetch(`https://api.github.com/users/${user.login}/followers`);
      const followersData = await followersResponse.json();

      followersList.innerHTML = ""; // Clear the previous followers

      followersData.forEach(follower => {
        const followerImage = document.createElement("li");
        followerImage.classList.add("followers-image");
        followerImage.style.backgroundImage = `url(${follower.avatar_url})`;
        followersList.appendChild(followerImage);
      });
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  });

  return card;
}

fetchUserCards();
