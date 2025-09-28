// GCS Setup Helper Script
const fs = require("fs");
const path = require("path");

console.log("🔧 GCS Setup Helper");
console.log("==================\n");

console.log("To enable Google Cloud Storage for user authentication:");
console.log("\n📋 Option 1: Credentials File");
console.log(
  "1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=ivory-voyage-473503-d7"
);
console.log('2. Create a service account named "therapy-ai-storage"');
console.log('3. Grant it "Storage Admin" role');
console.log("4. Download the JSON key file");
console.log("5. Save it as: gcp-credentials.json in this directory");
console.log("\n📋 Option 2: Environment Variable");
console.log("1. Copy the entire JSON key content");
console.log(
  '2. Set environment variable: GOOGLE_SERVICE_ACCOUNT_KEY="<paste-json-here>"'
);
console.log("3. Restart the server");

console.log("\n🔍 Current Status:");
const credentialsFile = path.join(__dirname, "gcp-credentials.json");
const hasCredentialsFile = fs.existsSync(credentialsFile);
console.log(
  `Credentials file exists: ${hasCredentialsFile ? "✅ Yes" : "❌ No"}`
);

if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  console.log("Environment variable set: ✅ Yes");
} else {
  console.log("Environment variable set: ❌ No");
}

console.log("\n🚀 After setup, restart the server with: npm start");
console.log("📊 Check GCS connection with: node test-gcs-connection.js");
