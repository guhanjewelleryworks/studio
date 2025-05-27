
// src/lib/firebase/config.ts

// Helper function to check for common placeholder patterns
const isPlaceholder = (value: string | undefined): boolean => {
  if (!value) return true;
  const lowerValue = value.toLowerCase();
  const placeholderPatterns = [
    "your_", "actual_", "placeholder", "example",
    "fixme", "todo", "change_me", "api_key", "secret_key",
    "xxxx", "----"
  ];
  if (value.startsWith("AIzaSy") && value.length === 39 && value.includes("XXXX")) return true; // Common Firebase API Key placeholder structure
  if (value === "AIzaSyXXXXXXXXXXXXXXXXXXXXXXX") return true;

  return placeholderPatterns.some(pattern => lowerValue.includes(pattern));
};

interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

let firebaseConfigValue: FirebaseConfig = {};

// Define the keys we expect and their corresponding environment variable names
const firebaseConfigKeysMap: { [key in keyof Required<FirebaseConfig>]: string } = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
  measurementId: "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", // Optional
};

const requiredKeys: (keyof Omit<Required<FirebaseConfig>, "measurementId">)[] = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const logSource = typeof window === 'undefined' ? "Server-side/Build" : "Client-side";
console.log(`\n--- Firebase Config Check (${logSource}) ---`);

const missingKeys: string[] = [];
const placeholderDetectedKeys: string[] = [];

for (const key of requiredKeys) {
  const envVarName = firebaseConfigKeysMap[key];
  const value = process.env[envVarName];

  if (!value) {
    missingKeys.push(envVarName);
    console.error(`  ✗ ${envVarName} is MISSING or undefined.`);
  } else if (isPlaceholder(value)) {
    placeholderDetectedKeys.push(envVarName);
    console.warn(`  ⚠️ ${envVarName} appears to be using a PLACEHOLDER value. [Value partially masked for security, starts with: ${value.substring(0, Math.min(5, value.length))}...]`);
    firebaseConfigValue[key] = value; // Still pass it to Firebase, let Firebase decide if it's truly invalid
  } else {
    firebaseConfigValue[key] = value;
    console.log(`  ✓ ${envVarName} is loaded.`);
  }
}

// Handle optional measurementId
const measurementIdEnvVar = firebaseConfigKeysMap.measurementId;
const measurementIdValue = process.env[measurementIdEnvVar];
if (measurementIdValue) {
  if (isPlaceholder(measurementIdValue)) {
    placeholderDetectedKeys.push(measurementIdEnvVar);
    console.warn(`  ⚠️ ${measurementIdEnvVar} (optional) appears to be using a PLACEHOLDER value. [Value partially masked for security, starts with: ${measurementIdValue.substring(0, Math.min(5, measurementIdValue.length))}...]`);
    firebaseConfigValue.measurementId = measurementIdValue;
  } else {
    firebaseConfigValue.measurementId = measurementIdValue;
    console.log(`  ✓ ${measurementIdEnvVar} (optional) is loaded.`);
  }
} else {
  console.log(`  ℹ️ ${measurementIdEnvVar} (optional) is not set.`);
}

const allProblematicKeys = [...new Set([...missingKeys, ...placeholderDetectedKeys])];

if (allProblematicKeys.length > 0) {
  const baseErrorMessage = `CRITICAL Firebase Configuration Issue (${logSource}):
The following required Firebase environment variables are MISSING or seem to be using PLACEHOLDER values:
  ${allProblematicKeys.join("\n  ")}

ACTION REQUIRED in your ${logSource === 'Client-side' ? 'Firebase Studio environment variables settings (or .env.local if supported by Studio)' : 'EC2 instance .env file'}:
1. Go to your Firebase Project Console (console.firebase.google.com).
2. Select your project, then go to Project settings (gear icon ⚙️).
3. Under "Your apps", find your Web app and copy its Firebase SDK snippet (Config).
4. Ensure ALL Firebase variables (e.g., NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) are correctly set with your ACTUAL credentials.
   Example:
     NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy_YOUR_REAL_API_KEY_FROM_FIREBASE_CONSOLE"
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
     # ... and so on for all keys.
     # Ensure no variable value starts with "YOUR_" or "AIzaSyXXXX" unless it's a legitimate part of the value.
5. If on EC2: After saving the .env file, RESTART your application using PM2 with the --update-env flag:
   pm2 restart <your_app_name_in_pm2> --update-env
   (Use 'pm2 list' to find your app name).
6. If in Firebase Studio: Restart your development server/preview after setting the environment variables in Studio's configuration panel.

Your application cannot initialize Firebase correctly without these valid configurations.
This message is from: src/lib/firebase/config.ts
--- End Firebase Config Check ---
`;

  console.error(baseErrorMessage);

  // For client-side, if critical keys like apiKey or authDomain are placeholders/missing, show a very direct message.
  // This helps when the app tries to run but Firebase operations fail.
  if (typeof window !== 'undefined') {
    const clientApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const clientAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    if (!clientApiKey || isPlaceholder(clientApiKey) || !clientAuthDomain || isPlaceholder(clientAuthDomain)) {
      const clientAlertMessage = `CLIENT-SIDE FIREBASE CONFIG ALERT:
NEXT_PUBLIC_FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing or a placeholder.
API_KEY currently seen by browser: ${clientApiKey ? (isPlaceholder(clientApiKey) ? `PLACEHOLDER (starts ${clientApiKey.substring(0,5)}...)` : 'LOADED (but might still be invalid)') : 'MISSING'}
AUTH_DOMAIN currently seen by browser: ${clientAuthDomain ? (isPlaceholder(clientAuthDomain) ? `PLACEHOLDER (${clientAuthDomain})` : 'LOADED (but might still be invalid)') : 'MISSING'}
Firebase functionality (like login) will fail. Please set these in your Firebase Studio environment variables. Check console for more details.`;
      console.error(clientAlertMessage); // Changed from alert() to console.error for less intrusiveness
    }
  } else {
    // Server-side check for NODE_ENV (more strict for production-like environments)
    if (process.env.NODE_ENV !== 'development' && (missingKeys.length > 0 || placeholderDetectedKeys.some(k => k !== firebaseConfigKeysMap.measurementId))) {
       // In a non-development server environment, if critical keys are missing/placeholders, throw to prevent startup.
       // We allow measurementId to be a placeholder if it's the only one.
       throw new Error(baseErrorMessage.replace(`CRITICAL Firebase Configuration Issue (${logSource})`, `CRITICAL Firebase Configuration Error on SERVER (likely Production/EC2)`));
    }
  }
} else {
  console.log(`  ✓ All required Firebase config keys appear to be loaded and are not obvious placeholders (${logSource}).`);
  console.log(`--- End Firebase Config Check ---`);
}

export const firebaseConfig = firebaseConfigValue;
