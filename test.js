// Function to create and display user cards
async function createUserCards() {
  try {
    // Check if data is available in local storage
    const cachedData = localStorage.getItem('userCardsData');

    if (cachedData) {
      const usersData = JSON.parse(cachedData);
      // If data is available in local storage, use it directly
      for (const user of usersData) {
        const card = createUserCard(user);
        userCards.appendChild(card);
        const followersList = card.querySelector(".followers-list");
        const revealBtn = card.querySelector(".reveal-btn");
        setupRevealButton(revealBtn, followersList, user.login);
      }
    } else {
      // If data is not available in local storage, fetch it from the API
      const usersResponse = await fetch("../data.json");
      const usersData = await usersResponse.json();

      // Store the fetched data in local storage for future use
      localStorage.setItem('userCardsData', JSON.stringify(usersData));

      for (const user of usersData) {
        const card = createUserCard(user);
        userCards.appendChild(card);
        const followersList = card.querySelector(".followers-list");
        const revealBtn = card.querySelector(".reveal-btn");
        setupRevealButton(revealBtn, followersList, user.login);
      }
    }

    searchInput.addEventListener("input", (e) => {
      filterUserCards(e.target.value);
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function setupRevealButton(revealBtn, followersList, username) {
  revealBtn.addEventListener("click", async () => {
    // Check if cached followers data is available in local storage
    const cachedFollowersData = localStorage.getItem(`followersData_${username}`);

    if (cachedFollowersData) {
      const followersData = JSON.parse(cachedFollowersData);
      updateFollowersList(followersList, followersData, revealBtn);
    } else {
      // If not, fetch followers data from the API
      const followersData = await fetchFollowers(username);

      // Store the fetched followers data in local storage for future use
      localStorage.setItem(`followersData_${username}`, JSON.stringify(followersData));

      updateFollowersList(followersList, followersData, revealBtn);
    }
  });
}

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
      const followerLink = document.createElement("a");
      const followerImage = document.createElement("img");
      followerLink.appendChild(followerImage);
      followerItem.appendChild(followerLink);
      followersList.appendChild(followerItem);
    });
    revealBtn.textContent = "Reveal";
    revealBtn.style.backgroundColor = '#5f5ff1';
  }
}

createUserCards();
