// ===== PROJECT MODAL =====
const projectModal = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalCurrentImage = document.getElementById('modalCurrentImage');
const modalThumbnails = document.getElementById('modalThumbnails');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalImageCounter = document.getElementById('modalImageCounter');

let currentProjectImages = [];
let currentImageIndex = 0;

// Function to open modal with project images
function openProjectModal(photoItem) {
    const imagesJson = photoItem.getAttribute('data-project-images');
    
    // Parse images array
    try {
        currentProjectImages = JSON.parse(imagesJson);
    } catch (e) {
        currentProjectImages = [];
    }
    
    // Reset image index
    currentImageIndex = 0;
    
    // Show modal first
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Display images without fade on initial load
    const imageSrc = currentProjectImages[currentImageIndex];
    modalCurrentImage.src = imageSrc;
    modalCurrentImage.alt = '';
    modalCurrentImage.style.opacity = '1';
    modalCurrentImage.classList.remove('fade-out', 'fade-in');
    
    displayThumbnails();
    updateImageCounter();
    updateNavButtons();
}

// Function to display current image with smooth transition
function displayCurrentImage() {
    if (currentProjectImages.length === 0) return;
    
    const imageSrc = currentProjectImages[currentImageIndex];
    
    // Preload the image first
    const img = new Image();
    img.onload = () => {
        // Once image is loaded, do the transition
        modalCurrentImage.classList.add('fade-out');
        
        setTimeout(() => {
            modalCurrentImage.src = imageSrc;
            modalCurrentImage.alt = '';
            modalCurrentImage.classList.remove('fade-out');
            modalCurrentImage.classList.add('fade-in');
            
            // Remove fade-in class after transition completes
            setTimeout(() => {
                modalCurrentImage.classList.remove('fade-in');
            }, 300);
        }, 150);
    };
    img.src = imageSrc;
}

// Function to display thumbnails
function displayThumbnails() {
    modalThumbnails.innerHTML = '';
    
    if (currentProjectImages.length <= 1) return;
    
    currentProjectImages.forEach((imageSrc, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`;
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            displayCurrentImage();
            updateThumbnails();
            updateImageCounter();
            updateNavButtons();
        });
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = '';
        thumbnail.appendChild(img);
        modalThumbnails.appendChild(thumbnail);
    });
}

// Function to update thumbnails active state
function updateThumbnails() {
    const thumbnails = modalThumbnails.querySelectorAll('.modal-thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Function to update image counter
function updateImageCounter() {
    if (currentProjectImages.length > 1) {
        modalImageCounter.textContent = `${currentImageIndex + 1} / ${currentProjectImages.length}`;
        modalImageCounter.style.display = 'block';
    } else {
        modalImageCounter.style.display = 'none';
    }
}

// Function to update navigation buttons
function updateNavButtons() {
    if (modalPrev && modalNext) {
        modalPrev.disabled = currentImageIndex === 0;
        modalNext.disabled = currentImageIndex === currentProjectImages.length - 1;
    }
}

// Navigation functions with smooth updates
function goToPreviousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        displayCurrentImage();
        updateThumbnails();
        updateImageCounter();
        updateNavButtons();
    }
}

function goToNextImage() {
    if (currentImageIndex < currentProjectImages.length - 1) {
        currentImageIndex++;
        displayCurrentImage();
        updateThumbnails();
        updateImageCounter();
        updateNavButtons();
    }
}

// Function to close modal
function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
    currentProjectImages = [];
    currentImageIndex = 0;
}

// Event listeners
if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeProjectModal);
}

if (modalPrev) {
    modalPrev.addEventListener('click', goToPreviousImage);
}

if (modalNext) {
    modalNext.addEventListener('click', goToNextImage);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!projectModal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeProjectModal();
    } else if (e.key === 'ArrowLeft') {
        goToPreviousImage();
    } else if (e.key === 'ArrowRight') {
        goToNextImage();
    }
});

// Prevent modal content click from closing modal
if (projectModal) {
    const modalContentEl = projectModal.querySelector('.modal-content');
    if (modalContentEl) {
        modalContentEl.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// ===== LANGUAGE SYSTEM =====
let currentLang = localStorage.getItem('language') || 'fr';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    
    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.setAttribute('aria-label', translations[currentLang][key]);
        }
    });
    
    // Update active lang button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language
    setLanguage(currentLang);
    
    // Add click handlers to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
    
    // Photo item click handlers (gallery and projets section)
    const photoItems = document.querySelectorAll('.photo-item[data-project-images], .projet-item[data-project-images]');
    photoItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            openProjectModal(item);
        });
    });
    
    console.log('x_Ced_x Portfolio loaded');
});
