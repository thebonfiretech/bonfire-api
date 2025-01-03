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
    }
};

export default stringService;
