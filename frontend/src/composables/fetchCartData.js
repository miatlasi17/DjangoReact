import axios from "axios";

export async function fetchCartData() {
  try {
    const response = await axios.get("http://localhost:8000/cart/", {
      withCredentials: true, // Important for including cookies
    });

   return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}
