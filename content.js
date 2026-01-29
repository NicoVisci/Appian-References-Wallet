/*
Important Note for Appian: Appian uses complex code editors (like Monaco or CodeMirror).
Standard DOM replacement (element.value = ...) often breaks them.
The code below uses document.execCommand('insertText'), which mimics a user pasting text,
ensuring the Appian editor recognizes the change.
*/

let wallet = {};

// 1. Load wallet
chrome.storage.sync.get(['wallet'], (result) => {
    wallet = result.wallet || {};
});

// 2. Listen for updates
chrome.storage.onChanged.addListener((changes) => {
    if (changes.wallet) {
        wallet = changes.wallet.newValue;
    }
});

// 3. Listen for typing
document.addEventListener('keydown', (e) => {
    // Check if the trigger key is Space or Enter
    if (e.key === ' ' || e.key === 'Enter') {
        handleExpansion(e);
    }
}, true);

function handleExpansion(e) {
    const activeElement = document.activeElement;

    // Safety check: ensure we are in an editable area
    if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA' && !activeElement.isContentEditable)) {
        return;
    }

    // Get the word just typed
    const text = getWordBeforeCursor(activeElement);
    if (!text) return;

    if (wallet[text]) {
        // Prevent the Space/Enter from actually happening yet
        e.preventDefault();
        e.stopPropagation();

        const expansion = wallet[text];

        // ---------------------------------------------------------
        // THE FIX: Select the text backwards based on length
        // ---------------------------------------------------------

        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            // Standard Input fields
            const startPos = activeElement.selectionStart - text.length;
            const endPos = activeElement.selectionStart;
            activeElement.setSelectionRange(startPos, endPos);

            // Insert new text
            document.execCommand('insertText', false, expansion);
        }
        else if (window.getSelection) {
            // Complex Editors (Appian, Divs, etc.)
            const selection = window.getSelection();

            // This loop mimics pressing "Shift + Left Arrow" for every character in your key
            for (let i = 0; i < text.length; i++) {
                selection.modify('extend', 'backward', 'character');
            }

            // Now that the key is "highlighted", this command replaces it
            document.execCommand('insertText', false, expansion);
        }
    }
}

// Helper to grab the last word safely
function getWordBeforeCursor(activeElement) {
    let textToCheck = "";

    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        const value = activeElement.value;
        const cursor = activeElement.selectionStart;
        textToCheck = value.substring(0, cursor);
    }
    else if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            // Grab text from the current node up to the cursor
            const range = selection.getRangeAt(0);
            const node = range.startContainer;

            // If the cursor is inside a text node (most common)
            if (node.nodeType === 3) {
                textToCheck = node.textContent.substring(0, range.startOffset);
            }
            // Fallback: sometimes the cursor is at the element level
            else {
                textToCheck = node.textContent;
            }
        }
    }

    // Split by whitespace to find the very last word typed
    const words = textToCheck.split(/\s+/); // \s matches spaces, tabs, newlines
    return words[words.length - 1];
}