
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join, relative, resolve } from 'path';
import { promises as fs } from 'fs';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = resolve(__dirname, '../dist');
const pdfDir = join(__dirname, '../public/pdfs'); // Output to public so they're committed

// Helper to wait for server to start
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getHtmlFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
        const res = resolve(dir, entry.name);
        return entry.isDirectory() ? getHtmlFiles(res) : res;
    }));
    return files.flat().filter((file) => file.endsWith('.html'));
}

async function main() {
    // 1. Ensure PDF directory exists
    await fs.mkdir(pdfDir, { recursive: true });

    // 2. Start a local server (using astro preview or a simple static server)
    // We'll use python if available or just node http-server. 
    // Let's rely on 'npx http-server' which is standard.
    console.log('Starting local server...');
    const port = 4321; // Starlight default-ish
    const server = spawn('npx', ['http-server', 'dist', '-p', port.toString(), '-s'], {
        stdio: 'ignore', // Keep it quiet
        shell: true
    });

    // Give server a moment to spin up
    await wait(2000);

    try {
        // 3. Launch Puppeteer
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();

        // 4. Find all HTML files
        const allHtml = await getHtmlFiles(distDir);

        // Filter out 404 or other non-content pages if needed
        const contentPages = allHtml.filter(f => !f.endsWith('404.html'));

        console.log(`Found ${contentPages.length} pages to print.`);

        for (const filePath of contentPages) {
            // Convert file path to URL
            const relativePath = relative(distDir, filePath);
            // Clean up path: replace \ with /, remove index.html
            let urlPath = relativePath.replace(/\\/g, '/');
            if (urlPath.endsWith('index.html')) {
                urlPath = urlPath.replace('index.html', '');
            } else {
                urlPath = urlPath.replace('.html', '');
            }

            const url = `http://localhost:${port}/${urlPath}`;

            // Determine output filename
            // e.g. 'docs/intro/index.html' -> 'docs-intro.pdf'
            // or just keep the slug structure? Flat structure is often easier for downloads.
            // Let's do slug-based-flat-filenames: 'docs-intro.pdf'

            // Sanitizing slug for filename
            let slug = urlPath.replace(/\/$/g, '').replace(/\//g, '-');
            if (slug === '') slug = 'home';

            const pdfPath = join(pdfDir, `${slug}.pdf`);

            console.log(`Printing: ${url} -> ${slug}.pdf`);

            await page.goto(url, { waitUntil: 'networkidle0' });

            // Inject CSS to ensure print styles are forced if needed, 
            // but media="print" should handle it automatically via page.pdf()

            await page.pdf({
                path: pdfPath,
                format: 'A4',
                printBackground: true, // Essential for our zebra stripes & styles
                margin: {
                    top: '0', // We handle margins in CSS @page
                    right: '0',
                    bottom: '0',
                    left: '0'
                }
            });
        }

        await browser.close();
        console.log('PDF generation complete!');

    } catch (err) {
        console.error('PDF Generation Failed:', err);
        process.exit(1);
    } finally {
        console.log('Stopping server...');
        server.kill();
    }
}

main();
