const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

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

// SVG Badge Generation Function
function generateBadge(username, repos, followers, stars) {
    return `
        <svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#333"/>
            <text x="50%" y="20" text-anchor="middle" fill="white" font-size="16">
                GitHub Achievements for ${username}
            </text>
            <text x="50%" y="50" text-anchor="middle" fill="gold" font-size="14">
                🏆 Repos: ${repos}
            </text>
            <text x="50%" y="70" text-anchor="middle" fill="gold" font-size="14">
                ⭐ Stars: ${stars}
            </text>
            <text x="50%" y="90" text-anchor="middle" fill="gold" font-size="14">
                👥 Followers: ${followers}
            </text>
        </svg>
    `;
}

// Route to Generate Trophy SVG
app.get('/trophy/:username', async (req, res) => {
    const { username } = req.params;
    const userData = await fetchGithubData(username);

    if (!userData) {
        return res.status(404).send("User not found");
    }

    const { public_repos, followers } = userData;

    // For simplicity, assume stars as a constant here or fetch starred repos if necessary
    const stars = 50; // Placeholder

    const svg = generateBadge(username, public_repos, followers, stars);

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
