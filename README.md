# Goldsmith Connect.

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
        MONGODB_URI="mongodb+srv://guhanjewelleryworks:YOUR_MONGODB_PASSWORD_HERE@goldsmithconnect.01ffnmh.mongodb.net/goldsmithconnect?retryWrites=true&w=majority&appName=goldsmithconnect"
        ```
        **Ensure there are no typos, extra characters, or missing parts in this string.** An incorrect URI is the most common cause of connection errors.

    *   If using Genkit features, add your Google Generative AI API key:
        ```env
        GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE
        ```
    *   For real-time metal prices, add your chosen API provider's key:
        ```env
        NEXT_PUBLIC_METALS_API_KEY=YOUR_METALS_API_KEY_HERE
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

6.  **Restart Your Application:**
    *   If your application is running, restart it to pick up the new environment variable.
    *   If using PM2 on EC2, use `pm2 restart <your_app_name> --update-env`.

## Troubleshooting MongoDB Connection Errors

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

## Configuring Real-Time Metal Prices

The metal prices widget (`src/components/metal-prices-widget.tsx`) is set up to use simulated data by default. To display live, accurate prices:

1.  **Choose an API Provider:** Select a precious metals API provider that offers data for Gold, Silver, and Platinum in INR, preferably with data for the Bangalore market. Examples include MetalDev API, GoldAPI.io, or other financial data providers.
2.  **Obtain an API Key:** Sign up for the chosen service and get your API key.
3.  **Set Environment Variable:** Add your API key to the `.env` file in your project root:
    ```env
    NEXT_PUBLIC_METALS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
    ```
4.  **Update the Widget:** Modify the `fetchMetalsData` function in `src/components/metal-prices-widget.tsx`.
    *   Uncomment the example `fetch` call.
    *   Replace the placeholder API endpoint with your chosen API's endpoint.
    *   Adjust the data parsing logic to match the JSON response structure of your API. The current code includes comments and placeholders to guide you.

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
5.  Setting up environment variables on the EC2 instance (e.g., in a `.env.production` file or through PM2 ecosystem file), including `MONGODB_URI`.
6.  Running `npm install` and `npm run build`.
7.  Starting the app with PM2: `pm2 start npm --name "goldsmith-connect" -- start`.
8.  Configuring a reverse proxy like Nginx.
9.  Setting up HTTPS with Certbot.

Refer to the detailed guide for specific commands and configurations.
