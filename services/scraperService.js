const axios = require('axios');
const cheerio = require('cheerio');

const getMetadata = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000
        });

        const $ = cheerio.load(data);

        const metadata = {
            title: $('title').text() || $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content'),
            description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || $('meta[name="twitter:description"]').attr('content'),
            favicon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href'),
            image: $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content')
        };

        // Fix relative paths for favicon and image
        if (metadata.favicon && !metadata.favicon.startsWith('http')) {
            const urlObj = new URL(url);
            metadata.favicon = `${urlObj.protocol}//${urlObj.host}${metadata.favicon.startsWith('/') ? '' : '/'}${metadata.favicon}`;
        }

        return metadata;
    } catch (error) {
        console.error(`Metadata extraction error for ${url}:`, error.message);
        return {
            title: url,
            description: '',
            favicon: '',
            image: ''
        };
    }
};

module.exports = { getMetadata };
