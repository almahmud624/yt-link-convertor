const convertButton = document.getElementById('convertButton');
const outputLink = document.getElementById('outputLink');
const inputLinkRef = document.getElementById('inputLink');
const videoTitleRef = document.getElementById('videoTitle');
const storedLinksListRef = document.getElementById('storedLinks');
const storedLinksTitle = document.getElementById('storedLinksTitle');
const targetLinkRef = document.getElementById('targetLink');
const outputContainer = document.getElementById('outputContainer');
async function fetchFile(videoId) {
    const options = {
        method: "GET",
        url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
        params: { id: videoId },
        headers: {
            "X-RapidAPI-Key": "YOUR_API_KEY",
            "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com",
        },
    };

    try {
        const response = await axios.request(options);
        if (response.data.status === "OK") {
            outputContainer.classList.remove("hidden");
            inputLinkRef.value = "";
            const videoTitle = response?.data?.title;
            return videoTitle;
        }
    } catch (error) {
        outputLink.textContent = "Some error occurred.";
        console.error(error);
    }
}

async function convertAndStoreLink() {
    const inputLink = inputLinkRef.value;
    const targetLink = targetLinkRef.value || 'ssyoutube.com';
    const videoIdMatch = inputLink.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

    if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        const convertedLink = `https://${targetLink}/watch?v=${videoId}`;

        // Fetch and display the video title
        convertButton.textContent = 'Converting...';
        convertButton.disabled = true;
        const videoTitle = await fetchFile(videoId);
        videoTitleRef.textContent = `${videoTitle}`;
        outputLink.textContent = `${convertedLink}`;
        outputLink.setAttribute("href", convertedLink);
        convertButton.textContent = 'Convert';
        convertButton.disabled = false;

        // Store the target link in localStorage
        storeTargetLink(targetLink);

        // Display stored links
        displayStoredLinks();


    } else {
        outputLink.textContent = 'Invalid YouTube link. Please try again.';
        outputLink.style.color = "red";
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
    const storedLinksList = storedLinksListRef;
    if (storedLinks?.length) {
        storedLinksTitle.classList.remove('hidden');
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
        copyButton.classList.add("text-blue-600", "bg-blue-200/70", "px-1", "py-1", "rounded-lg", "hover:bg-blue-200", "transition", "mr-2");
        copyButton.onclick = () => copySingleLink(link);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("text-red-600", "bg-red-200/70", "px-1", "py-1", "rounded-lg", "hover:bg-red-200", "transition");
        deleteButton.onclick = () => deleteLink(index);

        // Add SVG to Copy Button
        copyButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
        `;

        // Add SVG to Delete Button
        deleteButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

        `;

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

function shareVideoDetails() {
    const videoTitle = document.getElementById('videoTitle').textContent;
    const originalURL = document.getElementById('outputLink').href;
    const textToShare = `${videoTitle}\n${originalURL}`;
    if (navigator.share) {
        navigator.share({
            title: videoTitle,
            text: textToShare,
        }).then(() => {
            showAlert('Video details shared successfully!');
        }).catch((error) => {
            console.error('Error sharing:', error);
            showAlert('Failed to share the video details.');
        });
    } else {
        showAlert('Your browser does not support sharing.');
    }
}


// Display stored links when the page loads
window.onload = displayStoredLinks;
