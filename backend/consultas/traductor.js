const axios = require("axios");

const traducirTexto = async (texto) => {
    if (!texto) return "";

    try {
        const { data } = await axios.post(
            "https://libretranslate.de/translate",
            {
                q: texto,
                source: "en",
                target: "es",
                format: "text"
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return data.translatedText;

    } catch (error) {
        console.error("❌ Error traduciendo:", error.message);
        return texto;
    }
};

module.exports = { traducirTexto };