// Global variable to store experience data
let experienceData = {
    "experiences": []
};

// Default fallback data if external file fails to load
const defaultExperienceData = {
    "experiences": [
        {
            "id": 1,
            "category": "Competition Experience",
            "icon": "🏆",
            "title": "National Programming Contest",
            "description": "Achieved 1st place in National Programming Competition 2024. Solved complex algorithmic problems under time pressure, demonstrating strong problem-solving skills and programming proficiency.",
            "tags": ["C++", "Algorithms", "Data Structures", "Problem Solving"],
            "year": "2024",
            "media": [
                {
                    "type": "video",
                    "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    "title": "Competition Highlights"
                },
                {
                    "type": "image",
                    "url": "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Certificate",
                    "title": "Award Certificate"
                },
                {
                    "type": "github",
                    "url": "https://github.com/username/contest-solutions",
                    "title": "Contest Solutions Repository"
                }
            ]
        }
    ]
};

// Function to load external JSON file
async function loadExperienceData(jsonFilePath = 'content.json') {
    try {
        console.log('🔄 Loading experience data from:', jsonFilePath);
        const response = await fetch(jsonFilePath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate JSON structure
        if (!data.experiences || !Array.isArray(data.experiences)) {
            throw new Error('Invalid JSON structure. Expected {experiences: [...]}');
        }
        
        // Convert single media objects to arrays for backward compatibility
        data.experiences.forEach(exp => {
            if (exp.media && !Array.isArray(exp.media)) {
                exp.media = [exp.media];
            }
        });
        
        experienceData = data;
        console.log('✅ Experience data loaded successfully!', experienceData);
        return true;
        
    } catch (error) {
        console.warn('⚠️ Failed to load external JSON file:', error.message);
        console.log('🔄 Using default data instead...');
        experienceData = defaultExperienceData;
        return false;
    }
}

// Function to create media content based on type
function createMediaContent(media, index, totalMedia) {
    if (!media) return '';
    
    const mediaNavigation = totalMedia > 1 ? `
        <div class="media-navigation">
            <span class="media-counter">${index + 1} / ${totalMedia}</span>
            ${index > 0 ? '<button class="media-nav-btn prev-media" data-direction="prev">◀</button>' : ''}
            ${index < totalMedia - 1 ? '<button class="media-nav-btn next-media" data-direction="next">▶</button>' : ''}
        </div>
    ` : '';
    
    let content = '';
    
    switch (media.type) {
        case 'video':
            content = `
                <div class="card-media">
                    <video controls>
                        <source src="${media.url}" type="video/mp4">
                        Your browser does not support HTML video.
                    </video>
                </div>
            `;
            break;
        case 'image':
            content = `
                <div class="card-media">
                    <img src="${media.url}" alt="${media.title}">
                </div>
            `;
            break;
        case 'github':
            content = `
                <div class="card-media github-link">
                    <div class="github-content">
                        <div class="github-icon">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </div>
                        <h3>View on GitHub</h3>
                        <p>${media.title}</p>
                        <a href="${media.url}" target="_blank" class="github-button">
                            Open Repository
                        </a>
                    </div>
                </div>
            `;
            break;
        default:
            content = '<div class="card-media">Unsupported media type</div>';
    }
    
    return `
        <div class="media-container" data-media-index="${index}">
            ${content}
            <div class="media-controls">
                <button class="flip-button back-button">⬅️ Back to Info</button>
                ${mediaNavigation}
            </div>
        </div>
    `;
}

// Function to create experience card HTML
function createExperienceCard(experience) {
    const tagsHTML = experience.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    const hasMedia = experience.media && experience.media.length > 0;
    
    let mediaContainers = '';
    if (hasMedia) {
        mediaContainers = experience.media.map((media, index) => 
            createMediaContent(media, index, experience.media.length)
        ).join('');
    }
    
    return `
        <div class="experience-card-container fade-in" data-id="${experience.id}">
            <div class="experience-card ${hasMedia ? 'has-media' : ''}" data-current-media="0">
                <div class="card-front">
                    <div class="card-icon">${experience.icon}</div>
                    <h3 class="card-title">${experience.category}</h3>
                    <h4 class="card-subtitle">${experience.title}</h4>
                    <p class="card-description">${experience.description}</p>
                    <div class="card-tags">${tagsHTML}</div>
                    <div class="card-year">${experience.year}</div>
                    ${hasMedia ? '<button class="flip-button">🎥 View Media</button>' : ''}
                </div>
                ${hasMedia ? `
                    <div class="card-back">
                        ${mediaContainers}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Function to render experiences
function renderExperiences() {
    const experienceGrid = document.getElementById('experienceGrid');
    const experiencesHTML = experienceData.experiences.map(createExperienceCard).join('');
    experienceGrid.innerHTML = experiencesHTML;
    
    // Re-observe fade-in elements after rendering
    setTimeout(() => {
        document.querySelectorAll('.experience-card-container').forEach(el => {
            observer.observe(el);
        });
        
        // Add flip card functionality
        addFlipCardFunctionality();
        
        // Add media navigation functionality
        addMediaNavigationFunctionality();
        
        // Re-add hover effects
        addCardHoverEffects();
    }, 100);
}

// Function to add flip card functionality
function addFlipCardFunctionality() {
    document.querySelectorAll('.flip-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.experience-card');
            
            if (button.classList.contains('back-button')) {
                card.classList.remove('flipped');
                // Reset to first media when going back
                card.setAttribute('data-current-media', '0');
                showCurrentMedia(card);
            } else {
                card.classList.add('flipped');
                showCurrentMedia(card);
            }
        });
    });
}

