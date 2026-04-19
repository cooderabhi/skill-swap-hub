// --- System Models and State Management ---

// 1. Core Mock Database
const initialData = [
    { id: 101, name: "Alice", offer: "Web Development", want: "Graphic Design", category: "Tech", levelOffer: "Expert", levelWant: "Beginner", description: "I build fast React apps and want to learn how to create simple SVG logos for my personal projects.", rating: 4.8, reviews: [5, 4, 5], isOnline: true },
    { id: 102, name: "Bob", offer: "Graphic Design", want: "Web Development", category: "Design", levelOffer: "Expert", levelWant: "Beginner", description: "I design UI/UX professionally but have zero coding knowledge. Let's trade!", rating: 4.9, reviews: [5, 5, 5, 4], isOnline: false },
    { id: 103, name: "Charlie", offer: "Spanish", want: "Guitar", category: "Language", levelOffer: "Intermediate", levelWant: "Beginner", description: "Native Spanish speaker. Looking for someone to teach me guitar chords in exchange.", rating: 4.5, reviews: [4, 5], isOnline: true },
    { id: 104, name: "Diana", offer: "Guitar", want: "Spanish", category: "Music", levelOffer: "Expert", levelWant: "Intermediate", description: "Playing guitar for 10 years. Planning a trip to Spain and need to practice conversation.", rating: 5.0, reviews: [5], isOnline: false },
    { id: 105, name: "Eve", offer: "SEO Optimization", want: "Copywriting", category: "Business", levelOffer: "Expert", levelWant: "Intermediate", description: "I can rank any local business on Google. Need help writing compelling blog copy.", rating: 4.2, reviews: [4, 4, 4, 5], isOnline: true },
    { id: 106, name: "Frank", offer: "Photography", want: "Video Editing", category: "Design", levelOffer: "Intermediate", levelWant: "Intermediate", description: "I shoot portrait photography and want to learn Premiere Pro basics.", rating: 4.7, reviews: [5, 4, 5], isOnline: false },
];

// 2. Mock Global "Live" Feed Messages
const feedMessages = [
    "🚀 Welcome to Skill Swap Hub! Trade skills, build community.",
    "👋 Bob just joined and is offering Graphic Design.",
    "🤝 Alice and Bob just completed a successful skill swap!",
    "⭐ Diana recently received a 5-star review for Guitar.",
    "💡 Tip: Fill out your bio with details to find better matches faster."
];

// 3. Local State variables
let listings = [];
let bookmarkedIds = [];
let inboxMessages = [];
let currentUserProfile = null;
let hasSeenOnboarding = false;

// --- DOM Elements Navigation ---
const listingsGrid = document.getElementById('listings-grid');
const matchesGrid = document.getElementById('matches-grid');
const matchesSection = document.getElementById('matches');
const searchBar = document.getElementById('search-bar');
const categoryFilters = document.querySelectorAll('.filter-btn');
const addSkillForm = document.getElementById('add-skill-form');
const themeToggleBtn = document.getElementById('theme-toggle');

// Notification Elements
const notifBell = document.getElementById('notification-bell');
const inboxDropdown = document.getElementById('inbox-dropdown');
const inboxMessagesContainer = document.getElementById('inbox-messages');
const notifBadge = document.getElementById('notification-badge');
const liveTicker = document.getElementById('live-ticker');

// Modal Elements
const notificationModal = document.getElementById('notification-modal');
const reviewModal = document.getElementById('review-modal');
const editModal = document.getElementById('edit-profile-modal');

// --- Initialization Lifecycle ---
document.addEventListener('DOMContentLoaded', () => {
    loadSystemState();
    initTheme();
    updateDashboardStats();
    renderMatches();
    renderListings(listings);
    setupEventListeners();
    initLiveTicker();

    // Check Onboarding
    if (!hasSeenOnboarding) {
        setTimeout(startOnboarding, 500);
    }
});

