document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // Corrected ID to match HTML: github-token
    const ghTokenInput = document.getElementById('github-token'); 
    const repoNameInput = document.getElementById('repo-name');
    const addProductForm = document.getElementById('add-product-form');
    const addReviewForm = document.getElementById('add-review-form');
    
    // Status Elements
    const statusOverlay = document.getElementById('status-overlay');
    const loadingSpinner = document.getElementById('loading-spinner');
    const successMsg = document.getElementById('success-msg');
    const errorMsg = document.getElementById('error-msg');
    
    const loadingText = document.getElementById('loading-text');
    const successText = document.getElementById('success-text');
    const errorText = document.getElementById('error-text');

    // Load saved settings
    if (localStorage.getItem('gh_token')) ghTokenInput.value = localStorage.getItem('gh_token');
    if (localStorage.getItem('repo_name')) repoNameInput.value = localStorage.getItem('repo_name');

    // Save settings on change
    ghTokenInput.addEventListener('change', () => localStorage.setItem('gh_token', ghTokenInput.value));
    repoNameInput.addEventListener('change', () => localStorage.setItem('repo_name', repoNameInput.value));

    // --- Helper Functions ---

    function showStatus(type, message) {
        statusOverlay.classList.remove('hidden');
        statusOverlay.classList.remove('flex');
        statusOverlay.classList.add('flex'); // Ensure flex is applied for centering
        
        // Hide all inner containers
        loadingSpinner.classList.add('hidden');
        successMsg.classList.add('hidden');
        errorMsg.classList.add('hidden');

        // Reset display styles for inner containers (remove 'flex' if hidden handles it, but here we toggle 'hidden')
        loadingSpinner.classList.remove('flex');
        successMsg.classList.remove('flex');
        errorMsg.classList.remove('flex');

        if (type === 'loading') {
            loadingSpinner.classList.remove('hidden');
            loadingSpinner.classList.add('flex');
            if (message) loadingText.textContent = message;
        } else if (type === 'success') {
            successMsg.classList.remove('hidden');
            successMsg.classList.add('flex');
            if (message) successText.textContent = message;
        } else if (type === 'error') {
            errorMsg.classList.remove('hidden');
            errorMsg.classList.add('flex');
            if (message) errorText.textContent = message;
        }
    }

    // Base64 Encoding/Decoding for UTF-8 (Arabic support)
    function utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    function b64_to_utf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    async function fetchGitHubFile(filename) {
        const token = ghTokenInput.value;
        const repo = repoNameInput.value;
        
        if (!token || !repo) {
            throw new Error('الرجاء إدخال Token واسم المستودع (Repo Name)');
        }

        const apiUrl = `https://api.github.com/repos/${repo}/contents/${filename}`;

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            cache: 'no-store' // Ensure fresh data
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { content: [], sha: null }; // File doesn't exist yet
            }
            throw new Error(`GitHub Error: ${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        const content = JSON.parse(b64_to_utf8(data.content));
        return { content, sha: data.sha };
    }

    async function updateGitHubFile(filename, content, sha) {
        const token = ghTokenInput.value;
        const repo = repoNameInput.value;
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${filename}`;

        const body = {
            message: `Update ${filename} via Admin Panel`,
            content: utf8_to_b64(JSON.stringify(content, null, 4)),
            sha: sha
        };

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`GitHub Error: ${errData.message || response.statusText}`);
        }

        return await response.json();
    }

    // --- Event Listeners ---

    // 1. Add Product
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('p-name').value;
        const price = parseFloat(document.getElementById('p-price').value);
        const category = document.getElementById('p-category').value;
        const image = document.getElementById('p-image').value;
        const description = document.getElementById('p-desc').value;
        const longDescription = document.getElementById('p-long-desc').value;

        // Create ID from name (slugify)
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const newProduct = {
            id: id,
            name: name,
            price: price,
            inStock: true, // Default
            image: image,
            developer: "NOVA Store", // Default or add input
            category: category,
            description: description,
            longDescription: longDescription,
            features: ["ميزة 1", "ميزة 2"], // Default placeholders, could add input for this
            badges: ["New", category.split(' ')[0]] // Default badges
        };

        try {
            showStatus('loading', 'جاري جلب قائمة المنتجات...');
            const fileData = await fetchGitHubFile('products.json');
            
            let products = fileData.content;
            if (!Array.isArray(products)) products = [];
            
            // Check if product exists (update or add)
            const existingIndex = products.findIndex(p => p.id === id);
            if (existingIndex >= 0) {
                products[existingIndex] = { ...products[existingIndex], ...newProduct };
            } else {
                products.push(newProduct);
            }

            showStatus('loading', 'جاري حفظ المنتج على GitHub...');
            await updateGitHubFile('products.json', products, fileData.sha);

            showStatus('success', 'تمت إضافة المنتج بنجاح وتحديث المتجر');
            addProductForm.reset();
        } catch (error) {
            console.error(error);
            showStatus('error', error.message);
        }
    });

    // 2. Add Review
    addReviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('r-name').value;
        const rating = parseInt(document.getElementById('r-rating').value);
        const avatar = document.getElementById('r-avatar').value;
        const text = document.getElementById('r-text').value;

        const newReview = {
            id: Date.now(), // Simple unique ID
            name: name,
            avatar: avatar,
            rating: rating,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            text: text
        };

        try {
            showStatus('loading', 'جاري جلب قائمة التقييمات...');
            const fileData = await fetchGitHubFile('reviews.json');
            
            let reviews = fileData.content;
            if (!Array.isArray(reviews)) reviews = [];

            reviews.push(newReview);

            showStatus('loading', 'جاري حفظ التقييم على GitHub...');
            await updateGitHubFile('reviews.json', reviews, fileData.sha);

            showStatus('success', 'تمت إضافة التقييم بنجاح');
            addReviewForm.reset();
        } catch (error) {
            console.error(error);
            showStatus('error', error.message);
        }
    });
});
