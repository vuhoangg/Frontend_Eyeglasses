// src/utils/format.js (or src/utils/format.jsx)
export const formatNumber = (number) => {
    if (number === null || number === undefined) {
        return ''; // Or handle null/undefined as you prefer
    }
    return number.toLocaleString('vi-VN'); // Formats number for Vietnamese locale (using commas)
};