const apiKey = 'AIzaSyB0mYEKQHsDkXVwjMO-MgNwckjCS7FSzuM'; // Replace with your actual YouTube API key
const channelIds = ['UC_x5XG1OV2P6uZZ5FSM9Ttw', 'UCudBLOKCEIGssdA8pQgIbvA']; // Replace with your subscription channels
const videoGrid = document.getElementById('video-grid');

// Load the Iframe Player API code asynchronously
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let players = {}; // Store the YouTube players

// Initialize YouTube players after API is ready
function onYouTubeIframeAPIReady() {
    channelIds.forEach(channelId => fetchVideos(channelId));
}

async function fetchVideos(channelId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=5&order=date&type=video&key=${apiKey}`);
    const data = await response.json();
    displayVideos(data.items);
}

function displayVideos(videos) {
    videos.forEach(video => {
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('video-container');

        const videoId = video.id.videoId;

        videoContainer.innerHTML = `
            <iframe id="player-${videoId}" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0" allowfullscreen></iframe>
            <div class="controls">
                <button onclick="playVideo('${videoId}')">Play</button>
                <button onclick="pauseVideo('${videoId}')">Pause</button>
                <button onclick="muteVideo('${videoId}')">Mute</button>
            </div>
        `;

        videoGrid.appendChild(videoContainer);

        // Create YouTube Player object and store it
        players[videoId] = new YT.Player(`player-${videoId}`, {
            events: {
                'onReady': onPlayerReady,
            }
        });
    });
}

// Called when the player is ready
function onPlayerReady(event) {
    // Nothing needed here right now, but this is where additional player events can be handled
}

// Control functions for play, pause, and mute
function playVideo(videoId) {
    players[videoId].playVideo();
}

function pauseVideo(videoId) {
    players[videoId].pauseVideo();
}

function muteVideo(videoId) {
    players[videoId].mute();
}
