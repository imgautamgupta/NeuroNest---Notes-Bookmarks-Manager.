const { OpenAI } = require('openai');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const generateSummary = async (content) => {
    if (!openai) {
        // Fallback or Mock
        return content.substring(0, 150) + '...';
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant that summarizes notes into concise bullet points." },
                { role: "user", content: `Summarize the following note content into a few bullet points:\n\n${content}` }
            ],
            max_tokens: 150
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('AI Summary Error:', error.message);
        return content.substring(0, 150) + '...';
    }
};

const generateTags = async (content) => {
    if (!openai) {
        // Simple fallback: extract words that look like tags (capitalized or common keywords)
        const commonKeywords = ['javascript', 'react', 'node', 'database', 'frontend', 'backend', 'api', 'css', 'html', 'python', 'ai'];
        const words = content.toLowerCase().split(/\W+/);
        const tags = commonKeywords.filter(kw => words.includes(kw));
        return [...new Set(tags)].slice(0, 5);
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant that extracts relevant tags from text. Return ONLY a comma-separated list of tags." },
                { role: "user", content: `Extract tags for this content:\n\n${content}` }
            ],
            max_tokens: 50
        });

        return response.choices[0].message.content.split(',').map(tag => tag.trim());
    } catch (error) {
        console.error('AI Tagging Error:', error.message);
        return [];
    }
};

module.exports = { generateSummary, generateTags };
