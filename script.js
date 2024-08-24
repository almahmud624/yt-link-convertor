const convertButton = document.getElementById('convertButton');
async function fetchFile(videoId) {
    const options = {
        method: "GET",
        url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
        params: { id: videoId },
        headers: {
            "X-RapidAPI-Key": "YOUR_LINK",
            "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com",
        },
    };

    try {
        const response = await axios.request(options);
        if (response.data.status === "OK") {
            const videoTitle = response?.data?.title;
            return videoTitle;
        }
    } catch (error) {
        document.getElementById('outputLink').textContent = "Some error occurred.";
        console.error(error);
    }
}

async function convertAndStoreLink() {
    const inputLink = document.getElementById('inputLink').value;
    const targetLink = document.getElementById('targetLink').value || 'ssyoutube.com';
    const videoIdMatch = inputLink.match(/youtu\.be\/([^\?]+)/);

    if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        const convertedLink = `https://${targetLink}/watch?v=${videoId}`;

        // Fetch and display the video title
        convertButton.textContent = 'Converting...';
        convertButton.disabled = true;
        const videoTitle = await fetchFile(videoId);
        document.getElementById('videoTitle').textContent = `Title: ${videoTitle}`;
        document.getElementById('outputLink').textContent = `Link: ${convertedLink}`;
        convertButton.textContent = 'Convert';
        convertButton.disabled = false;
        if (videoTitle) {
            document.getElementById('details-copy').classList.remove('hidden');
        }

        // Store the target link in localStorage
        storeTargetLink(targetLink);

        // Display stored links
        displayStoredLinks();


    } else {
        document.getElementById('outputLink').textContent = 'Invalid YouTube link. Please try again.';
    }
}

function storeTargetLink(targetLink) {
    let storedLinks = JSON.parse(localStorage.getItem('targetLinks')) || [];
    if (!storedLinks.includes(targetLink)) {
        storedLinks.push(targetLink);
        localStorage.setItem('targetLinks', JSON.stringify(storedLinks));
    }
}

function displayStoredLinks() {
    const storedLinks = JSON.parse(localStorage.getItem('targetLinks')) || [];
    const storedLinksList = document.getElementById('storedLinks');
    if (storedLinksList?.length) {
        document.getElementById('storedLinksTitle').classList.remove('hidden');
    }
    storedLinksList.innerHTML = '';

    storedLinks.forEach((link, index) => {
        const li = document.createElement('li');
        li.classList.add("flex", "justify-between", "items-center", "bg-gray-200", "p-2", "rounded-lg");

        const linkText = document.createElement('span');
        linkText.textContent = link;

        const buttonContainer = document.createElement('div');

        const copyButton = document.createElement('button');
        copyButton.textContent = "Copy";
        copyButton.classList.add("bg-blue-500", "text-white", "px-2", "py-1", "rounded-lg", "hover:bg-blue-400", "transition", "mr-2");
        copyButton.onclick = () => copySingleLink(link);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("bg-red-500", "text-white", "px-2", "py-1", "rounded-lg", "hover:bg-red-400", "transition");
        deleteButton.onclick = () => deleteLink(index);

        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(deleteButton);

        li.appendChild(linkText);
        li.appendChild(buttonContainer);

        storedLinksList.appendChild(li);
    });
}

function copySingleLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Copied!',
            text: 'Link copied to clipboard!',
            confirmButtonColor: '#4F46E5', // Tailwind Indigo-600
        });
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function deleteLink(index) {
    let storedLinks = JSON.parse(localStorage.getItem('targetLinks')) || [];
    storedLinks.splice(index, 1);
    localStorage.setItem('targetLinks', JSON.stringify(storedLinks));
    displayStoredLinks();
}

function copyToClipboard() {
    const videoTitle = document.getElementById('videoTitle').textContent;
    const outputLink = document.getElementById('outputLink').textContent;

    const textToCopy = `${videoTitle}\n${outputLink}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Copied!',
            text: 'Video title and URL copied to clipboard!',
            confirmButtonColor: '#4F46E5',
        });
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}


// Display stored links when the page loads
window.onload = displayStoredLinks;
