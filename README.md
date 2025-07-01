# Goldsmith Connect..

This is a Next.js application built with Firebase Studio for Goldsmith Connect.

## Project Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    *   Create a `.env` file in the project root.
    *   Add the following required variables, replacing placeholders with your actual keys.
        ```env
        # Required for Database connection
        MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-hostname>/<database-name>?retryWrites=true&w=majority&appName=<appName>"

        # Required for real-time metal prices via scheduled job
        METALS_API_KEY="YOUR_GOLDAPI_IO_KEY_HERE"
        CRON_SECRET="GENERATE_A_VERY_LONG_AND_RANDOM_SECRET_STRING_HERE"
        
        # Optional: Required if using Genkit AI features
        GOOGLE_GENAI_API_KEY="YOUR_API_KEY_HERE"
        ```
    *   **CRITICAL:** Ensure the `MONGODB_URI` is exactly correct. An incorrect URI is the most common cause of database connection errors.

3.  **Run Development Server (Local Machine Only):**
    ```bash
    npm run dev
    ```
    The application will be available at http://localhost:9002 (or the port specified in `package.json`).

## Deployment & Updates (EC2 Server)

Follow these steps to deploy, run, or update the application on your EC2 server.

### 1. Initial Deployment

These steps are for the very first time you deploy the code to a new server.

1.  **Connect to your EC2 instance via SSH.**
2.  **Install required software:** Node.js, npm, git, and `pm2`.
    ```bash
    # Example for Ubuntu
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs git
    sudo npm install -g pm2
    ```
3.  **Clone your project repository:**
    ```bash
    git clone https://github.com/guhanjewelleryworks/studio.git
    cd studio # Or your repository's directory name
    ```
4.  **Create and configure your `.env` file:**
    ```bash
    nano .env
    ```
    Paste your environment variables (from "Project Setup" step 2) into this file. Press `Ctrl+X`, then `Y`, then `Enter` to save.
5.  **Install dependencies and build for production:**
    ```bash
    npm install && npm run build
    ```
6.  **Start the application with PM2:**
    ```bash
    pm2 start npm --name "goldsmith-connect" -- start
    ```
7.  **Save the process list** so it automatically restarts if the server reboots:
    ```bash
    pm2 save
    ```
8.  **Configure Cron Jobs** for price updates (see section below).

### 2. Updating an Existing Deployment

When you have new code changes to deploy to your server, follow these exact steps to avoid caching issues.

1.  **Connect to your EC2 instance via SSH** and navigate to your project directory.
2.  **Stop and delete the current running process:** This is crucial to clear any old code from memory.
    ```bash
    pm2 stop goldsmith-connect && pm2 delete goldsmith-connect
    ```
3.  **Pull the latest code from your repository:**
    ```bash
    git pull
    ```
4.  **Install any new packages and create a fresh production build:**
    ```bash
    npm install && npm run build
    ```
5.  **Start the new, correct version of the app with PM2:**
    ```bash
    pm2 start npm --name "goldsmith-connect" -- start
    ```
6.  **Save the new process list:**
    ```bash
    pm2 save
    ```

### 3. Monitoring Your Application

*   **View application logs:** `pm2 logs goldsmith-connect`
*   **View application status:** `pm2 list`

## Configuring Real-Time Metal Prices (Scheduled Fetch)

The application fetches metal prices from GoldAPI.io on a schedule. This requires setting up a "cron job" on your server.

1.  **Ensure Environment Variables are Set:** Make sure `METALS_API_KEY` and `CRON_SECRET` are correctly set in your `.env` file on the server.
2.  **Open the Cron Table for Editing:**
    *   SSH into your EC2 instance.
    *   Run the command: `crontab -e`.
    *   If it's your first time, it might ask you to choose a text editor. `nano` is usually the easiest choice (press Enter to select it).
3.  **Add the Cron Jobs:**
    *   Go to the very bottom of the file that opens.
    *   Copy and paste the three lines below exactly as they are.
    *   **CRITICAL:** You must replace `<YOUR_SECRET_STRING_HERE>` with the actual `CRON_SECRET` string from your `.env` file. Do not include the `<` or `>` symbols. Each job must be on its own single line.

    ```
# Fetch prices at 10:30AM, 3:30PM, 8:30PM IST (server is in UTC)
0 5 * * * curl -X GET -H "Authorization: Bearer <YOUR_SECRET_STRING_HERE>" http://localhost:3000/api/update-prices
0 10 * * * curl -X GET -H "Authorization: Bearer <YOUR_SECRET_STRING_HERE>" http://localhost:3000/api/update-prices
0 15 * * * curl -X GET -H "Authorization: Bearer <YOUR_SECRET_STRING_HERE>" http://localhost:3000/api/update-prices
```
4.  **Save and Exit:**
    *   In `nano`, press `Ctrl+X`, then `Y`, then `Enter`.
    *   If successful, you'll see a message like `crontab: installing new crontab`.
    *   If you see an error, the most common mistake is a typo or an extra line break. Each job must be a single, continuous line.

### Manually Testing the Price Update

You don't have to wait for the scheduled time to test if the price update is working. Run this command in your EC2 terminal:

```bash
curl -X GET -H "Authorization: Bearer <YOUR_SECRET_STRING_HERE>" http://localhost:3000/api/update-prices
```
(Remember to replace the placeholder with your actual secret). After running it, check your website. The prices should appear.

## Troubleshooting

### MongoDB Connection Errors (`querySrv ENOTFOUND`, etc.)

This is almost always an issue with the `MONGODB_URI` in your `.env` file on the server.
1.  **VERIFY `MONGODB_URI`:** Double and triple-check the connection string. Ensure the hostname is correct (e.g., `goldsmithconnect.01ffnmh.mongodb.net`) and that you've replaced `<password>` with your real password.
2.  **Network Access in Atlas:** Confirm your server's IP address is whitelisted in MongoDB Atlas under "Network Access".

### Application Not Running or Unstyled After Closing Terminal

This happens when you run the app with `npm run dev` or `npm start` directly in the terminal. The process stops when you disconnect.
*   **Solution:** Always use `pm2` to run your application in production, as described in the "Deployment & Updates" section above.
