// utils/scraper.js
export const ScraperUtils = {
  // Extract domain from URL
  extractDomain: (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  },

  // Validate URL format
  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  },

  // Clean and normalize URLs
  normalizeUrl: (url, baseUrl) => {
    try {
      if (url.startsWith('//')) {
        return `https:${url}`;
      }
      if (url.startsWith('/')) {
        const base = new URL(baseUrl);
        return `${base.protocol}//${base.host}${url}`;
      }
      if (!url.startsWith('http')) {
        return new URL(url, baseUrl).href;
      }
      return url;
    } catch {
      return null;
    }
  },

  // Extract various types of links
  extractLinks: (doc, baseUrl) => {
    const linkSelectors = [
      'a[href]',
      'link[href]',
      'area[href]',
      'iframe[src]',
      'img[src]',
      'script[src]',
      'source[src]'
    ];

    const allLinks = new Set();
    
    linkSelectors.forEach(selector => {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(element => {
        const href = element.getAttribute('href') || element.getAttribute('src');
        if (href) {
          const normalizedUrl = ScraperUtils.normalizeUrl(href, baseUrl);
          if (normalizedUrl && ScraperUtils.isValidUrl(normalizedUrl)) {
            allLinks.add(normalizedUrl);
          }
        }
      });
    });

    return Array.from(allLinks);
  },

  // Categorize links by domain
  categorizeLinks: (links, baseDomain) => {
    const internal = [];
    const external = [];
    const resources = [];

    links.forEach(link => {
      const domain = ScraperUtils.extractDomain(link);
      if (!domain) return;

      // Check if it's a resource (image, script, etc.)
      const isResource = /\.(jpg|jpeg|png|gif|css|js|pdf|doc|zip)$/i.test(link);
      
      if (domain === baseDomain) {
        internal.push(link);
      } else {
        external.push(link);
      }

      if (isResource) {
        resources.push(link);
      }
    });

    return {
      internal: [...new Set(internal)],
      external: [...new Set(external)],
      resources: [...new Set(resources)]
    };
  },

  // Generate XML with better structure
  generateAdvancedXML: (data, type) => {
    const escapeXml = (unsafe) => {
      return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case "'": return '&apos;';
          case '"': return '&quot;';
          default: return c;
        }
      });
    };

    const links = type === 'internal' ? data.categorizedLinks.internal : data.categorizedLinks.external;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<linkCollection type="${type}" generated="${new Date().toISOString()}">\n`;
    xml += `  <metadata>\n`;
    xml += `    <sourceUrl>${escapeXml(data.originalUrl)}</sourceUrl>\n`;
    xml += `    <sourceDomain>${escapeXml(data.baseDomain)}</sourceDomain>\n`;
    xml += `    <scrapeTimestamp>${data.timestamp}</scrapeTimestamp>\n`;
    xml += `    <totalLinks>${links.length}</totalLinks>\n`;
    xml += `    <scrapeMethod>client-side</scrapeMethod>\n`;
    xml += `    <tool>PyIntel Web Scraper</tool>\n`;
    xml += `  </metadata>\n`;
    xml += `  <links>\n`;
    
    links.forEach((link, index) => {
      const domain = ScraperUtils.extractDomain(link);
      xml += `    <link id="${index + 1}">\n`;
      xml += `      <url>${escapeXml(link)}</url>\n`;
      xml += `      <domain>${escapeXml(domain)}</domain>\n`;
      xml += `      <type>${type}</type>\n`;
      xml += `    </link>\n`;
    });
    
    xml += `  </links>\n`;
    xml += `</linkCollection>`;
    
    return xml;
  },

  // Generate sitemap XML
  generateSitemapXML: (data) => {
    const links = data.categorizedLinks.internal;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    links.forEach(link => {
      xml += `  <url>\n`;
      xml += `    <loc>${ScraperUtils.escapeXml(link)}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.5</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    
    return xml;
  },

  escapeXml: (unsafe) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  },

  // Check for broken links
  checkBrokenLinks: async (links, maxConcurrent = 5) => {
    const brokenLinks = [];
    const workingLinks = [];
    const unreachableLinks = [];

    // Helper function to check a single link
    const checkSingleLink = async (url) => {
      try {
        // Use fetch with timeout and HEAD request to minimize data transfer
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors', // This helps with CORS issues
          cache: 'no-cache'
        });

        clearTimeout(timeoutId);

        // For no-cors mode, response.ok might not be reliable
        // Consider it working if no error was thrown
        return { url, status: 'working', statusCode: response.status || 200 };
      } catch (error) {
        // Fallback: try GET request for resources that might not support HEAD
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for GET

          const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            mode: 'no-cors',
            cache: 'no-cache'
          });

          clearTimeout(timeoutId);
          return { url, status: 'working', statusCode: response.status || 200 };
        } catch (secondError) {
          if (secondError.name === 'AbortError') {
            return { url, status: 'timeout', error: 'Request timeout' };
          }
          return { url, status: 'broken', error: secondError.message };
        }
      }
    };

    // Process links in batches to avoid overwhelming the browser
    const processBatch = async (batch) => {
      const promises = batch.map(checkSingleLink);
      return Promise.allSettled(promises);
    };

    // Split links into batches
    const batches = [];
    for (let i = 0; i < links.length; i += maxConcurrent) {
      batches.push(links.slice(i, i + maxConcurrent));
    }

    // Process all batches
    for (const batch of batches) {
      const results = await processBatch(batch);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const linkResult = result.value;
          if (linkResult.status === 'working') {
            workingLinks.push(linkResult);
          } else if (linkResult.status === 'timeout') {
            unreachableLinks.push(linkResult);
          } else {
            brokenLinks.push(linkResult);
          }
        } else {
          // Promise was rejected
          brokenLinks.push({
            url: batch[index],
            status: 'broken',
            error: result.reason?.message || 'Unknown error'
          });
        }
      });

      // Add a small delay between batches to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return {
      broken: brokenLinks,
      working: workingLinks,
      unreachable: unreachableLinks,
      total: links.length,
      brokenCount: brokenLinks.length,
      workingCount: workingLinks.length,
      unreachableCount: unreachableLinks.length
    };
  },
};
