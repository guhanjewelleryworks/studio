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
  currentLocation: Location
): Promise<Location[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      lat: 34.0522,
      lng: -118.2437,
    },
    {
      lat: 34.0523,
      lng: -118.2438,
    },
  ];
}
