# **Cherry Storage – Web-Based Cloud Storage**

## **Demo**

Check out the live demo of the **Cherry Storage – Web-Based Cloud Storage**:

[![Firebase React Redux Blog App](https://img.shields.io/badge/Demo-Click%20Here-blue?style=for-the-badge)](https://cloud-storage-project.vercel.app/storage/my-storage)

## **Table of Contents**

1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Screenshots](#screenshots)
6. [License](#license)
7. [Contact](#contact)

---

## **Introduction**

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <a href="https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/introduction-1.png">
    <img src="https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/introduction-1.png" width="150">
  </a>
  <a href="https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/inroduction-2.png">
    <img src="https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/inroduction-2.png" width="150">
  </a>
  <div>
    <p>Based on this TikTok video, this is the reason why I created this project.
This project is a cloud storage platform similar to Google Drive, featuring a "Secured Folder" option. When this feature is enabled, no one can delete the folder except the collaborators assigned to it.</p>
  </div>
</div>

## **Features**

This project includes several key features that enhance user experience and functionality:

- **CRUD Operations for Folders**: Users can create, read, update, and delete folders seamlessly for better file organization.
- **CRD Operations for Files**: Users can create, read, and delete files within their storage, ensuring smooth file management.
- **Folder Sharing**: Allows users to share folders with others, enabling collaboration and easy access to shared content.
- **Add Collaborators to Folders**: Users can add collaborators to specific folders, granting them access based on permissions.
- **Folder Visibility (Private/Public)**: Users can set folder visibility to either private (restricted access) or public (accessible to anyone with the link).
- **Secured Folder**: Ensures that only collaborators can modify or delete the folder and download files within it, enhancing data protection.
- **Starred Folder**: Users can mark important folders as starred for quick and easy access.
- **Recent Files**: Automatically lists recently downloaded files for convenient access to frequently used documents.
- **User Account Management**: Users can update their profile details, including name, email, password, and profile picture.
- **Search**: A powerful search feature that allows users to find folders and files across different locations, with an overlay focus result for better visibility of search results.

## **Tech Stack**

List the technologies and tools used in this project.

![Static Badge](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=black) ![Static Badge](https://img.shields.io/badge/Node.js-8CC84B?style=for-the-badge&logo=nodedotjs&logoColor=8CC84B&labelColor=black) ![Static Badge](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=764ABC&labelColor=black)
![Static Badge](https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=%23DD2C00&labelColor=black) ![Ant Design Badge](https://img.shields.io/badge/Ant%20Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white) ![Static Badge](https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=CA4245&labelColor=black) ![Static Badge](https://img.shields.io/badge/tailwind%20css-%2306B6D4?style=for-the-badge&logo=tailwindcss&logoColor=%2306B6D4&labelColor=black) ![Static Badge](https://img.shields.io/badge/vite-%23F16728?style=for-the-badge&logo=vite&logoColor=%23F16728&labelColor=black) ![Static Badge](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=%233178C6&labelColor=black)

## **Installation**

Step-by-step guide on how to set up and run the project locally.

### Prerequisites

- Node.js
- Git

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/dillahCodes/cloud-storage-project.git
   cd cloud-storage-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the root directory (provide an example if needed):

   ```bash
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   VITE_USE_FIREBASE_EMULATOR=true # set to true to use firebase emulators or false to use in production
   VITE_USE_STORAGE_CAPACITY= 52428800 # user storage capacity in bytes
   ```

4. Start the development FrontEnd server:
   ```bash
   npm run dev
   ```
5. Start the development Database Server:

   ```bash
   npm run db
   ```

6. Local FrontEnd Server `http://localhost:5173`
7. Local Firebase Server `http://127.0.0.1:4000`
8. Available Script:
   ```bash
   npm run dev
   npm run db
   npm run build
   npm run preview
   npm run lint
   ```

## **Screenshots**

|                       ![Home Page](https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/home-page.png)                        | ![Register or Login Page](https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/login-or-register-page.png) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                              _Home Page_                                                                               |                                                              _Register or Login Page_                                                               |
| ![Collaborator and Secured Folder](https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/collaboration-and-secured-folder.png) |           ![Edit Profile Page](https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/profile.png)           |
|                                                                   _Collaborator and Secured Folder_                                                                    |                                                                 _Edit Profile Page_                                                                 |
|                   ![Search Result](https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/search-result.png)                    |  ![Search Result Overlay](https://raw.githubusercontent.com/dillahCodes/cloud-storage-project-screenshoot-features/main/search-result-overlay.png)  |
|                                                                            _Search Result_                                                                             |                                                               _Search Result Overlay_                                                               |

## **License**

This project is licensed under the MIT License

![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## **Contact**

- **Email**: abdillahjuniansyah93@gmail.com
- **GitHub**: [dillahCodes](https://github.com/dillahCodes)
