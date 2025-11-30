// Safe localStorage utilities to prevent JSON parse errors

export const safeGetItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === "undefined" || item === "null") {
      return null;
    }
    return item;
  } catch (error) {
    console.error(`Error getting item from localStorage (${key}):`, error);
    return null;
  }
};

export const safeGetJSON = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") {
      return null;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing JSON from localStorage (${key}):`, error);
    // Clean up invalid data
    localStorage.removeItem(key);
    return null;
  }
};

export const safeSetItem = (key, value) => {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error setting item in localStorage (${key}):`, error);
  }
};

export const safeSetJSON = (key, value) => {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error setting JSON in localStorage (${key}):`, error);
  }
};
