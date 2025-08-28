const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";
let authToken = "";

// Test authentication flow
async function testAuth() {
  try {
    // 1. Register a user
    console.log("1. Registering user...");
    const registerResponse = await axios.post(`${BASE_URL}/users/register`, {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    authToken = registerResponse.data.token;
    console.log("Registered successfully. Token:", authToken);

    // 2. Test protected route - Get profile
    console.log("2. Testing protected route - Get profile...");
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("Profile data:", profileResponse.data);

    // 3. Test getting all users
    console.log("3. Testing get all users...");
    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("Users data:", usersResponse.data);

    // 4. Test updating user
    console.log("4. Testing user update...");
    const userId = registerResponse.data.user.id;
    const updateResponse = await axios.put(
      `${BASE_URL}/users/${userId}`,
      {
        username: "updateduser",
        preferences: { theme: "dark" },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log("Update response:", updateResponse.data);

    console.log("All tests passed!");
  } catch (error) {
    console.error("Test failed:", error.response?.data || error.message);
  }
}

testAuth();
