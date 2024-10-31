const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Level calculation function
function calculateLevel(stat) {
    if (stat >= 100) return "Gold";
    if (stat >= 50) return "Silver";
    if (stat >= 10) return "Bronze";
    return "Beginner";
}

// GitHub API Fetching Function
async function fetchGithubData(username) {
    const url = `https://api.github.com/users/${username}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from GitHub:', error);
        return null;
    }
}

function generateEnhancedBadge(username, repos, followers, stars) {
    const reposLevel = calculateLevel(repos);
    const followersLevel = calculateLevel(followers);
    const starsLevel = calculateLevel(stars);

    return `
    <svg width="880" height="220" viewBox="0 0 880 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- bg-->
        <rect width="100%" height="100%" fill="#fff" />
        <!-- title -->
        <text x="50%" y="30" text-anchor="middle" fill="white" font-size="18">
            GitHub Achievements for ${username}
        </text>
        <!-- repo -->
        <svg x="0" y="60" width="110" height="110">
            <rect x="0.5" y="0.5" width="109" height="109" rx="4.5" fill="#d4af37" stroke="#e1e4e8"/>
            <text x="55" y="55" text-anchor="middle" fill="black" font-size="14">🏆 Repos</text>
            <text x="55" y="80" text-anchor="middle" fill="black" font-size="14">${repos} (${reposLevel})</text>
        </svg>
        <!-- star -->
        <svg x="130" y="60" width="110" height="110">
            <rect x="0.5" y="0.5" width="109" height="109" rx="4.5" fill="#c0c0c0" stroke="#e1e4e8"/>
            <text x="55" y="55" text-anchor="middle" fill="black" font-size="14">⭐ Stars</text>
            <text x="55" y="80" text-anchor="middle" fill="black" font-size="14">${stars} (${starsLevel})</text>
        </svg>

        <!-- follower -->
        <svg x="260" y="60" width="110" height="110">
            <rect x="0.5" y="0.5" width="109" height="109" rx="4.5" fill="#cd7f32" stroke="#e1e4e8"/>
            <text x="55" y="55" text-anchor="middle" fill="black" font-size="14">👥 Followers</text>
            <text x="55" y="80" text-anchor="middle" fill="black" font-size="14">${followers} (${followersLevel})</text>
        </svg>
    </svg>
    `;
}
app.get('/trophy/:username', async (req, res) => {
    const { username } = req.params;
    const userData = await fetchGithubData(username);

    if (!userData) {
        return res.status(404).send("User not found");
    }

    const { public_repos, followers } = userData;
    const stars = 50; // Placeholder value for stars

    const svg = generateEnhancedBadge(username, public_repos, followers, stars);

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
