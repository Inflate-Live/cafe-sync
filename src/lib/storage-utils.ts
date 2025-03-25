
/**
 * A utility for managing data storage in a structured server-side folder system
 * All data is stored in server memory instead of localStorage
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

// Server-side storage implementation (in-memory)
const serverStorage = (() => {
  // Use a closure to create a private in-memory database
  const storageData: Record<string, string> = {};
  
  return {
    // Store data in memory
    setItem: async (key: string, value: string): Promise<void> => {
      // Simulate server call with artificial delay
      return new Promise((resolve) => {
        setTimeout(() => {
          storageData[key] = value;
          console.log(`[SERVER] Data saved to ${key}`);
          resolve();
        }, 100);
      });
    },
    
    // Retrieve data from memory
    getItem: async (key: string): Promise<string | null> => {
      // Simulate server call with artificial delay
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = storageData[key] || null;
          console.log(`[SERVER] Data retrieved from ${key}`);
          resolve(data);
        }, 100);
      });
    },
    
    // Delete data from memory
    removeItem: async (key: string): Promise<void> => {
      // Simulate server call with artificial delay
      return new Promise((resolve) => {
        setTimeout(() => {
          delete storageData[key];
          console.log(`[SERVER] Data removed from ${key}`);
          resolve();
        }, 100);
      });
    }
  };
})();

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

// In-memory cache for subscriptions to reduce polling loads
const memoryCache: Record<string, any> = {};

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
      
      // Only call callback if data changed to reduce unnecessary renders
      const currentDataJSON = JSON.stringify(data);
      if (memoryCache[folderKey] !== currentDataJSON) {
        memoryCache[folderKey] = currentDataJSON;
        callback(data);
      }
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
