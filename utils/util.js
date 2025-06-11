export const toBoolean = (value) => {
    if (value == null)
        return false;
    const normalized = value.trim().toLowerCase();
    return ['1'].includes(normalized);
};
export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
