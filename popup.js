document.addEventListener('DOMContentLoaded', loadItems);
document.getElementById('saveBtn').addEventListener('click', saveItem);

function saveItem() {
  const key = document.getElementById('shortKey').value.trim();
  const value = document.getElementById('longValue').value.trim();

  if (!key || !value) return;

  chrome.storage.sync.get(['wallet'], function(result) {
    const wallet = result.wallet || {};
    wallet[key] = value;
    
    chrome.storage.sync.set({wallet: wallet}, function() {
      document.getElementById('shortKey').value = '';
      document.getElementById('longValue').value = '';
      loadItems();
    });
  });
}

function loadItems() {
  const list = document.getElementById('list');
  list.innerHTML = '';
  
  chrome.storage.sync.get(['wallet'], function(result) {
    const wallet = result.wallet || {};
    for (let key in wallet) {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<span class="key">${key}</span> <button class="delete-btn" data-key="${key}">X</button>`;
      list.appendChild(div);
    }
    
    // Add delete listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        delete wallet[this.getAttribute('data-key')];
        chrome.storage.sync.set({wallet: wallet}, loadItems);
      });
    });
  });
}