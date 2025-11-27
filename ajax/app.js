// Default values
const defaultImage = "flower.jpg"; // local flower image
const defaultQuote = "Grow With Grace";


document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const posterImage = document.getElementById('posterImage');
    const posterQuote = document.getElementById('posterQuote');
    const generateBtn = document.getElementById('generateBtn');
    const statusElement = document.getElementById('status');
    
 // Guard checks to ensure elements exist 
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
    
    // Set initial content
    posterImage.src = defaultImage;
    posterQuote.textContent = defaultQuote;
    
    // Add click event listener to the button
    generateBtn.addEventListener('click', async () => {
        // Runtime guard in case elements were removed after initial load
        if (!posterImage || !posterQuote || !statusElement) {
            console.warn('Required UI elements are missing during click handler — aborting.');
            return
        }
        // 1. Update status to "Loading poster..."
        statusElement.textContent = 'Loading poster...';
        generateBtn.disabled = true;
        
        try {
            // 2. Fetch image from https://picsum.photos/800/400
            const imageResponse = await fetch('https://picsum.photos/800/400');
            if (!imageResponse.ok) throw new Error('Failed to fetch image');
            const imageUrl = imageResponse.url;
            
            // 3. Fetch quote from https://dummyjson.com/quotes/random
            const quoteResponse = await fetch('https://dummyjson.com/quotes/random');
            if (!quoteResponse.ok) throw new Error('Failed to fetch quote');
            const quoteData = await quoteResponse.json();
            const quote = `"${quoteData.quote}" - ${quoteData.author}`;
            
            // 4. Update DOM with image + quote
            posterImage.src = imageUrl;
            posterQuote.textContent = quote;
            statusElement.textContent = 'Poster updated successfully!';
            
        } catch (error) {
            // 5. Handle failures with defaults
            console.error('Error:', error);
            statusElement.textContent = 'Error loading content. Using defaults.';
            posterImage.src = defaultImage;
            posterQuote.textContent = defaultQuote;
        } finally {
            // Re-enable the button after a delay
            setTimeout(() => {
                generateBtn.disabled = false;
                statusElement.textContent = '';
            }, 2000);
        }
    });
});