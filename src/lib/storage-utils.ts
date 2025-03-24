
/**
 * A utility for managing data storage in a structured folder system
 * All data is stored in localStorage but organized as if in folders
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

/**
 * Save data to a specific folder
 */
export const saveToFolder = <T>(folderKey: keyof StorageFolders, data: T): void => {
  try {
    localStorage.setItem(folders[folderKey], JSON.stringify(data));
    console.log(`Data saved to ${folders[folderKey]}`);
  } catch (error) {
    console.error(`Failed to save data to ${folders[folderKey]}:`, error);
  }
};

/**
 * Get data from a specific folder
 */
export const getFromFolder = <T>(folderKey: keyof StorageFolders, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(folders[folderKey]);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Failed to retrieve data from ${folders[folderKey]}:`, error);
    return defaultValue;
  }
};

/**
 * Clear all data in a specific folder
 */
export const clearFolder = (folderKey: keyof StorageFolders): void => {
  try {
    localStorage.removeItem(folders[folderKey]);
    console.log(`Cleared folder: ${folders[folderKey]}`);
  } catch (error) {
    console.error(`Failed to clear folder ${folders[folderKey]}:`, error);
  }
};

/**
 * Initialize all storage folders
 */
export const initializeStorage = (): void => {
  try {
    // Check if storage has been initialized
    if (!localStorage.getItem(`${STORAGE_ROOT}/initialized`)) {
      console.log('Initializing storage structure...');
      
      // Create a record of initialization
      localStorage.setItem(`${STORAGE_ROOT}/initialized`, new Date().toISOString());
      
      // Log storage structure initialization
      console.log('Storage structure initialized:', folders);
    }
  } catch (error) {
    console.error('Failed to initialize storage structure:', error);
  }
};

/**
 * Clear all data in all folders (for testing/reset purposes)
 */
export const clearAllStorage = (): void => {
  Object.keys(folders).forEach((key) => {
    clearFolder(key as keyof StorageFolders);
  });
  localStorage.removeItem(`${STORAGE_ROOT}/initialized`);
  console.log('All storage cleared');
};
