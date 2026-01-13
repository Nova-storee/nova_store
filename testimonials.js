let testimonials = [];

async function loadTestimonials() {
    try {
        const response = await fetch('reviews.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        testimonials = await response.json();
        renderTestimonials();
    } catch (error) {
        console.error('Failed to load reviews:', error);
        // Fallback to static data if fetch fails (optional, or just show empty)
        // For now, let's keep it empty or could add hardcoded fallback here.
    }
}

function renderTestimonials() {
    const container = document.getElementById('testimonials-track');
    if (!container) return;

    if (testimonials.length === 0) {
        container.innerHTML = '<p class="text-white text-center w-full">لا توجد تقييمات حالياً.</p>';
        return;
    }

    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card min-w-[260px] sm:min-w-[300px] md:min-w-[350px] bg-gradient-to-br from-[#D900FF] to-[#7B00FF] p-4 md:p-6 rounded-xl shadow-lg relative mx-2 flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
            <!-- Quote Icon -->
            <div class="absolute top-4 left-4 text-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" class="md:w-10 md:h-10">
                    <path d="M14.017 21L14.017 18C14.017 16.896 14.913 16 16.017 16H19.017C19.569 16 20.017 15.552 20.017 15V9C20.017 8.448 19.569 8 19.017 8H15.017C14.465 8 14.017 8.448 14.017 9V11C14.017 11.552 13.569 12 13.017 12H12.017V5H22.017V15C22.017 18.314 19.331 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.896 5.91297 16 7.01697 16H10.017C10.569 16 11.017 15.552 11.017 15V9C11.017 8.448 10.569 8 10.017 8H6.01697C5.46497 8 5.01697 8.448 5.01697 9V11C5.01697 11.552 4.56897 12 4.01697 12H3.01697V5H13.017V15C13.017 18.314 10.331 21 7.01697 21H5.01697Z"></path>
                </svg>
            </div>

            <!-- Avatar -->
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 p-1 mb-3 md:mb-4 overflow-hidden border-2 border-white/50">
                <img src="${t.avatar}" alt="${t.name}" class="w-full h-full object-cover rounded-full bg-black/20">
            </div>

            <!-- Name -->
            <h3 class="text-white font-bold text-lg md:text-xl mb-1 md:mb-2 font-sans">${t.name}</h3>

            <!-- Stars -->
            <div class="flex gap-1 mb-3 md:mb-4 text-yellow-300 text-sm md:text-base">
                ${Array(t.rating).fill('★').map(star => `<span>${star}</span>`).join('')}
            </div>

            <!-- Text -->
            <p class="text-white text-xs md:text-base leading-relaxed font-medium opacity-90">
                ${t.text}
            </p>
        </div>
    `).join('');
}

function initTestimonialsSlider() {
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (!track || !prevBtn || !nextBtn) return;

    // Dynamic scroll step based on card width + gap (approx)
    // Mobile: 260 + 16 (mx-2 * 2) = 276 (approx)
    // Tablet: 300 + 16 = 316
    // Desktop: 350 + 16 = 366
    
    const getScrollStep = () => {
        const card = track.querySelector('.testimonial-card');
        return card ? card.offsetWidth + 16 : 300; // 16px is total horizontal margin
    };

    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollStep(), behavior: 'smooth' }); // Scroll Right
    });

    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' }); // Scroll Left
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadTestimonials();
    initTestimonialsSlider();
});
