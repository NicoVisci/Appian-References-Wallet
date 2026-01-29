# Appian Record Wallet & Expander

A lightweight browser extension for Chromium browsers that automates the writing of long Appian references.

Tired of manually looking up and typing complex references like `recordType!{2095bf9e-6733...}Record`? This extension allows you to map short, memorable keys to long text strings and auto-expands them directly in the Appian Expression Editor.

## 🚀 Features

* **Wallet System:** Store an unlimited number of Key-Value pairs locally in your browser.
* **Auto-Expansion:** Type your short key (e.g., `#veh`) and hit `Space` or `Enter` to instantly replace it with the full reference.
* **Editor Compatible:** Specifically engineered to work within Appian's rich text/code editors (Monaco/Expression Editor) using robust cursor manipulation.
* **Privacy First:** No data leaves your browser. All mappings are stored in `chrome.storage.local`.

## 📦 Installation

Since this is a custom developer tool, you will install it as an "Unpacked Extension."

1.  **Clone or Download** this repository to a folder on your computer.
2.  Open Microsoft Edge and navigate to `edge://extensions` (or `chrome://extensions` in Chrome).
3.  Toggle **Developer mode** on (usually in the bottom-left or top-right corner).
4.  Click **Load unpacked**.
5.  Select the folder where you downloaded this repository.

## 🛠 Usage

1.  **Configure your Wallet:**
    * Click the **{ }** extension icon in your browser toolbar.
    * **Short Key:** Enter a unique abbreviation (Recommended: use a prefix like `#` or `_`, e.g., `#cust`).
    * **Long Value:** Paste the full Appian reference (e.g., `recordType!{...}Customer`).
    * Click **Save**.

2.  **In Appian:**
    * Open any Appian Expression Editor or Interface Designer.
    * Type your key: `#cust`
    * Press **Space** or **Enter**.
    * The extension will automatically delete the key and paste the full reference.

## ⚙️ How it Works

The Appian Expression Editor uses complex HTML structures (coloring, syntax highlighting) that break standard "find and replace" scripts.

This extension uses a specific approach to ensure stability:
1.  **Detection:** Listens for `Space` or `Enter` events.
2.  **Backtracking:** Uses `selection.modify('extend', 'backward', 'character')` to highlight the exact length of your short key, regardless of HTML tags.
3.  **Injection:** Uses `document.execCommand('insertText')` to simulate a native user paste, ensuring Appian recognizes the code change.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.