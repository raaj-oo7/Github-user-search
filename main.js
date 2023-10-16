const userCards = document.getElementById("user-cards");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-btn");

// Function to fetch user data from GitHub API
async function fetchUserData(username) {
  try {
    const response = await fetch("../data.json");
    if (response.ok) {
      const userData = await response.json();
      return userData;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

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

// Function to create a user card
function createUserCard(user) {
  const card = document.createElement("div");
  card.classList.add("user-card");

  card.innerHTML = `
        <div class="user-profile">
            <img src="${user.avatar_url}" alt="${user.login}" class="user-image">
            <div class="user-name">${user.login}</div>
        </div>
        <div class="followers-reveal-button">
            <div class="user-followers">Followers</div>
            <button class="reveal-btn">Reveal</button>
        </div>
        <ul class="followers-list"></ul>
    `;
  return card;
}

//  Display followers
async function displayFollowers(user, followersList, revealBtn) {
  try {
    const followersData = await fetchFollowers(user.login);
    followersList.innerHTML = "";

    // Show first three followers
    followersData.slice(0, 3).forEach((follower) => {
      const followerItem = document.createElement("li");
      const followerLink = document.createElement("a");
      const followerImage = document.createElement("img");
      followerLink.appendChild(followerImage);
      followerItem.appendChild(followerLink);
      followersList.appendChild(followerItem);
    });

    // Reveal button to show first 3 follower profile
    revealBtn.addEventListener("click", () => {
      if (revealBtn.textContent === "Reveal") {
        followersList.innerHTML = "";
        followersData.slice(0, 3).forEach((follower) => {
          const followerItem = document.createElement("li");
          const followerLink = document.createElement("a");
          const followerImage = document.createElement("img");
          followerLink.href = follower.html_url;
          followerLink.target = "_blank";
          followerImage.src = follower.avatar_url;
          followerImage.alt = follower.login;
          followerLink.appendChild(followerImage);
          followerItem.appendChild(followerLink);
          followersList.appendChild(followerItem);
        });
        revealBtn.textContent = "Revealed";
        revealBtn.style.backgroundColor = '#60b347';
        // img.style.
      }
      // Remove 3 follower profile image
      else {
        followersList.innerHTML = "";
        followersData.slice(0, 3).forEach((follower) => {
          const followerItem = document.createElement("li");
          const followerLink = document.createElement("a");
          const followerImage = document.createElement("img");
          followerLink.appendChild(followerImage);
          followerItem.appendChild(followerLink);
          followersList.appendChild(followerItem);
        });
        revealBtn.textContent = "Reveal";
        revealBtn.style.backgroundColor = '#5f5ff1';
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Search user-card using filter method
function filterUserCards(searchText) {
  const userCards = document.querySelectorAll(".user-card");
  userCards.forEach((card) => {
    const userName = card.querySelector(".user-name").textContent;
    if (userName.toLowerCase().includes(searchText.toLowerCase())) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Function to create and display user cards
async function createUserCards() {
  try {
    const usersResponse = await fetch("../data.json");
    const usersData = await usersResponse.json();
    for (const user of usersData) {

      const card = createUserCard(user);
      userCards.appendChild(card);

      const followersList = card.querySelector(".followers-list");
      const revealBtn = card.querySelector(".reveal-btn");

      displayFollowers(user, followersList, revealBtn);
    }

    searchInput.addEventListener("input", (e) => {
      filterUserCards(e.target.value);
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
createUserCards();