export function isValidTaj(taj: string): boolean {
    if (!taj || taj.length !== 9 || !/^\d{9}$/.test(taj)) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 8; i++) {
        const digit = parseInt(taj.charAt(i), 10);
        // Odd position (1st, 3rd, 5th, 7th) -> index 0, 2, 4, 6
        if ((i + 1) % 2 !== 0) {
            sum += digit * 3;
        } else {
            // Even position (2nd, 4th, 6th, 8th) -> index 1, 3, 5, 7
            sum += digit * 7;
        }
    }

    const checkDigit = sum % 10;
    const actualCheckDigit = parseInt(taj.charAt(8), 10);

    return checkDigit === actualCheckDigit;
}
