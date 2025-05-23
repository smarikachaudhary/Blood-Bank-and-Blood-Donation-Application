import { jwtDecode } from "jwt-decode";

export const getTokenAndEmail = () => {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token);

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token payload:", decoded);


      // First try to get values from the token (more secure)
      let email = decoded.email || null;
      let role = decoded.role || null;
      let userId = decoded.userId || null;
      
      // Check if we have a role stored in localStorage as fallback
      // This helps when the token structure doesn't contain the expected fields
      const storedRole = localStorage.getItem("role");
      if (storedRole && (!role || role === 'null')) {
        console.log("Using role from localStorage:", storedRole);
        role = storedRole;
      }

      if (!email || !role || !userId) {
        console.error("Missing fields in user data.");

      const email = decoded.email || null;
      const role = decoded.role || null;
      const userId = decoded.userId || null;

      if (!email || !role || !userId) {
        console.error("Missing fields in token payload.");

        return null;
      }

      return { email, role, userId, token };
    } catch (error) {
      console.error("Error decoding token:", error);

      // If we can't decode the token but have a role in localStorage, 
      // create a minimal user object
      const storedRole = localStorage.getItem("role");
      const storedEmail = localStorage.getItem("userEmail");
      if (storedRole && storedEmail) {
        console.log("Using stored credentials after token decode error");
        return {
          email: storedEmail,
          role: storedRole,
          userId: "unknown", // Use a placeholder
          token: token
        };
      }

      return null;
    }
  }

  console.log("No token found in localStorage.");
  return null;
};

export default getTokenAndEmail;
