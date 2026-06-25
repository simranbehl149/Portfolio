
// Helper function to ensure data is always an array
export const ensureArray = (data) => {
  return Array.isArray(data) ? data : [];
};

// Helper for safe API calls
export const safeApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return ensureArray(response.data);
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};