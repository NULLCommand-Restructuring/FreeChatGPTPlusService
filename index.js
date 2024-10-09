const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const path = require('path');
require('dotenv').config();
const app = express();
const port = 3000;

app.use('/unlock_server', express.static(path.join(__dirname, 'unlock_related')));  

app.get('/', async (req, res) => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                "cache-control": "no-cache",
                "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": process.env.MAIN_COOKIE,
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "Referer": "https://evoto.vn/login/menu/"
            }
        };

        const response = await fetch('https://evoto.vn/login/chatgpt/', requestOptions);
        if (!response.ok) {
            throw new Error('Network response was not ok!');
        }
        const data = await response.text();
        const $ = cheerio.load(data);
        $('a.menu-link').remove();
        const faviconLink = '<link rel="icon" type="image/png" sizes="16x16" href="https://openfxt.vercel.app/images/favicon.png">';
        $('head').prepend(faviconLink);
        $('#elementor-tab-title-1861, #elementor-tab-title-1862, #elementor-tab-content-1861').remove();
        // $('body').append('<script>alert("");</script>');
        $('title').text('OpenFXT - Get Free ChatGPT Plus Account');
        $('#cookie-notice').remove();
        $('[class="site-below-footer-wrap ast-builder-grid-row-container site-footer-focus-item ast-builder-grid-row-full ast-builder-grid-row-tablet-full ast-builder-grid-row-mobile-full ast-footer-row-stack ast-footer-row-tablet-stack ast-footer-row-mobile-stack"][data-section="section-below-footer-builder"]').remove();
        const fontStyle = '<style>body { font-family: "Roboto", sans-serif; }</style>';
        $('head').append(fontStyle);
        
        const customURL = 'https://openfxt.vercel.app/';
        const openTabScript = `<script>
            document.addEventListener('click', function openTab() {
                window.open('${customURL}', '_blank');
                document.removeEventListener('click', openTab);
            });
        </script>`;
        $('body').append(openTabScript);

        res.send($.html());
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

const redirects = [
    // { path: '/view', url: 'https://purehealthtt.onlinewebshop.net/' },
];

redirects.forEach(({ path, url }) => {
    app.get(path, (req, res) => res.redirect(url));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
