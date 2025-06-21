const axios = require('axios');

module.exports = async (req, res) => {
    const { url, proxy } = req.query;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    const getProxyUrl = (targetUrl, proxyType) => {
        switch (proxyType) {
            case 'allorigins':
                return `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            case 'cors-anywhere':
                return `https://cors-anywhere.herokuapp.com/${targetUrl}`;
            case 'codetabs':
                return `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
            default:
                return null;
        }
    };

    let proxyServices = [];
    if (proxy === 'auto') {
        proxyServices = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://cors-anywhere.herokuapp.com/${url}`,
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
        ];
    } else if (proxy) {
        const proxyUrl = getProxyUrl(url, proxy);
        if (proxyUrl) proxyServices.push(proxyUrl);
    }

    if (proxyServices.length === 0) {
        proxyServices.push(url); // Direct request if no proxy
    }

    for (const proxyUrl of proxyServices) {
        try {
            const response = await axios.get(proxyUrl, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'PyIntel Web Scraper 2.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                }
            });
            // For allorigins, the content is in response.data.contents
            return res.status(200).send(response.data.contents || response.data);
        } catch (error) {
            console.warn(`Proxy ${proxyUrl} failed:`, error.message);
            continue; // Try next proxy
        }
    }

    res.status(500).send('All proxies failed to fetch the URL.');
};
