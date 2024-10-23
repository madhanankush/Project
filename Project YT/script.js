const apiKey = 'AIzaSyB0mYEKQHsDkXVwjMO-MgNwckjCS7FSzuM'; // Replace with your YouTube API key
const sheetsApiKey = 'AIzaSyBQtzB-DNGMSs1RcfuWthr58samKJpcNGM'; // Replace with your Google Sheets API key
const spreadsheetId = '1Io_eTz-x70eGFpXenFJAxKFS2_zRo46xe48Gi2Y9CjQ'; // Replace with your spreadsheet ID
const sheetName = 'Sheet2'; // Name of the sheet containing channel IDs
const videoGrid = document.getElementById('video-grid');
const maxVideosPerChannel = 3;

let players = {};

// Load the Iframe Player API code asynchronously
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    fetchChannelIds().then(channelIds => {
        channelIds.forEach(channelId => {
            fetchVideos(channelId, maxVideosPerChannel);
        });
    });
}

// Fetch channel IDs from Google Sheet
async function fetchChannelIds() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:A?key=${sheetsApiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.values ? data.values.flat() : [];
    } catch (error) {
        console.error('Error fetching channel IDs:', error);
        return [];
    }
}

// Fetch videos from YouTube API
async function fetchVideos(channelId, maxResults) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`);
        const data = await response.json();
        if (data.items) {
            displayVideos(data.items, channelId);
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}

// Display videos in the grid
function displayVideos(videos, channelId) {
    videos.forEach(video => {
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('video-container');

        const videoId = video.id.videoId;

        videoContainer.innerHTML = `
            <iframe id="player-${videoId}" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0" allowfullscreen loading="lazy"></iframe>
            <div class="controls">
                <button onclick="playVideo('${videoId}')">Play</button>
                <button onclick="pauseVideo('${videoId}')">Pause</button>
                <button onclick="muteVideo('${videoId}')">Mute</button>
            </div>
        `;

        videoGrid.appendChild(videoContainer);

        players[videoId] = new YT.Player(`player-${videoId}`, {
            events: {
                'onReady': onPlayerReady,
            }
        });
    });

    // Create and add "Load More" button if needed
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = "Load More";
    loadMoreBtn.classList.add('load-more-btn');
    loadMoreBtn.onclick = () => fetchVideos(channelId, 5);
    videoGrid.appendChild(loadMoreBtn);
}

// Control functions
function playVideo(videoId) {
    players[videoId].playVideo();
}

function pauseVideo(videoId) {
    players[videoId].pauseVideo();
}

function muteVideo(videoId) {
    players[videoId].mute();
}
