# Goldsmith Connect

This is a Next.js application built with Firebase Studio for Goldsmith Connect.

## Project Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    *   Create a `.env` file in the project root (or `.env.local` for local development, which should be in `.gitignore`).
    *   **MongoDB Connection:** Add your MongoDB connection string (preferably from MongoDB Atlas):
        ```env
        MONGODB_URI="your_mongodb_connection_string_here"
        ```
        Replace `your_mongodb_connection_string_here` with your actual connection string, including your username, password, cluster address, and database name. Example: `mongodb+srv://user:password@cluster.mongodb.net/goldsmith_connect_db?retryWrites=true&w=majority`
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
