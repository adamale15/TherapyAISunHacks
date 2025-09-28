// Test GCS connection without credentials file
const { Storage } = require("@google-cloud/storage");

async function testGCSConnection() {
  console.log("Testing GCS connection...");

  try {
    // Try to connect using the same credentials as the server
    const storage = new Storage({
      projectId: "ivory-voyage-473503-d7",
      keyFilename: "./gcp-credentials.json",
    });

    const bucketName = "therapy_ai";
    const bucket = storage.bucket(bucketName);

    // Test bucket access
    const [bucketExists] = await bucket.exists();
    console.log(`Bucket '${bucketName}' exists:`, bucketExists);

    if (bucketExists) {
      // Test listing files
      const [files] = await bucket.getFiles({ prefix: "login/" });
      console.log(`Files in login folder: ${files.length}`);

      if (files.length > 0) {
        console.log("Files found:");
        files.forEach((file) => {
          console.log(`- ${file.name}`);
        });
      } else {
        console.log("No files found in login folder");
      }

      // Test creating a test file
      const testFileName = "login/test-connection.json";
      const testFile = bucket.file(testFileName);

      await testFile.save(
        JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: "GCS connection test successful",
        }),
        {
          metadata: {
            contentType: "application/json",
          },
        }
      );

      console.log(`✅ Test file created: ${testFileName}`);

      // Clean up test file
      await testFile.delete();
      console.log("✅ Test file cleaned up");

      return true;
    } else {
      console.log("❌ Bucket does not exist or is not accessible");
      return false;
    }
  } catch (error) {
    console.error("❌ GCS connection failed:", error.message);
    console.log("\nTo fix this, you need to:");
    console.log("1. Create a service account in Google Cloud Console");
    console.log("2. Download the JSON key file");
    console.log("3. Save it as gcp-credentials.json in the server directory");
    console.log(
      "4. Or set GOOGLE_APPLICATION_CREDENTIALS environment variable"
    );
    return false;
  }
}

testGCSConnection();
