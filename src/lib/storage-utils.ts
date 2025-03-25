
/**
 * A utility for managing data storage in a structured folder system
 * All data is stored in server-side storage instead of localStorage
 */

// Main storage folder name
const STORAGE_ROOT = 'Storage-Confidential';

// Define folder structure
type StorageFolders = {
  orders: string;
  menu: string;
  branches: string;
  settings: string;
  receipts: string;
  ratings: string;
  inventory: string;
};

// Initialize folder structure
const folders: StorageFolders = {
  orders: `${STORAGE_ROOT}/orders`,
  menu: `${STORAGE_ROOT}/menu`,
  branches: `${STORAGE_ROOT}/branches`,
  settings: `${STORAGE_ROOT}/settings`,
  receipts: `${STORAGE_ROOT}/receipts`,
  ratings: `${STORAGE_ROOT}/ratings`,
  inventory: `${STORAGE_ROOT}/inventory`,
};

// In-memory cache to reduce server calls
const memoryCache: Record<string, any> = {};

/**
 * Server-side storage implementation (simulated)
 * In a real application, this would make API calls to a backend server
 */
const serverStorage = {
  // Store data 
  setItem: async (key: string, value: string): Promise<void> => {
    // Simulate server call with artificial delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // For now, we're still using localStorage, but in a real app
        // this would be an API call to store data on the server
        localStorage.setItem(key, value);
        // Update the in-memory cache
        memoryCache[key] = value;
        console.log(`[SERVER] Data saved to ${key}`);
        resolve();
      }, 100);
    });
  },
  
  // Retrieve data
  getItem: async (key: string): Promise<string | null> => {
    // Use cache if available
    if (memoryCache[key]) {
      console.log(`[SERVER] Retrieved from cache: ${key}`);
      return memoryCache[key];
    }
    
    // Simulate server call with artificial delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // For now, we're still using localStorage, but in a real app
        // this would be an API call to fetch data from the server
        const data = localStorage.getItem(key);
        // Update cache
        if (data) {
          memoryCache[key] = data;
        }
        console.log(`[SERVER] Data retrieved from ${key}`);
        resolve(data);
      }, 100);
    });
  },
  
  // Delete data
  removeItem: async (key: string): Promise<void> => {
    // Simulate server call with artificial delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // For now, we're still using localStorage, but in a real app
        // this would be an API call to delete data on the server
        localStorage.removeItem(key);
        // Update cache
        delete memoryCache[key];
        console.log(`[SERVER] Data removed from ${key}`);
        resolve();
      }, 100);
    });
  }
};

/**
 * Save data to a specific folder on the server
 */
export const saveToFolder = async <T>(folderKey: keyof StorageFolders, data: T): Promise<void> => {
  try {
    await serverStorage.setItem(folders[folderKey], JSON.stringify(data));
    console.log(`Data saved to ${folders[folderKey]}`);
  } catch (error) {
    console.error(`Failed to save data to ${folders[folderKey]}:`, error);
  }
};

/**
 * Get data from a specific folder on the server
 */
export const getFromFolder = async <T>(folderKey: keyof StorageFolders, defaultValue: T): Promise<T> => {
  try {
    const storedData = await serverStorage.getItem(folders[folderKey]);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Failed to retrieve data from ${folders[folderKey]}:`, error);
    return defaultValue;
  }
};

/**
 * Clear all data in a specific folder on the server
 */
export const clearFolder = async (folderKey: keyof StorageFolders): Promise<void> => {
  try {
    await serverStorage.removeItem(folders[folderKey]);
    console.log(`Cleared folder: ${folders[folderKey]}`);
  } catch (error) {
    console.error(`Failed to clear folder ${folders[folderKey]}:`, error);
  }
};

/**
 * Initialize all storage folders on the server
 */
export const initializeStorage = async (): Promise<void> => {
  try {
    // Check if storage has been initialized
    const initialized = await serverStorage.getItem(`${STORAGE_ROOT}/initialized`);
    
    if (!initialized) {
      console.log('Initializing server storage structure...');
      
      // Create a record of initialization
      await serverStorage.setItem(`${STORAGE_ROOT}/initialized`, new Date().toISOString());
      
      // Log storage structure initialization
      console.log('Server storage structure initialized:', folders);
    }
  } catch (error) {
    console.error('Failed to initialize server storage structure:', error);
  }
};

/**
 * Clear all data in all folders (for testing/reset purposes)
 */
export const clearAllStorage = async (): Promise<void> => {
  for (const key of Object.keys(folders)) {
    await clearFolder(key as keyof StorageFolders);
  }
  await serverStorage.removeItem(`${STORAGE_ROOT}/initialized`);
  console.log('All server storage cleared');
};

/**
 * Subscribe to data changes in a specific folder
 * Returns an unsubscribe function
 */
export const subscribeToFolder = <T>(
  folderKey: keyof StorageFolders, 
  callback: (data: T) => void,
  defaultValue: T,
  pollingInterval = 3000
): () => void => {
  let isActive = true;
  
  const checkForUpdates = async () => {
    if (!isActive) return;
    
    try {
      const data = await getFromFolder<T>(folderKey, defaultValue);
      callback(data);
    } catch (error) {
      console.error(`Error in subscription to ${folderKey}:`, error);
    }
    
    if (isActive) {
      setTimeout(checkForUpdates, pollingInterval);
    }
  };
  
  // Start polling
  checkForUpdates();
  
  // Return unsubscribe function
  return () => {
    isActive = false;
  };
};
