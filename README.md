# Goldsmith Connect

This is a Next.js application built with Firebase Studio for Goldsmith Connect.

## Project Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    *   Create a `.env` file in the project root.
    *   If using Genkit features, add your Google Generative AI API key:
        ```
        GOOGLE_GENAI_API_KEY=YOUR_API_KEY
        ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at http://localhost:9002 (or the port specified in `package.json`).

4.  **(Optional) Run Genkit Dev Server:**
    If you are developing AI features using Genkit:
    ```bash
    npm run genkit:watch
    ```

## Building for Production

```bash
npm run build
```

## Starting the Production Server

```bash
npm start
```

## Deployment (Example: AWS EC2)

Follow the steps provided in the AWS EC2 deployment guide. Key steps involve:

1.  Launching an EC2 instance (Ubuntu recommended).
2.  Connecting via SSH.
3.  Installing Node.js, npm, and PM2.
4.  Transferring the application code to the EC2 instance.
5.  Running `npm install` and `npm run build`.
6.  Starting the app with PM2: `pm2 start npm --name "goldsmith-connect" -- start`.
7.  Configuring a reverse proxy like Nginx.
8.  Setting up HTTPS with Certbot.

Refer to the detailed guide for specific commands and configurations.
