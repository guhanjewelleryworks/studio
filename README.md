# Goldsmith Connect

This is a Next.js application built with Firebase Studio for Goldsmith Connect.

## Project Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    *   Create a `.env` file in the project root (or `.env.local` for local development, which should be in `.gitignore`).
    *   **MongoDB Connection:** Add your MongoDB connection string. Replace `YOUR_MONGODB_PASSWORD_HERE` with your actual database password:
        ```env
        MONGODB_URI="mongodb+srv://guhanjewelleryworks:YOUR_MONGODB_PASSWORD_HERE@goldsmithconnect.01ffnmh.mongodb.net/?retryWrites=true&w=majority&appName=goldsmithconnect"
        ```
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

1.  **Create a MongoDB Atlas Account and Cluster:**
    *   Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account (or log in if you already have one).
    *   Create a new project.
    *   Build a new cluster. The free tier (M0 Sandbox) is sufficient for development and small applications. Choose your preferred cloud provider and region.
    *   Wait for the cluster to be provisioned (this might take a few minutes).

2.  **Configure Database Access:**
    *   In your Atlas cluster, navigate to "Database Access" under the "Security" section.
    *   Click "Add New Database User".
    *   Create a username and password. **Store these credentials securely.** You will use this password in your connection string. Choose "Read and write to any database" as the user privilege (or more specific privileges if you prefer).
    *   Click "Add User".

3.  **Configure Network Access:**
    *   In your Atlas cluster, navigate to "Network Access" under the "Security" section.
    *   Click "Add IP Address".
    *   For development, you can "Allow Access From Anywhere" (0.0.0.0/0). **For production, it's highly recommended to add specific IP addresses or ranges that will access your database (e.g., your application server's IP).**
    *   Click "Confirm".

4.  **Get Your Connection String:**
    *   In your Atlas cluster, navigate to "Database" (or "Clusters").
    *   Click the "Connect" button for your cluster.
    *   Choose "Drivers" (or "Connect your application").
    *   Select "Node.js" as your driver and the latest version.
    *   You will see a connection string. **Copy this connection string.** It will look similar to:
        `mongodb+srv://<username>:<password>@<cluster-address>/<database-name>?retryWrites=true&w=majority&appName=<appName>`

5.  **Set the MONGODB_URI Environment Variable:**
    *   In your project's `.env` file (create one if it doesn't exist at the root of your project), add the connection string, replacing `<db_password>` with the password you created in step 2:
        ```env
        MONGODB_URI="mongodb+srv://guhanjewelleryworks:YOUR_MONGODB_PASSWORD_HERE@goldsmithconnect.01ffnmh.mongodb.net/?retryWrites=true&w=majority&appName=goldsmithconnect"
        ```
    *   **Ensure `guhanjewelleryworks` is the correct username for your database user.**
    *   **The database name is implicitly part of the connection string or will use the default database if not specified in the string directly.** MongoDB will create it if it doesn't exist when data is first written.

6.  **Restart Your Application:**
    *   If your application is running, restart it to pick up the new environment variable.

Now, your Next.js application (`src/lib/mongodb.ts`) will use this connection string to connect to your live MongoDB Atlas database. The existing server actions (like `saveGoldsmith` in `src/actions/goldsmith-actions.ts`) are already set up to use this database connection.

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
