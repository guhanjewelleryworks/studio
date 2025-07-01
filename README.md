# Goldsmith Connect..

This is a Next.js application built with Firebase Studio for Goldsmith Connect.

## Project Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    *   Create a `.env` file in the project root (or `.env.local` for local development, which should be in `.gitignore`).
    *   **MongoDB Connection (CRITICAL):** Add your MongoDB connection string.
        *   **Obtain this string directly from your MongoDB Atlas cluster's "Connect" -> "Drivers" section.**
        *   It will look like: `mongodb+srv://<username>:<password>@<cluster-name>.<cluster-id>.mongodb.net/<database-name>?retryWrites=true&w=majority&appName=<appName>`
        *   Replace `<username>` with your database username (e.g., `guhanjewelleryworks`).
        *   Replace `<password>` with YOUR ACTUAL DATABASE USER PASSWORD. **Do NOT leave `<password>` as a placeholder.**
        *   Replace `<cluster-name>.<cluster-id>.mongodb.net` with the hostname provided by Atlas (e.g., `goldsmithconnect.01ffnmh.mongodb.net`). **This is the MOST LIKELY place for an error if you see `_mongodb._tcp.121` or similar in error messages.**
        *   Replace `<database-name>` with your desired database name (e.g., `goldsmithconnect`). If not specified in the URI, the application defaults to `goldsmithconnect`.
        *   Replace `<appName>` with the application name specified in Atlas (e.g., `goldsmithconnect`).

        **Example for `.env` file:**
        ```env
        # Required for Database connection
        MONGODB_URI="mongodb+srv://guhanjewelleryworks:YOUR_MONGODB_PASSWORD_HERE@goldsmithconnect.01ffnmh.mongodb.net/goldsmithconnect?retryWrites=true&w=majority&appName=goldsmithconnect"

        # Required for real-time metal prices via scheduled job
        METALS_API_KEY="YOUR_GOLDAPI_IO_KEY_HERE"
        CRON_SECRET="GENERATE_A_VERY_LONG_AND_RANDOM_SECRET_STRING_HERE"
        
        # Optional: Required if using Genkit AI features
        GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE
        ```
        **Ensure there are no typos, extra characters, or missing parts in the `MONGODB_URI` string.** An incorrect URI is the most common cause of connection errors.

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

## Connecting to MongoDB

To connect your application to a live MongoDB database (e.g., MongoDB Atlas):