// --- State Controllers ---
function loadSystemState() {
    listings = JSON.parse(localStorage.getItem('skillSwapListings')) || [...initialData];
    bookmarkedIds = JSON.parse(localStorage.getItem('skillSwapBookmarks')) || [];
    inboxMessages = JSON.parse(localStorage.getItem('skillSwapInbox')) || [];
    currentUserProfile = JSON.parse(localStorage.getItem('skillSwapCurrentUser')) || null;
    hasSeenOnboarding = JSON.parse(localStorage.getItem('skillSwapOnboarding')) || false;

    // Force current user to be online if they exist
    if(currentUserProfile) {
        const idx = listings.findIndex(l => l.id === currentUserProfile.id);
        if(idx !== -1) listings[idx].isOnline = true;
    }

    renderInbox();
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function saveCoreListings() {
    saveData('skillSwapListings', listings);
}

// --- Render Engine ---

// 1. Grid Renderer (Includes Avatars, Ratings, Descriptions, Bookmarks)
function renderListings(dataToRender) {
    listingsGrid.innerHTML = '';

    if (dataToRender.length === 0) {
        listingsGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-muted); padding: 2rem;">No skills found matching your criteria.</p>';
        return;
    }

    dataToRender.forEach(user => {
        const isBookmarked = bookmarkedIds.includes(user.id);
        const isSelf = currentUserProfile && currentUserProfile.id === user.id;
        
        // Calculate dynamic mock rating
        const avgRating = user.reviews && user.reviews.length > 0 
            ? (user.reviews.reduce((a,b) => a + b, 0) / user.reviews.length).toFixed(1) 
            : 'New';
        
        const reviewCount = user.reviews ? user.reviews.length : 0;
        
        // Star string builder
        let stars = '';
        if (avgRating !== 'New') {
            const rounded = Math.round(avgRating);
            for(let i=0; i<5; i++) stars += (i < rounded) ? '★' : '☆';
        }

        // Action Button Injection
        let actionButtons = '';
        if (isSelf) {
            actionButtons = `<button class="btn btn-secondary w-full" onclick="openEditModal(${user.id})">✏️ Edit My Listing</button>`;
        } else {
            actionButtons = `
                <button class="btn btn-primary w-full" onclick="requestSwap(${user.id}, '${user.name.replace(/'/g, "\\'")}')">Request Swap</button>
                <button class="btn btn-outline w-full" onclick="openReviewModal(${user.id}, '${user.name.replace(/'/g, "\\'")}')" style="margin-top:0.5rem; padding: 0.5rem;">⭐ Leave Review</button>
            `;
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <!-- Bookmark Overlay -->
            <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark(${user.id}, event)" aria-label="Save">
                ♥
            </button>

            <!-- Header -->
            <div class="card-header">
                <div class="avatar-container">
                    <!-- Dynamic realistic photo API from Pravatar based on user ID -->
                    <img src="https://i.pravatar.cc/150?u=${user.id}" alt="${user.name}" class="avatar-img" loading="lazy">
                    <div class="status-dot ${user.isOnline ? 'online' : 'offline'}"></div>
                </div>
                <div class="header-info">
                    <span class="user-name">${user.name}</span>
                    <div class="rating-stars">${stars} <span class="rating-count">(${reviewCount})</span></div>
                </div>
            </div>

            <!-- Body -->
            <div class="card-body">
                <h3>${user.category}</h3>
                
                <div class="skill-row">
                    <div class="skill-item">
                        <span class="skill-label">Offers</span>
                        <div class="skill-value-wrap">
                            <span class="skill-value">✨ ${user.offer}</span>
                            <span class="level-badge level-${user.levelOffer}">${user.levelOffer}</span>
                        </div>
                    </div>
                    <div class="skill-item" style="margin-top: 0.5rem;">
                        <span class="skill-label">Wants</span>
                        <div class="skill-value-wrap">
                            <span class="skill-value">🔍 ${user.want}</span>
                            <span class="level-badge level-${user.levelWant}">${user.levelWant}</span>
                        </div>
                    </div>
                </div>

                <p class="card-description">"${user.description || 'Looking to swap skills.'}"</p>
            </div>

            <!-- Footer Actions -->
            <div class="card-footer">
                ${actionButtons}
            </div>
        `;
        listingsGrid.appendChild(card);
    });
}

// 2. Intelligent Mutual Match System
function renderMatches() {
    const matches = [];
    const usedIds = new Set();
    // Exclude current user from logic loop so they can see themselves explicitly matching
    const searchTarget = listings;

    for (let i = 0; i < searchTarget.length; i++) {
        for (let j = i + 1; j < searchTarget.length; j++) {
            const A = searchTarget[i];
            const B = searchTarget[j];

            if (usedIds.has(A.id) || usedIds.has(B.id)) continue;

            const aOffersB = A.offer.toLowerCase().includes(B.want.toLowerCase()) || B.want.toLowerCase().includes(A.offer.toLowerCase());
            const bOffersA = B.offer.toLowerCase().includes(A.want.toLowerCase()) || A.want.toLowerCase().includes(B.offer.toLowerCase());

            if (aOffersB && bOffersA) {
                matches.push({ u1: A, u2: B });
                usedIds.add(A.id); usedIds.add(B.id);
            }
        }
    }

    matchesGrid.innerHTML = '';

    if (matches.length === 0) {
        matchesSection.style.display = 'none';
        return;
    }

    matchesSection.style.display = 'block';

    // Show top 4 mutual matches dynamically
    matches.slice(0, 4).forEach(match => {
        const el = document.createElement('div');
        el.className = 'match-card';
        el.innerHTML = `
            <div class="match-side">
                <h4>${match.u1.name}</h4>
                <span class="skill">${match.u1.offer}</span>
            </div>
            <div class="match-icon">🤝</div>
            <div class="match-side">
                <h4>${match.u2.name}</h4>
                <span class="skill">${match.u2.offer}</span>
            </div>
        `;
        matchesGrid.appendChild(el);
    });
}

// 3. Stats Calculator
function updateDashboardStats() {
    document.getElementById('stat-users').textContent = listings.length;
    document.getElementById('stat-listings').textContent = listings.length; 

    const wantCounts = {};
    listings.forEach(l => {
        const term = l.want.toLowerCase().trim();
        wantCounts[term] = (wantCounts[term] || 0) + 1;
    });

    let topSkill = "-";
    let max = 0;
    for (const [s, c] of Object.entries(wantCounts)) {
        if (c > max) { max = c; topSkill = s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); }
    }
    document.getElementById('stat-popular').textContent = topSkill;
}

// --- Dynamic Search & Filter Handlers ---

function filterListings() {
    const searchTerm = searchBar.value.toLowerCase();
    const activeCategoryBtn = document.querySelector('.filter-btn.active');
    const category = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'All';

    const filtered = listings.filter(user => {
        // String matches
        const matchesSearch = user.offer.toLowerCase().includes(searchTerm) || 
                              user.name.toLowerCase().includes(searchTerm) ||
                              user.want.toLowerCase().includes(searchTerm);
        
        // Category or Bookmark specific logic
        let matchesCategory = false;
        if (category === 'All') {
            matchesCategory = true;
        } else if (category === 'Saved') {
            matchesCategory = bookmarkedIds.includes(user.id);
        } else {
            matchesCategory = user.category === category;
        }
        
        return matchesSearch && matchesCategory;
    });

    renderListings(filtered);
}

window.toggleBookmark = function(id, event) {
    if (event) event.stopPropagation(); // Stop bubbling
    
    if (bookmarkedIds.includes(id)) {
        bookmarkedIds = bookmarkedIds.filter(bid => bid !== id);
    } else {
        bookmarkedIds.push(id);
    }
    
    saveData('skillSwapBookmarks', bookmarkedIds);
    filterListings(); // Re-render to reflect heart classes instantly
}

// --- Notification Inbox System ---

function renderInbox() {
    notifBadge.textContent = inboxMessages.length;
    if(inboxMessages.length > 0) {
        notifBadge.classList.remove('hidden');
        inboxMessagesContainer.innerHTML = inboxMessages.map(m => `<div class="inbox-message">${m}</div>`).join('');
    } else {
        notifBadge.classList.add('hidden');
        inboxMessagesContainer.innerHTML = '<p class="empty-inbox">No new messages.</p>';
    }
}

function pushInboxMessage(htmlMsg) {
    inboxMessages.unshift(htmlMsg);
    // Keep max 10
    if(inboxMessages.length > 10) inboxMessages.pop();
    saveData('skillSwapInbox', inboxMessages);
    renderInbox();
    
    // Animation bump
    notifBadge.classList.remove('hidden');
    notifBadge.style.animation = 'none';
    setTimeout(() => notifBadge.style.animation = '', 10);
}

// Interactions for "Request Swap"
window.requestSwap = function(id, name) {
    const text = document.getElementById('modal-text');
    text.innerHTML = `Your swap request to <strong>${name}</strong> has been deployed!<br><br><em style="font-size:0.8rem">(Platform Notification System engaged)</em>`;
    notificationModal.classList.remove('hidden');
    setTimeout(() => notificationModal.classList.add('active'), 10);

    // Simulate async reply system - wait 3-5 seconds and pretend the user accepted
    setTimeout(() => {
        pushInboxMessage(`✅ <b>${name}</b> has accepted your swap request for their skill!`);
    }, Math.floor(Math.random() * 3000) + 3000);
}

// --- Current User Profile Management & Forms ---

addSkillForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(currentUserProfile) {
        alert("You already have an active listing. Please use the Edit feature on your profile card.");
        return;
    }

    const name = document.getElementById('user-name').value;
    const offer = document.getElementById('skill-offer').value;
    const want = document.getElementById('skill-want').value;
    const category = document.getElementById('skill-category').value;
    const levelOffer = document.getElementById('offer-level').value;
    const levelWant = document.getElementById('want-level').value;
    const description = document.getElementById('skill-desc').value;

    const newLocalId = Date.now();
    const newUser = {
        id: newLocalId,
        name, offer, want, category, levelOffer, levelWant, description,
        rating: 0, reviews: [], isOnline: true // Defaults
    };

    listings.unshift(newUser);
    currentUserProfile = newUser;
    
    saveCoreListings();
    saveData('skillSwapCurrentUser', currentUserProfile);

    // Update form UI state to prevent spam
    addSkillForm.reset();
    document.getElementById('listing-status').classList.remove('hidden');

    pushInboxMessage(`Welcome to the hub, ${name}! Your profile is live.`);

    updateDashboardStats();
    renderMatches();
    filterListings();
    document.querySelector('.filter-btn[data-category="All"]').click();
});

// Edit Profile Modal
let editingId = null;
window.openEditModal = function(id) {
    editingId = id;
    const user = listings.find(l => l.id === id);
    if(!user) return;
    
    document.getElementById('edit-desc').value = user.description || '';
    editModal.classList.remove('hidden');
    setTimeout(() => editModal.classList.add('active'), 10);
}

document.getElementById('save-edit-btn').addEventListener('click', () => {
    const userIdx = listings.findIndex(l => l.id === editingId);
    if(userIdx !== -1) {
        listings[userIdx].description = document.getElementById('edit-desc').value;
        saveCoreListings();
        filterListings();
    }
    closeModal(editModal);
});

document.getElementById('delete-profile-btn').addEventListener('click', () => {
    if(confirm("Are you sure you want to permanently withdraw your listing from the hub?")) {
        listings = listings.filter(l => l.id !== editingId);
        currentUserProfile = null;
        saveCoreListings();
        localStorage.removeItem('skillSwapCurrentUser');
        document.getElementById('listing-status').classList.add('hidden');
        filterListings();
        updateDashboardStats();
        renderMatches();
        closeModal(editModal);
        pushInboxMessage("Your profile has been successfully deleted.");
    }
});

// --- Review/Rating System Simulation ---

let reviewingTargetId = null;
window.openReviewModal = function(id, name) {
    reviewingTargetId = id;
    document.getElementById('review-target-name').textContent = name;
    reviewModal.classList.remove('hidden');
    setTimeout(() => reviewModal.classList.add('active'), 10);
}

document.getElementById('submit-review-btn').addEventListener('click', () => {
    const ratingVal = parseInt(document.getElementById('review-rating').value);
    
    const userIdx = listings.findIndex(l => l.id === reviewingTargetId);
    if(userIdx !== -1) {
        if(!listings[userIdx].reviews) listings[userIdx].reviews = [];
        listings[userIdx].reviews.push(ratingVal);
        saveCoreListings();
        filterListings();
    }
    closeModal(reviewModal);
    pushInboxMessage(`You successfully reviewed ${listings[userIdx].name}.`);
});

// --- UI Utility & Animations ---

function closeModal(modalEl) {
    modalEl.classList.remove('active');
    setTimeout(() => modalEl.classList.add('hidden'), 300);
}

function initLiveTicker() {
    let index = 0;
    setInterval(() => {
        index = (index + 1) % feedMessages.length;
        liveTicker.innerHTML = `<span>${feedMessages[index]}</span>`;
    }, 20000); // changes text entirely after CSS animation loop completes
}

// Global Event Listeners Setup
function setupEventListeners() {
    searchBar.addEventListener('input', () => filterListings());

    categoryFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryFilters.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterListings();
        });
    });

    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Notification Dropdown Toggle
    notifBell.addEventListener('click', (e) => {
        e.stopPropagation();
        inboxDropdown.classList.toggle('hidden');
    });

    // Close Dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if(!inboxDropdown.classList.contains('hidden') && !e.target.closest('.notification-wrapper')) {
            inboxDropdown.classList.add('hidden');
        }
    });

    // Close standard modals
    document.getElementById('close-modal').addEventListener('click', () => closeModal(notificationModal));
    document.getElementById('cancel-review-btn').addEventListener('click', () => closeModal(reviewModal));
    document.getElementById('cancel-edit-btn').addEventListener('click', () => closeModal(editModal));
    
    // Quick escape closing
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            closeModal(notificationModal);
            closeModal(reviewModal);
            closeModal(editModal);
        }
    });
}

function initTheme() {
    const th = localStorage.getItem('skillSwapTheme');
    document.documentElement.setAttribute('data-theme', th === 'dark' ? 'dark' : 'light');
    themeToggleBtn.textContent = th === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggleBtn.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('skillSwapTheme', isDark ? 'light' : 'dark');
}

// --- Onboarding First-Time Experience Simulation ---
function startOnboarding() {
    const overlay = document.getElementById('onboarding-overlay');
    const spotlight = document.getElementById('onboarding-spotlight');
    const tooltip = document.getElementById('onboarding-tooltip');
    const btnNext = document.getElementById('ob-next');
    const title = document.getElementById('ob-title');
    const text = document.getElementById('ob-text');
    const counter = document.getElementById('ob-step-counter');

    const steps = [
        { elId: 'explore', t: "Explore", p: "Here is your main feed of users offering skills." },
        { elId: 'category-filters', t: "Filter & Save", p: "Use these filters to find specific categories, or view the listings you have locally bookmarked." },
        { elId: 'nav-add-btn', t: "Create Listing", p: "Ready to trade? Click here to add your own listing to the hub." }
    ];
    let currentStep = 0;

    overlay.classList.remove('hidden');

    function renderStep() {
        if (currentStep >= steps.length) {
            overlay.classList.add('hidden');
            hasSeenOnboarding = true;
            saveData('skillSwapOnboarding', true);
            return;
        }

        const step = steps[currentStep];
        const target = document.getElementById(step.elId);
        
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Allow scroll to settle, then draw spotlight
            setTimeout(() => {
                const rect = target.getBoundingClientRect();
                spotlight.style.top = `${rect.top - 10}px`;
                spotlight.style.left = `${rect.left - 10}px`;
                spotlight.style.width = `${rect.width + 20}px`;
                spotlight.style.height = `${rect.height + 20}px`;

                // Try placing tooltip near it safely
                tooltip.style.top = `${rect.bottom + 20}px`;
                tooltip.style.left = `${Math.max(20, rect.left)}px`;
                
                title.textContent = step.t;
                text.textContent = step.p;
                counter.textContent = `${currentStep + 1}/${steps.length}`;
            }, 500); // 500ms for smooth scroll to finish mostly
        }
    }

    btnNext.addEventListener('click', () => { currentStep++; renderStep(); });
    renderStep();
}
