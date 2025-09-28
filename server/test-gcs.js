const { gcsService } = require("./services/gcs-service");

async function testGCS() {
  console.log("Testing GCS connection...");

  try {
    // Test connection
    const isConnected = await gcsService.testConnection();
    console.log("GCS Connection:", isConnected ? "✅ Success" : "❌ Failed");

    if (isConnected) {
      // Test user creation
      console.log("\nTesting user creation...");
      const testUser = await gcsService.createUser(
        "test@example.com",
        "password123",
        "student",
        true
      );
      console.log("User created:", testUser.email, testUser.userType);

      // Test authentication
      console.log("\nTesting authentication...");
      const authUser = await gcsService.authenticateUser(
        "test@example.com",
        "password123"
      );
      console.log("Authentication:", authUser ? "✅ Success" : "❌ Failed");

      if (authUser) {
        console.log("Authenticated user:", authUser.email, authUser.userType);
      }
    }
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testGCS();
