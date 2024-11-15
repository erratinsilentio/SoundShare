<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=120px src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJmaXMyMW8wMXA0aTdqejlqNWhjbDlsdHI2NDFjeXVpcnp3Z2ZrNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vybWlRniCXzZC/giphy.gif" alt="Project logo"></a>
</p>

<h3 align="center">SoundShare</h3>
<p align="center" style="color: #000000">
  <a href="http://soundshare.live/">
    <img src="https://img.shields.io/badge/live_website-000?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Website"/>
  </a>
</p>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/erratinsilentio/soundshare/pulls)

</div>

---

## 📝 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Clone the repository](#clone-the-repository)
  - [Install dependencies](#install-dependencies)
  - [Set up environment variables](#set-up-environment-variables)
  - [Start the development server](#start-the-development-server)
- [Usage](#usage)
  - [Upload a Music File](#upload-a-music-file)
  - [Get the Shareable Link](#get-the-shareable-link)
  - [Share the Link](#share-the-link)
- [Design & Animations](#design--animations)
- [Components](#components)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

# ♫ SoundShare

## ⚜️ About

**SoundShare** is a simple web app built with Next.js that allows users to upload music files and quickly generate a shareable link to the file. The app leverages modern web technologies to provide a clean and smooth experience for uploading and sharing music.

> Application is still in development and I have a few features in my mind that would be a good idea to implement, such as:
>
> - Shortened URL
> - Authentication
> - Upload History
> - Version Control

### ⚛︎ Features

- Upload music files (MP3, WAV, etc.) with ease.
- Receive a unique URL to share the uploaded file.
- Sleek UI with responsive design, optimized for desktop and mobile.
- Elegant animations for a smooth user experience.

### ⚛︎ Tech Stack

- **Next.js** – React framework for building the app.
- **Tailwind CSS** – Utility-first CSS framework for fast and efficient styling.
- **UploadThing** – File upload service for handling music file uploads.
- **Framer Motion** – For smooth and interactive animations.
- **Lucide React** – A set of customizable icons for a clean, modern UI.
- **shadcn/ui** – Component library for UI elements.

## 💿 Installation

### ❕ Prerequisites

To run SoundShare locally, you’ll need to have the following tools installed:

- Node.js (v14 or later)
- npm or yarn for package management

### 1. Clone the repository

```
git clone https://github.com/your-username/soundshare.git
cd soundshare
```

### 2. Install dependencies

Make sure you have Node.js installed and then install the dependencies using either npm or yarn.

```
npm install
```

or

```
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add the following environment variables. You will need to get the appropriate keys from the respective services you are using.

```
UPLOADTHING_TOKEN=your-uploadthing-api-key
```

### 4. Start the development server

After installing the dependencies and setting up the environment variables, start the development server.

```
npm run dev
```

or

```
yarn dev
```

The app should now be running on http://localhost:3000.

## ⚙️ Usage

##### 1. Upload a Music File

On the homepage, click the "Upload" button to select a music file from your device (MP3, WAV, or other supported formats).
The file will be uploaded to the server via UploadThing.

##### 2. Get the Shareable Link

Once the file is uploaded, the app will generate a unique URL for your file. You can copy this URL and share it with others to access the file.

##### 3. Share the Link

The link will lead to a page where others can listen to the uploaded music file directly in their browser.

## ⚡️ Design & Animations

The app uses **Framer Motion** for smooth transitions and animations, such as fading in elements and animating the upload progress. This helps make the file upload and user interactions feel fluid and dynamic.

The UI is styled with **Tailwind CSS**, allowing for a minimal yet flexible design that adapts well to both desktop and mobile screens.

### 📦 Components

- **File Upload** – Main component that handles the file input and upload process.
- **Shareable Link** – Displays the link once the file is uploaded, allowing the user to copy it.
- **Loader & Progress Bar** – Displays upload progress using an animated progress bar.

## 🌎 Deployment

You can deploy SoundShare using platforms such as Vercel, Netlify, or any platform that supports Next.js. Here’s a quick guide for deploying to Vercel:

1. Push your code to a GitHub repository.
2. Go to Vercel, and sign up or log in.
3. Create a new project and import your GitHub repository.
4. Vercel will automatically detect that it’s a Next.js project and deploy it.

> Once deployed, make sure to set the same environment variables (`UPLOADTHING_TOKEN`) in your Vercel project settings.

## 🛠 Contributing

Feel free to fork this repository and create a pull request if you’d like to contribute improvements, bug fixes, or new features. Please ensure your code follows the existing style.

### 🫵 Steps to contribute:

1. Fork the repo and clone it to your machine.
2. Create a new branch for your feature or bug fix.
3. Make your changes and run application to ensure everything is working as expected.
4. Submit a pull request with a description of the changes.

## 🖤 License

This project is licensed under the GNU License. See the LICENSE file for more details.
