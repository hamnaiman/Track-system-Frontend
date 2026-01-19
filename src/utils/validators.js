// utils/validator.js

// Required field check
export const isRequired = (value) => {
    return value !== "" && value !== null && value !== undefined;
};

// Email validation
export const isEmail = (email) => {
    if (!email) return false;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
};

// Password validation (min 6 chars)
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// Number validation
export const isNumber = (num) => {
    return !isNaN(num);
};
