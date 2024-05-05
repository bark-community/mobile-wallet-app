// Import Axios for HTTP requests
import axios from "axios";

// Define an interface for the API response to enhance type safety
interface CryptoPrices {
  [key: string]: {
    usd: number;
    [key: string]: number;  // Allow other currencies besides USD
  };
}

// Define a type for the function's parameters to allow flexibility in currencies
interface FetchCryptoPricesParams {
  ids?: string[];
  baseCurrency?: string;
}

// Define the function using TypeScript syntax for better type checking and IntelliSense support
export const fetchCryptoPrices = async ({
  ids = ["bitcoin", "solana", "usdc", "bark", "ethereum"],
  baseCurrency = "usd",
}: FetchCryptoPricesParams = {}): Promise<CryptoPrices | null> => {
  try {
    // Construct the API URL and query parameters
    const response = await axios.get<CryptoPrices>("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: ids.join(","),
        vs_currencies: baseCurrency,
      },
    });

    // Return the data from the API call
    return response.data;
  } catch (error) {
    console.error("Error fetching cryptocurrency prices:", error);
    // Optionally handle different types of errors specifically
    if (axios.isAxiosError(error)) {
      // Specific handling for Axios errors
      console.error("Axios error response:", error.response);
    }
    // Return null or throw an error depending on the error handling strategy
    return null;
    // Or throw an error to be caught by the caller
    // throw new Error(`Failed to fetch cryptocurrency prices: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
