// Default values used when network requests fail
const defaultImage = "flower.jpg"; // local flower image path (relative to HTML file)
const defaultQuote = "Grow With Grace"; // default text shown when no quote fetched


// Wait until the DOM is fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    // Get important DOM nodes we will read/update
    const posterImage = document.getElementById('posterImage');
    const posterQuote = document.getElementById('posterQuote');
    const generateBtn = document.getElementById('generateBtn');
    const statusElement = document.getElementById('status');
    
 // Guard checks to ensure elements exist (prevent runtime exceptions if the HTML is missing them)
    if (!posterImage || !posterQuote || !generateBtn || !statusElement) {
        console.error('Cannot initialize app — missing DOM elements:', {
            posterImage: !!posterImage,
            posterQuote: !!posterQuote,
            generateBtn: !!generateBtn,
            statusElement: !!statusElement
        });
        if (statusElement) statusElement.textContent = 'App could not start: missing UI elements.';
        return;
    }
    
    // Initialize UI with defaults before any network activity
    posterImage.src = defaultImage;
    posterQuote.textContent = defaultQuote;
    
    // When the button is clicked we will fetch a new image and quote
    generateBtn.addEventListener('click', () => {
        // Runtime guard in case elements were removed after initial load (defensive programming)
        if (!posterImage || !posterQuote || !statusElement) {
            console.warn('Required UI elements are missing during click handler — aborting.');
            return
        }
        // 1. Update status text and disable button to show a pending state
        statusElement.textContent = 'Loading poster...';
        generateBtn.disabled = true;

        // Compose Promises for both network requests. We start them in parallel
        // and rely on Promise.all so the DOM only updates when BOTH complete.
        const imagePromise = fetch('https://picsum.photos/800/400')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch image');
                return res.url;
            });

        // The quote API returns JSON; we parse it and format the rendered string below
        const quotePromise = fetch('https://dummyjson.com/quotes/random')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch quote');
                return res.json();
            })
            .then((quoteData) => {
                // If the API returns a quote property use it, otherwise fall back to defaultQuote
                const quoteText = quoteData?.quote ?? defaultQuote;
                const quoteAuthor = quoteData?.author ? ` - ${quoteData.author}` : '';
                return `"${quoteText}"${quoteAuthor}`;
            });

        // When both requests succeed, update the DOM. If either fails the .catch executes.
        Promise.all([imagePromise, quotePromise])
            .then(([imageUrl, quote]) => {
                // 4. Update DOM with image + quote
                posterImage.src = imageUrl;
                posterQuote.textContent = quote;
                statusElement.textContent = 'Poster updated successfully!';
            })
            .catch((error) => {
                // 5. Handle failures with defaults
                console.error('Error:', error);
                statusElement.textContent = 'Error loading content. Using defaults.';
                posterImage.src = defaultImage;
                posterQuote.textContent = defaultQuote;
            })
            .finally(() => {
                // Re-enable the button after a delay
                setTimeout(() => {
                    generateBtn.disabled = false;
                    statusElement.textContent = '';
                }, 2000);
            });
    });
});