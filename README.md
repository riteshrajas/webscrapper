# 🕷️ PyIntel Web Scraper

A powerful, client-side web scraping tool built with React that extracts and analyzes links from websites. This tool runs entirely in your browser without sending data to external servers.

## ✨ Features

- **🔒 Client-Side Processing**: All scraping operations run in your browser, ensuring data privacy
- **📊 Comprehensive Link Analysis**: Categorizes links into internal, external, and resource types
- **📁 Multiple Export Formats**: Download results as XML, JSON, or sitemap format
- **🎯 Advanced Link Extraction**: Extracts links from various HTML elements (a, link, iframe, img, script, etc.)
- **📋 Detailed Metadata**: Captures page title, description, and other relevant information
- **🔄 Multiple Proxy Support**: Uses fallback proxy services for better reliability
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **⚡ Real-time Progress**: Visual progress indicators during scraping process

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webscrapper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 📖 How to Use

1. **Enter Website URL**: Input the URL of the website you want to scrape
2. **Accept Terms**: Read and accept the terms of use and legal disclaimer
3. **Start Scraping**: Click the "Start Scraping" button to begin the process
4. **View Results**: Review the categorized links and metadata
5. **Export Data**: Download the results in your preferred format (XML, JSON, Sitemap)

## 📊 Export Formats

### XML Format
- **Internal Links XML**: Contains all links within the same domain
- **External Links XML**: Contains all links to other domains
- **Sitemap XML**: Standard sitemap format for internal links

### JSON Format
- **Complete Results**: Full scraping results including metadata, links, and statistics

## ⚠️ Legal Disclaimer

**IMPORTANT**: By using this tool, you acknowledge that:

- This tool is for **personal or business use only**
- You are responsible for complying with all applicable laws and website terms of service
- **PyIntel is not responsible for any data leaks** or misuse of scraped information
- All scraping operations run through your **client browser**, not PyIntel servers
- You agree to use this tool ethically and responsibly
- Some websites may block scraping attempts - this is normal behavior
- Respect robots.txt and rate limits of target websites

## 🔧 Technical Details

### Technologies Used
- **React 19.1.0**: Modern React with hooks
- **Axios**: HTTP client for making requests
- **DOMParser**: Native browser API for HTML parsing
- **CSS Grid & Flexbox**: Modern responsive layout
- **CORS Proxies**: Multiple fallback services for cross-origin requests

### Architecture
- **Client-Side Only**: No backend server required
- **Proxy-Based**: Uses CORS proxies to bypass browser restrictions
- **Modular Design**: Separate utilities for scraping logic
- **Error Handling**: Comprehensive error handling and user feedback

### Supported Link Types
- Standard links (`<a href>`)
- Stylesheets (`<link href>`)
- Images (`<img src>`)
- Scripts (`<script src>`)
- Iframes (`<iframe src>`)
- Image maps (`<area href>`)
- Media sources (`<source src>`)

## 🛠️ Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (one-way operation)

### Project Structure
```
src/
├── components/
│   ├── WebScraper.js          # Main scraper component
│   └── WebScraper.css         # Styling for the scraper
├── utils/
│   └── scraper.js             # Scraping utilities and helpers
├── App.js                     # Main app component
├── App.css                    # Global styles
└── index.js                   # App entry point
```

## 🔍 Features in Detail

### Link Categorization
- **Internal Links**: Links within the same domain
- **External Links**: Links to other domains
- **Resource Links**: Images, scripts, stylesheets, etc.

### Progress Tracking
- Real-time progress bar during scraping
- Step-by-step status updates
- Error handling with detailed messages

### Export Options
- **XML with Metadata**: Structured data with timestamps and source information
- **JSON Export**: Complete results for programmatic use
- **Sitemap Generation**: SEO-friendly sitemap format

## 🔒 Privacy & Security

- **No Server Communication**: All processing happens in your browser
- **No Data Storage**: No data is stored on external servers
- **CORS Proxy Usage**: Uses public proxy services for cross-origin requests
- **Client-Side Only**: Your scraped data never leaves your device

## 📝 License

This project is for educational and personal use. Please ensure you comply with all applicable laws and website terms of service when using this tool.

## 🤝 Contributing

Feel free to submit issues and enhancement requests. Please ensure any contributions follow the existing code style and include appropriate tests.

## 📞 Support

If you encounter any issues or have questions about using this tool, please:
1. Check the browser console for error messages
2. Ensure the target website allows scraping
3. Try with a different URL to isolate the issue
4. Verify your internet connection is stable

---

**Remember**: Use this tool responsibly and ethically. Always respect website terms of service and robots.txt files.
