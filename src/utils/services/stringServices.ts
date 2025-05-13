import badWords from "@assets/content/badwords";

const stringService = {
    normalizeString: (str: string): string => {
        return str
            .trim()
            .replace(/\s+/g, ' ')
            .toLowerCase();
    },
    capitalizeFirstLetters: (str: string): string => {
        return str
            .toLowerCase()
            .replace(/(^|\.\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    },
    removeSpacesAndLowerCase: (str: string): string => {
        return str.replace(/\s+/g, '').toLowerCase();
    },
    filterBadwords: (str: string): string => {
        return str
            .split(/\b/)
            .map(word => {
                const clean = word.toLowerCase().replace(/[^\wÀ-ÿ]/g, '');
                if (badWords.includes(clean)) {
                    return '*'.repeat(word.length);
                }
                return word;
            })
            .join('');
    },
    containsBadwords: (str: string): boolean => {
        return str
            .split(/\b/)
            .some(word => {
                const clean = word.toLowerCase().replace(/[^\wÀ-ÿ]/g, '');
                return badWords.includes(clean);
            });
    }
};

export default stringService;