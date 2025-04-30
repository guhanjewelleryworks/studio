/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Asynchronously retrieves nearby locations based on a search query.
 *
 * @param query The search query (e.g., 'goldsmith').
 * @param currentLocation The current location to search from.
 * @returns A promise that resolves to an array of Location objects.
 */
export async function getNearbyLocations(
  query: string,
  currentLocation: Location | null // Allow currentLocation to be null
): Promise<Location[]> {
  console.log('Fetching nearby locations for query:', query, 'near:', currentLocation);
  // TODO: Implement this by calling a real Geolocation API (e.g., Google Maps Places API)
  // This mock implementation returns fixed locations regardless of input for demonstration.

  // If no current location is provided, you might return a default set or an empty array.
  if (!currentLocation) {
     console.log('No current location provided, returning default locations.');
    // Return some default popular locations or an empty array
     return [
        { lat: 34.0522, lng: -118.2437 }, // Example: Los Angeles
        { lat: 40.7128, lng: -74.0060 }, // Example: New York
     ];
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock results - in a real scenario, these would come from an API response
  // based on the query and currentLocation
  return [
    {
      lat: currentLocation.lat + 0.01, // Simulate nearby location 1
      lng: currentLocation.lng + 0.01,
    },
    {
      lat: currentLocation.lat - 0.005, // Simulate nearby location 2
      lng: currentLocation.lng - 0.005,
    },
     {
      lat: 34.0522, // Include a fixed location as well
      lng: -118.2437,
    },
  ];
}
