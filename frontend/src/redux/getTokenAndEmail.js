import { jwtDecode } from "jwt-decode";

export const getTokenAndEmail = () => {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token);

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token payload:", decoded);

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
      return null;
    }
  }

  console.log("No token found in localStorage.");
  return null;
};

export default getTokenAndEmail;
