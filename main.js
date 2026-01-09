document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-menu-btn');

    if (menuBtn && mobileMenu && closeBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden'); // Show menu
            mobileMenu.classList.add('flex'); // Ensure it uses flex layout
        });

        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.add('hidden'); // Hide menu
            mobileMenu.classList.remove('flex');
        });
    }

    // Modal Logic
    const modalHTML = `
    <div id="buy-modal" class="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm hidden flex items-center justify-center transition-opacity duration-300 opacity-0">
        <div class="bg-cardBg border border-neonPurple/50 rounded-2xl p-6 w-[90%] max-w-md relative shadow-[0_0_30px_rgba(217,0,255,0.3)] transform transition-all duration-300 scale-90">
            <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div class="text-center">
                <h3 id="modal-product-name" class="text-xl font-bold text-white mb-4 font-pixel"></h3>
                <div class="relative mb-4 group/modal">
                    <img id="modal-product-image" src="" alt="Product" class="w-full h-48 object-cover rounded-xl border border-white/10 shadow-lg group-hover/modal:shadow-neonPurple/50 transition duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
                    <div class="absolute bottom-2 right-2 bg-neonPurple text-white text-xs font-bold px-2 py-1 rounded">Selected</div>
                </div>
                
                <h4 class="text-xl font-bold text-white mb-2">جاز لك المنتج؟ تستاهله والله ! 🤍</h4>
                <p class="text-gray-300 mb-2 text-base leading-relaxed font-bold">
                    لو حاب تطلبه أو عندك أي سؤال بخاطرك، يا هلا والله ومسهلا فيك <span class="text-neonBlue">بسيرفرنا ديسكورد</span>..
                </p>
                <p class="text-gray-300 mb-6 text-base leading-relaxed font-bold">
                    كل اللي عليك تفتح <span class="text-neonBlue">تذكرة (Ticket)</span> وفريقنا بيضبطك ويرد عليك <span class="text-neonGreen">بأسرع وقت ⚡️</span>
                </p>
                
                <p class="text-xs text-gray-400 mb-2">لدخول السيرفر</p>
                <a href="https://discord.gg/dfq8cU8bnW" target="_blank" class="w-full bg-neonGreen hover:bg-white text-black font-bold py-3 rounded-xl transition transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,163,0.4)] flex items-center justify-center gap-2 no-underline">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    اضغط هنا
                </a>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('buy-modal');
    const modalContent = modal.querySelector('div'); // The inner container
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const buyBtns = document.querySelectorAll('.buy-now-btn');

    function openModal(imageSrc, name) {
        modalImage.src = imageSrc;
        modalName.textContent = name;
        modal.classList.remove('hidden');
        // Trigger reflow for animation
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-90');
        modalContent.classList.add('scale-100');
    }

    function closeModal() {
        modal.classList.add('opacity-0');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-90');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Event Delegation for Buy Now Buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.buy-now-btn');
        if (btn) {
            e.preventDefault();
            // Try to find the card container. 
            // - .group: used in listing pages
            // - .bg-cardBg: used in listing pages
            // - [class*="bg-cardBg"]: handles bg-cardBg/50 in product-details.html
            const card = btn.closest('.group') || btn.closest('.bg-cardBg') || btn.closest('[class*="bg-cardBg"]');
            
            if (card) {
                const imgElement = card.querySelector('img');
                // Prioritize h1 (used in product details) over h3 (used in listings)
                // This prevents picking up "Game Features" (h3) in product details page
                const titleElement = card.querySelector('h1') || card.querySelector('h3');
                
                if (imgElement && titleElement) {
                    const img = imgElement.src;
                    const name = titleElement.innerText.replace('HOT', '').replace('جديد', '').trim(); // Basic cleanup
                    openModal(img, name);
                }
            }
        }
    });

    // --- Search Logic ---
    const searchModalHTML = `
    <div id="search-modal" class="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl hidden flex items-start justify-center pt-24 transition-opacity duration-300 opacity-0">
        <div class="w-full max-w-3xl px-4 relative flex flex-col items-center">
            <button id="close-search-btn" class="absolute -top-12 right-4 text-gray-400 hover:text-white transition p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div class="w-full relative mb-8">
                <input type="text" id="search-input" placeholder="ابحث عن اسم اللعبة..." class="w-full bg-transparent border-b-2 border-neonPurple/50 text-white text-3xl font-bold py-4 px-2 focus:outline-none focus:border-neonPurple placeholder-gray-600 text-center font-sans dir-rtl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neonPurple/50 absolute left-2 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            
            <div id="search-results" class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                <!-- Results will be injected here -->
            </div>
            
            <div id="no-results" class="hidden text-center text-gray-400 text-xl mt-8 font-bold animate-pulse">
                ما لقينا شي بهذا الاسم 😅
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', searchModalHTML);

    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const noResults = document.getElementById('no-results');

    function openSearch() {
        if (!searchModal) return;
        searchModal.classList.remove('hidden');
        // Trigger reflow for animation
        void searchModal.offsetWidth;
        searchModal.classList.remove('opacity-0');
        searchInput.focus();
        searchInput.value = ''; // Clear previous search
        searchResults.innerHTML = ''; // Clear previous results
        noResults.classList.add('hidden');
    }

    function closeSearch() {
        if (!searchModal) return;
        searchModal.classList.add('opacity-0');
        setTimeout(() => {
            searchModal.classList.add('hidden');
        }, 300);
    }

    if (searchTrigger) {
        searchTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openSearch();
        });
    }

    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', closeSearch);
    }
    
    // Close on click outside
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) closeSearch();
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal && !searchModal.classList.contains('hidden')) {
            closeSearch();
        }
    });

    // Search Input Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length === 0) {
                searchResults.innerHTML = '';
                noResults.classList.add('hidden');
                return;
            }

            // Ensure products variable is available
            if (typeof products === 'undefined') {
                console.error('Products data not found');
                return;
            }

            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query) || 
                (product.description && product.description.toLowerCase().includes(query))
            );

            renderSearchResults(filteredProducts);
        });
    }

    function renderSearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
            
            results.forEach(product => {
                let badgeColor = 'bg-neonPurple/20 text-neonPurple border border-neonPurple/30';
                let badgeText = 'ستيم أوفلاين';
                
                if (product.category === 'PC Games') {
                    badgeColor = 'bg-neonGreen text-black';
                    badgeText = 'PC Game';
                } else if (product.category === 'Software') {
                        badgeColor = 'bg-neonBlue text-black';
                        badgeText = 'برنامج';
                }

                const card = document.createElement('div');
                card.className = 'flex bg-cardBg rounded-xl overflow-hidden border border-white/5 hover:border-neonPurple/50 transition duration-300 group shadow-lg hover:shadow-neonPurple/20 animate-fade-in h-24 sm:h-32 cursor-pointer';
                
                // Add click event to the entire card
                card.addEventListener('click', () => {
                    window.location.href = `product-details.html?id=${product.id}`;
                });
                
                card.innerHTML = `
                    <div class="w-1/3 relative overflow-hidden">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    </div>
                    <div class="w-2/3 p-3 flex flex-col justify-between">
                        <div>
                            <h3 class="font-bold text-sm sm:text-base text-white group-hover:text-neonPurple transition truncate text-right">${product.name}</h3>
                            <div class="flex justify-end mt-1">
                                <span class="text-[10px] ${badgeColor} px-2 py-0.5 rounded">${badgeText}</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mt-2">
                             <button class="text-xs bg-white/10 hover:bg-neonPurple hover:text-white text-gray-300 px-3 py-1 rounded-full transition">تفاصيل</button>
                            <span class="text-neonGreen font-bold text-sm">${product.price} ر.س</span>
                        </div>
                    </div>
                `;
                searchResults.appendChild(card);
            });
        }
    }
});