// Function to add media navigation functionality
function addMediaNavigationFunctionality() {
    document.querySelectorAll('.media-nav-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.experience-card');
            const direction = button.getAttribute('data-direction');
            const currentMedia = parseInt(card.getAttribute('data-current-media')) || 0;
            const mediaContainers = card.querySelectorAll('.media-container');
            const totalMedia = mediaContainers.length;
            
            let newIndex = currentMedia;
            if (direction === 'next' && currentMedia < totalMedia - 1) {
                newIndex = currentMedia + 1;
            } else if (direction === 'prev' && currentMedia > 0) {
                newIndex = currentMedia - 1;
            }
            
            card.setAttribute('data-current-media', newIndex);
            showCurrentMedia(card);
        });
    });
}

// Function to show current media
function showCurrentMedia(card) {
    const currentMediaIndex = parseInt(card.getAttribute('data-current-media')) || 0;
    const mediaContainers = card.querySelectorAll('.media-container');
    
    mediaContainers.forEach((container, index) => {
        if (index === currentMediaIndex) {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Function to add hover effects to cards
function addCardHoverEffects() {
    document.querySelectorAll('.experience-card-container').forEach(container => {
        const card = container.querySelector('.experience-card');
        
        container.addEventListener('mouseenter', () => {
            if (!card.classList.contains('flipped')) {
                container.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        container.addEventListener('mouseleave', () => {
            if (!card.classList.contains('flipped')) {
                container.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Function to add new experience (you can call this from console)
function addExperience(newExperience) {
    experienceData.experiences.push({
        id: experienceData.experiences.length + 1,
        ...newExperience
    });
    renderExperiences();
}

// Function to update experience by ID
function updateExperience(id, updatedData) {
    const index = experienceData.experiences.findIndex(exp => exp.id === id);
    if (index !== -1) {
        experienceData.experiences[index] = { ...experienceData.experiences[index], ...updatedData };
        renderExperiences();
    }
}

// Function to remove experience by ID
function removeExperience(id) {
    experienceData.experiences = experienceData.experiences.filter(exp => exp.id !== id);
    renderExperiences();
}

// Function to export current data as JSON
function exportExperienceData() {
    const dataStr = JSON.stringify(experienceData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'experience-data.json';
    link.click();
}

// Function to import JSON data
function importExperienceData(jsonData) {
    try {
        const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        if (parsedData.experiences && Array.isArray(parsedData.experiences)) {
            experienceData.experiences = parsedData.experiences;
            renderExperiences();
            console.log('Experience data imported successfully!');
        } else {
            console.error('Invalid JSON format. Expected {experiences: [...]}');
        }
    } catch (error) {
        console.error('Error importing data:', error);
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
});

// Dynamic background animation
function createFloatingElement() {
    const shapes = document.querySelector('.floating-shapes');
    const shape = document.createElement('div');
    shape.className = 'shape';
    
    const size = Math.random() * 100 + 20;
    shape.style.width = size + 'px';
    shape.style.height = size + 'px';
    shape.style.left = Math.random() * 100 + '%';
    shape.style.top = '100%';
    shape.style.animationDuration = (Math.random() * 20 + 10) + 's';
    shape.style.animationDelay = Math.random() * 5 + 's';
    
    shapes.appendChild(shape);
    
    setTimeout(() => {
        shape.remove();
    }, 25000);
}

// Create new floating elements periodically
setInterval(createFloatingElement, 3000);

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize everything when page loads
window.addEventListener('load', async () => {
    // Load experience data from external JSON file
    await loadExperienceData();
    
    // Render experiences from loaded data
    renderExperiences();
    
    // Initialize typing effect
    const heroTitle = document.querySelector('.hero h1');
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 50);
});