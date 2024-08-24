# YouTube Link Converter Tool
![screencapture-yt-link-convertor-netlify-app-2024-08-24-16_04_22](https://github.com/user-attachments/assets/620e28e8-2ee6-4106-87a9-b3937b44e650)


## Description

This tool provides a simple way to convert YouTube video URLs into custom download links. Users can input a YouTube URL, specify a target site, and generate a custom link. The tool fetches the video title using the YouTube API and displays it along with the converted link. Also, the user can copy and share the video details. It also supports storing and managing previously used target URLs in local storage.

## Features

- Convert YouTube URLs into custom download links
- Fetch and display video titles
- Able to copy and share the title and converted links
- Store and manage target URLs in local storage
- Copy video title, URL, and stored links to the clipboard
- Delete stored links

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/almahmud624/yt-link-convertor

2. Open `index.html` in your preferred web browser.

## Usage

1. Input a YouTube URL: Paste the YouTube video URL into the input field.
2. Specify a Target Site: Enter the desired site for conversion (e.g., ssyoutube.com).
3. Convert the Link: Click the "Convert" button to generate the custom link.
4. View, Copy, and Delete: The converted link and video title will be displayed. Use the copy buttons to copy them to your clipboard and use the share button to share them.
5. Manage Stored Links: View, copy, and delete previously stored target URLs.

## Dependencies

- [Axios](https://axios-http.com/): Promise-based HTTP client for the browser and Node.js
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for styling

## Acknowledgements

- [SweetAlert2](https://sweetalert2.github.io/): For custom alert dialogs.
- [YouTube Data API](https://rapidapi.com/ytjar/api/ytstream-download-youtube-videos): For fetching video titles.
