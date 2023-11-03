const userCards = document.getElementById("user-cards");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-btn");
const userDataArray = [];

// Function to fetch followers
async function fetchFollowers(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/followers`);
    if (response.ok) {
      const followersData = await response.json();
      return followersData;
    }
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
}

// Function to create a user card data object
function createUserCardData(user) {
  return {
    user,
    followersData: [],
    revealed: false,
  };
}

// Functions
function createUserCard(user) {
  const card = document.createElement("div");
  card.classList.add("user-card");

  const userProfile = document.createElement("div");
  userProfile.classList.add("user-profile");

  const userLink = document.createElement("a");
  userLink.href = user.html_url;
  userLink.target = "_blank";

  const userImage = document.createElement("img");
  userImage.src = user.avatar_url;
  userImage.alt = user.login;
  userImage.classList.add("user-image");

  userLink.appendChild(userImage);

  const userName = document.createElement("div");
  userName.classList.add("user-name");
  userName.textContent = user.login;

  userProfile.appendChild(userLink);
  userProfile.appendChild(userName);

  const followersRevealButton = document.createElement("div");
  followersRevealButton.classList.add("followers-reveal-button");

  const userFollowers = document.createElement("div");
  userFollowers.classList.add("user-followers");
  userFollowers.textContent = "Followers";

  const revealButton = document.createElement("button");
  revealButton.classList.add("reveal-btn");
  revealButton.value = "true";
  revealButton.textContent = "Reveal";

  followersRevealButton.appendChild(userFollowers);
  followersRevealButton.appendChild(revealButton);

  // Create the followers list
  const followersList = document.createElement("ul");
  followersList.classList.add("followers-list");
  for (let i = 0; i < 3; i++) {
    const listItem = document.createElement("li");
    followersList.appendChild(listItem);
  }

  card.appendChild(userProfile);
  card.appendChild(followersRevealButton);
  card.appendChild(followersList);

  return card;
}

// Function to create a follower element
function createUserFollower(follower) {
  const followerItem = document.createElement("li");
  const followerLink = document.createElement("a");
  const followerImage = document.createElement("img");

  followerLink.href = follower.html_url;
  followerLink.target = "_blank";
  followerImage.src = follower.avatar_url;

  followerLink.appendChild(followerImage);
  followerItem.appendChild(followerLink);

  return followerItem;
}
createUserCards();

// Search user-card using filter method
function filterUserCards(searchText) {
  const userNotFoundMessage = document.getElementById("user-not-found");
  let usersFound = false;

  userDataArray.forEach((userData) => {
    const userName = userData.user.login;
    const card = userData.card;

    if (userName.toLowerCase().includes(searchText.toLowerCase().trim())) {
      card.style.display = "block";
      usersFound = true;
    } else {
      card.style.display = "none";
    }
  });

  // Show the user not found UI based on the search result
  if (usersFound) {
    userNotFoundMessage.style.display = "none";
  } else {
    userNotFoundMessage.style.display = "flex";
  }
}

// Function to update the followers list
function updateFollowersList(followersList, followersData, revealBtn) {
  if (revealBtn.textContent === "Reveal") {
    followersList.innerHTML = "";
    followersData.slice(0, 3).forEach((follower) => {
      const followerItem = createUserFollower(follower);
      followersList.appendChild(followerItem);
    });
    revealBtn.textContent = "Revealed";
    revealBtn.style.backgroundColor = '#60b347';
  } else {
    followersList.innerHTML = "";
    followersData.slice(0, 3).forEach((follower) => {
      const followerItem = document.createElement("li");
      followersList.appendChild(followerItem);
    });
    revealBtn.textContent = "Reveal";
    revealBtn.style.backgroundColor = '#5f5ff1';
  }
}

// Reveal button handler
async function handleRevealButton(userData) {
  const revealBtn = userData.revealBtn;
  const followersList = userData.followersList;
  const username = userData.user.login;

  revealBtn.addEventListener("click", async () => {
    let followersData;

    // followers data is available in local storage
    const userCardsData = JSON.parse(localStorage.getItem('userCardsData'));
    const userIndex = userCardsData.findIndex(user => user.login === username);

    if (userIndex !== -1 && userCardsData[userIndex].followersData) {
      // Data is available in local storage
      followersData = userCardsData[userIndex].followersData;
    } else {
      // Data is not in local storage and fetch it from the API
      followersData = await fetchFollowers(username);
      followersData = followersData.slice(0, 3);

      // Update the user's followers data in userCardsData
      if (userIndex !== -1) {
        userCardsData[userIndex].followersData = followersData;
        localStorage.setItem('userCardsData', JSON.stringify(userCardsData));
      }
    }
    // Update the followers list with the limited data
    updateFollowersList(followersList, followersData, revealBtn);
  });
}

async function createUserCards() {
  try {
    // Check if data is available in local storage
    const cachedData = localStorage.getItem('userCardsData');

    if (cachedData) {
      const usersData = JSON.parse(cachedData);

      for (const user of usersData) {
        const userData = createUserCardData(user);
        const card = createUserCard(user);

        userData.card = card;
        userDataArray.push(userData);

        userCards.appendChild(card);

        const revealBtn = card.querySelector(".reveal-btn"); 
        const followersList = card.querySelector(".followers-list");

        userData.followersList = followersList;
        userData.revealBtn = revealBtn;

        handleRevealButton(userData);
      }
    } else {
      // Data is not available in local storage
      const usersResponse = await fetch("https://api.github.com/users");
      const usersData = await usersResponse.json();

      localStorage.setItem('userCardsData', JSON.stringify(usersData));

      for (const user of usersData) {
        const userData = createUserCardData(user);
        const card = createUserCard(user);

        userData.card = card;
        userDataArray.push(userData);

        userCards.appendChild(card);

        const revealBtn = card.querySelector(".reveal-btn");
        const followersList = card.querySelector(".followers-list");

        userData.followersList = followersList;
        userData.revealBtn = revealBtn;

        handleRevealButton(userData);
      }
    }

    searchInput.addEventListener("input", (e) => {
      filterUserCards(e.target.value);
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}