

# &nbsp;&nbsp;&nbsp;🏠 Dreamloom Real Estate Website

&nbsp;Welcome to the Dreamloom Real Estate Website! This is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform allows users to browse, list, and manage real estate properties efficiently. Whether you're a buyer, seller, or real estate agent, this app provides all the tools needed to make real estate transactions seamless and user-friendly.

## 🚀 Features

- **User Authentication:** Secure login and registration using email and password, with Google OAuth integration.
- **User Profiles:** Create and manage user profiles, including the ability to upload and update profile pictures.
- **Property Listings:** Users can create, update, and delete property listings with images, descriptions, and pricing.
- **Firebase Storage Integration:** Efficient image storage and management using Firebase Storage.
- **Responsive Design:** Fully responsive design ensuring usability across various devices.
- **Real-Time Updates:** Instant updates to the UI when users create or modify listings.
- **Search Functionality:** Easily search for properties based on location, price, and other filters.

## 🛠️ Technologies Used

- **Frontend:**
  - React.js ⚛️
  - React Router
  - Redux Toolkit 🛒
  - Tailwind CSS 🎨

- **Backend:**
  - Node.js 🟩
  - Express.js 🚂
  - MongoDB 🍃
  - Firebase Storage 🔥

- **Authentication:**
  - JWT (JSON Web Tokens) 🔐
  - Google OAuth 2.0

## 📂 Project Structure

```bash
├── client
│   ├── public
│   └── src
│       ├── components
│       ├── pages
│       ├── redux
│       ├── App.js
│       └── index.js
├── api
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── config
│   └── index.js
├── .env
├── .gitignore
├── README.md
├── package.json
└── npm package manager
```

## 📦 Installation

### &nbsp;&nbsp;Prerequisites
&nbsp;&nbsp;Make sure you have the following installed:

- **Node.js** (v14.x or later) 🟩
  - Download from [Node.js official website](https://nodejs.org/).
  
- **MongoDB** 🍃
  - Install MongoDB from [MongoDB official website](https://www.mongodb.com/try/download/community).
  
- **Firebase Account** 🔥
  - Sign up at [Firebase Console](https://console.firebase.google.com/).
  
- **Google Cloud Console** 🌐
  - Create a project and set up OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/).

### Setup

1. **Clone the Repository:**
   ```bash
    git clone https://github.com/yourusername/real-estate-website.git
    cd real-estate-website
    ```
2. **Install Dependencies:**
   ```bash
    # Install server dependencies
    cd server
    npm install
    
    # Install client dependencies
    cd ../client
    npm install
    ```
3. **Environment Variables:**

    Create a .env file in the server directory and add your environment variables:
    ```bash
        MONGO_URI=your_mongodb_uri
        JWT_SECRET=your_jwt_secret
        GOOGLE_CLIENT_ID=your_google_client_id
        GOOGLE_CLIENT_SECRET=your_google_client_secret
        FIREBASE_API_KEY=your_firebase_api_key
        FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
        FIREBASE_PROJECT_ID=your_firebase_project_id
        FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
        FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
        FIREBASE_APP_ID=your_firebase_app_id
    ```
4. **Run the Application:**
    - Server:
        ```bash
            cd api
            npm start
        ```
    - Client:
        ```bash
            cd client
            npm start
        ```
The application will be available for Frontend - http://localhost:5173/ 
backend - http://localhost:3000.


    
## 🎨 Screenshots

Here's a glimpse of what the application looks like:

### 🏠 Homepage 1
![Homepage](https://github.com/BikramDey/dreamloom-estate/blob/master/demo/home1.png)

### 🏠 Homepage 2
![Homepage](https://github.com/BikramDey/dreamloom-estate/blob/master/demo/home2.png)



## 🚧 Roadmap

We have exciting features planned for future releases:

- [ ] 🔍 Implement advanced search filters
- [ ] 📱 Best Real Estate Lsiting System for Sellers
- [ ] 🏡 Best Tours for property Looking

## 🤝 Contributing

Contributions are welcome and greatly appreciated! To contribute:

1. **Fork** the repository.
2. **Create** your feature branch: `git checkout -b feature/YourFeature`.
3. **Commit** your changes: `git commit -m 'Add some feature'`.
4. **Push** to the branch: `git push origin feature/YourFeature`.
5. **Open** a Pull Request.

Feel free to check the [issues page](https://github.com/yourusername/real-estate-website/issues) if you want to contribute!

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📧 Contact

If you have any questions or suggestions, feel free to reach out:

- 📧 Email: [Bikram Dey](mailto:bikramdey458@gmail.com)
- 💼 LinkedIn: [Bikramdey458](https://www.linkedin.com/in/bikramdey458/)
