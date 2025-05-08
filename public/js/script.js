// script.js
// Set the word limit
const wordLimit = 200;

const contentTextarea = document.getElementById('content');
const wordCountMessage = document.getElementById('wordCountMessage');
const wordLimitMessage = document.getElementById('wordLimitMessage');

// Function to count the number of words in the textarea
function countWords(str) {
    return str.trim().split(/\s+/).length;
}

// Update word count and enforce word limit
contentTextarea.addEventListener('input', function() {
    const wordCount = countWords(contentTextarea.value);
    let remainingWords = wordLimit - wordCount;
    if (remainingWords < 0) {
        remainingWords = 0; // Ensure it doesn't go negative
    }


    // Update word count display
    wordCountMessage.textContent = `Word limit: ${remainingWords} words remaining`;

    // Show error if the word limit is exceeded
    if (wordCount > wordLimit) {
        wordLimitMessage.style.display = 'block'; // Show error message
        contentTextarea.value = contentTextarea.value.substring(0, contentTextarea.value.lastIndexOf(' ')); // Remove last word
    } else {
        wordLimitMessage.style.display = 'none'; // Hide error message
    }
});