1.  **Create a MongoDB Atlas Account and Cluster:** (Follow official Atlas documentation)
2.  **Configure Database Access:** (Follow official Atlas documentation - create a user with password authentication)
3.  **Configure Network Access:** (Follow official Atlas documentation - ensure your application server's IP or 0.0.0.0/0 for development is whitelisted)
4.  **Get Your Connection String:**
    *   In your Atlas cluster, navigate to "Database" (or "Clusters").
    *   Click the "Connect" button for your cluster.
    *   Choose "Drivers" (or "Connect your application").
    *   Select "Node.js" as your driver and the latest version.
    *   **Carefully copy the provided connection string.**

5.  **Set the `MONGODB_URI` Environment Variable:**
    *   In your project's `.env` file, add the **exact** connection string copied from Atlas, replacing `<password>` with your actual database user password. See the "Environment Variables" section above for an example.
    *   **CRITICAL:** The most common error `querySrv ENOTFOUND _mongodb._tcp.<hostname>` (e.g., `_mongodb._tcp.121`) happens because the `<hostname>` part of your `MONGODB_URI` is incorrect in your `.env` file. Ensure the part after `@` and before `/` is the correct Atlas cluster address (e.g., `goldsmithconnect.01ffnmh.mongodb.net`) and NOT just a number or an incomplete address like `121`.
    *   Check your `src/lib/mongodb.ts` file logs (when the server starts) for the `Full MONGODB_URI being used:` message to see exactly what URI your application is using.

6.  **Restart Your Application:**
    *   If your application is running, restart it to pick up the new environment variable.
    *   If using PM2 on EC2, use `pm2 restart <your_app_name> --update-env`.

## Troubleshooting

### MongoDB Connection Errors

*   **`querySrv ENOTFOUND _mongodb._tcp.<hostname>` (e.g., `_mongodb._tcp.121`) or `failed to connect to server ... on first connect`**:
    1.  **VERIFY `MONGODB_URI` in `.env` (Most Common Cause):**
        *   This is the **PRIMARY SUSPECT**. Double, triple-check the connection string in your `.env` file.
        *   Ensure it's copied **exactly** from MongoDB Atlas.
        *   Make sure the hostname part (e.g., `goldsmithconnect.01ffnmh.mongodb.net`) is correct and not a partial value or an incorrect placeholder like `121`. The `_mongodb._tcp.121` in the error strongly suggests your hostname is being misinterpreted as `121`.
        *   Ensure you've replaced `<password>` with your actual database user password.
        *   Check your `src/lib/mongodb.ts` file logs (when the server starts) for the `Full MONGODB_URI being used:` message to see exactly what URI your application is using.
    2.  **Network Access in Atlas:** Confirm that the IP address of the machine running your Next.js application (e.g., your EC2 instance's public IP, or 0.0.0.0/0 for initial testing) is whitelisted in MongoDB Atlas under "Network Access".
    3.  **DNS Resolution (for EC2/Servers):**
        *   SSH into your server.
        *   Try to look up your Atlas cluster hostname: `nslookup your-cluster-name.01ffnmh.mongodb.net` (replace with your actual cluster hostname, e.g., `goldsmithconnect.01ffnmh.mongodb.net`).
        *   Also try the SRV record lookup: `nslookup -type=SRV _mongodb._tcp.your-cluster-name.01ffnmh.mongodb.net`.
        *   If these commands fail or show errors, there might be a DNS configuration issue on your server or with your VPC settings.
    4.  **Firewall:** Ensure no local or network firewalls are blocking outbound connections on port 27017.
*   **Authentication Errors (`MongoNetworkError: failed to connect to server ... on first connect [MongoError: bad auth : Authentication failed.]`)**:
    1.  Verify your database username and password in the `MONGODB_URI`.
    2.  Ensure the database user has the correct permissions for the specified database.
*   **SSL/TLS Errors (e.g., `ssl3_read_bytes:tlsv1 alert internal error`)**:
    1.  **Check Node.js Version:** Ensure you're using a recent Node.js version (LTS recommended).
    2.  **MongoDB Atlas TLS Settings:** In Atlas, under Security > TLS/SSL Configuration, ensure TLS 1.2 or higher is enabled.
    3.  **Network Security:** Confirm firewalls or proxies aren't interfering with TLS/SSL traffic.
    4.  **System Time:** Ensure your server's system time is accurate, as large discrepancies can cause SSL handshake failures.

### Production UI/Styling Issues
*   **Problem: The application appears unstyled or broken (missing CSS, icons, etc.) after deploying.**
    *   **Cause:** This is almost always caused by running the application in **development mode** (`npm run dev`) instead of **production mode** (`npm run build` and `npm start`). The Next.js development server is not optimized for production, is not stable for long periods, and can fail to serve critical CSS and JavaScript files, leading to a broken UI.
    *   **Solution:**
        1.  SSH into your EC2 instance.
        2.  Navigate to your project directory (e.g., `cd /home/ubuntu/goldsmith-connect`).
        3.  Stop any running development server process: `pm2 stop all && pm2 delete all`.
        4.  Ensure you have a fresh production build: `npm run build`.
        5.  Start the application using the correct production command: `pm2 start npm --name "goldsmith-connect" -- start`.
        6.  Save the process list so it restarts on reboot: `pm2 save`.
        7.  Verify the status with `pm2 list` to ensure the "goldsmith-connect" process is `online` and the script path points to `npm start`.

## Configuring Real-Time Metal Prices (Scheduled Fetch)

The application is now built to fetch metal prices from GoldAPI.io on a schedule to conserve API requests.

1.  **Get a GoldAPI.io Key:** Sign up for an account at [GoldAPI.io](https://goldapi.io/) and get your API key.
2.  **Set Environment Variables:** Add your API key and a secret string to your `.env` file. The `CRON_SECRET` protects your update endpoint from being called by unauthorized users. You invent this secret yourself—it should be a long, random string.
    ```env
    METALS_API_KEY="your_goldapi_io_key_here"
    CRON_SECRET="generate_a_very_long_and_random_secret_string"
    ```
3.  **Set up a Cron Job:** You need to set up a scheduled task (a "cron job") on your server to call the protected API endpoint. This will trigger the price update.

    *   SSH into your EC2 instance.
    *   Open the cron table for editing by running the command: `crontab -e`.
        *   If it's your first time, it might ask you to choose a text editor. `nano` is usually the easiest choice (press Enter to select it).
    *   **CRITICAL:** Carefully copy the **entire block** of text below. Each job is a single line. Paste it at the bottom of the file that opens.

        ```crontab
# Fetch metal prices at 10 AM, 3 PM, and 8 PM (server time)
0 10 * * * curl -X GET -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/update-prices
0 15 * * * curl -X GET -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/update-prices
0 20 * * * curl -X GET -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/update-prices
```
    *   **CRITICAL:** In the lines you just pasted, **replace `YOUR_CRON_SECRET`** with the actual secret string you created in your `.env` file. Be very careful not to add or delete any other characters or spaces.
    *   Save and exit the editor.
        *   In `nano`, press `Ctrl+X`.
        *   It will ask if you want to save. Press `Y`.
        *   It will ask for the file name to write. Press `Enter` to confirm.
        *   If it's successful, you'll see a message like `crontab: installing new crontab`. 
        *   If you see an error like **"bad minute"**, it means there is a typo or an extra line break. The most common mistake is having a line break between the schedule (`0 10 * * *`) and the command (`curl...`). **Each job must be on a single, continuous line.** Re-open with `crontab -e` and carefully check your work.

### Understanding the Cron Job Command

Each line you added is a separate job. Let's break down one of them:

`0 10 * * * curl ...`

**The Schedule Part: `0 10 * * *`**

This part tells the server *when* to run the command. It's read from left to right:

*   `0`: **Minute** (0-59). This runs at the 0th minute.
*   `10`: **Hour** (0-23). This runs at the 10th hour (10 AM in 24-hour format).
*   `*`: **Day of the Month** (1-31). The `*` means "every day".
*   `*`: **Month** (1-12). The `*` means "every month".
*   `*`: **Day of the Week** (0-6, where 0 is Sunday). The `*` means "every day of the week".

So, `0 10 * * *` means "run this command at 10:00 AM, every single day."

**The Command Part: `curl ...`**

This is *what* the server does when the schedule matches.

*   `curl`: A simple command-line tool for making web requests. Think of it as a web browser in your terminal.
*   `-X GET`: Tells `curl` to make a GET request.
*   `-H "Authorization: Bearer YOUR_CRON_SECRET"`: This is a crucial security step. It sends a "Header" along with the request. Our API endpoint will check for this header and the secret key to make sure the request is authorized.
    *   **IMPORTANT:** You must replace `YOUR_CRON_SECRET` with the exact same secret string you created in your `.env` file.
*   `http://localhost:3000/api/update-prices`: This is the URL it visits. Because the cron job is running on the *same server* as your Next.js app (which is running on port 3000), it can use `localhost` to talk to it.

### Verifying Server Timezone

Cron jobs use the server's system clock. Your EC2 instance might be set to a different timezone (like UTC) than your local time.

*   SSH into your EC2 instance.
*   Run the command `date`. It will show you the current time and timezone (e.g., `UTC`, `IST`).
*   Adjust the hours in your `crontab -e` file accordingly. For example, if your server is in UTC and you want to run the job at 10 AM IST (which is UTC+5:30), you would set the hour to `4` (for 4:30 AM UTC, which is close enough).

## Building for Production

```bash
npm run build
```

## Starting the Production Server

```bash
npm start
```
Or if using PM2:
```bash
pm2 start npm --name "goldsmith-connect" -- start
# To ensure it restarts on server reboot
pm2 save
pm2 startup
```

## Deployment (Example: AWS EC2)

Follow the steps provided in the AWS EC2 deployment guide. Key steps involve:

1.  Launching an EC2 instance (Ubuntu recommended).
2.  Connecting via SSH.
3.  Installing Node.js, npm, and PM2.
4.  Transferring the application code to the EC2 instance (e.g., via `git clone`).
5.  Setting up environment variables on the EC2 instance (e.g., in a `.env.production` file or through PM2 ecosystem file), including `MONGODB_URI`, `METALS_API_KEY`, and `CRON_SECRET`.
6.  Running `npm install` and `npm run build`.
7.  Starting the app with PM2: `pm2 start npm --name "goldsmith-connect" -- start`.
8.  Configuring a reverse proxy like Nginx.
9.  Setting up HTTPS with Certbot.

Refer to the detailed guide for specific commands and configurations.
