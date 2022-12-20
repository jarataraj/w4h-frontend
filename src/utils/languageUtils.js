const isEnglish = (locale) => {
    return /^en\b/.test(locale);
};

const languageOf = (locale) => {
    return locale.split("-")[0];
};

const localToday = (localDate, subjectDate, locale) => {
    if (subjectDate === localDate) {
        switch (languageOf(locale)) {
            case "en":
                return "Today";
            case "sp":
                return "Hoy";
            case "de":
                return "Heute";
            default:
                return false;
        }
    }
};

export default {
    isEnglish,
    languageOf,
    localToday,
};
