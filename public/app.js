/**
 * MathVerse - External Research Portal
 * Main Application JavaScript
 * Handles search transitions, iframe management, and UI interactions
 */

// =============================================
// DOM Elements
// =============================================
const elements = {
    // Main sections
    appContainer: document.getElementById('appContainer'),
    mainContent: document.getElementById('mainContent'),
    searchSection: document.getElementById('searchSection'),
    viewerSection: document.getElementById('viewerSection'),
    header: document.getElementById('header'),
    
    // Search elements
    searchContainer: document.getElementById('searchContainer'),
    urlInput: document.getElementById('urlInput'),
    searchButton: document.getElementById('searchButton'),
    quickLinks: document.getElementById('quickLinks'),
    featuresGrid: document.getElementById('featuresGrid'),
    
    // Viewer elements
    viewerHeader: document.getElementById('viewerHeader'),
    iframeWindow: document.getElementById('iframeWindow'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    urlDisplay: document.getElementById('currentUrl'),
    
    // Viewer controls
    backBtn: document.getElementById('backBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    closeBtn: document.getElementById('closeBtn'),
    
    // Toast container
    toastContainer: document.getElementById('toastContainer')
};

// =============================================
// State Management
// =============================================
const state = {
    isViewerActive: false,
    isFullscreen: false,
    isLoading: false,
    currentUrl: '',
    history: [],
    historyIndex: -1
};

// =============================================
// URL Processing Utilities
// =============================================
const urlUtils = {
    /**
     * Process user input into a valid URL
     * @param {string} input - User input (URL or search query)
     * @returns {string} - Processed URL
     */
    processInput(input) {
        const trimmed = input.trim();
        
        if (!trimmed) return null;
        
        // Check if it's a URL (has dots and looks like a domain)
        if (this.isLikelyUrl(trimmed)) {
            return this.ensureProtocol(trimmed);
        }
        
        // Otherwise, treat as a search query for math-related content
        return `https://www.google.com/search?q=${encodeURIComponent(trimmed + ' math calculus')}`;
    },
    
    /**
     * Check if input looks like a URL
     * @param {string} input - User input
     * @returns {boolean}
     */
    isLikelyUrl(input) {
        // Contains a dot and no spaces, or starts with http
        return (input.includes('.') && !input.includes(' ')) || 
               input.startsWith('http://') || 
               input.startsWith('https://');
    },
    
    /**
     * Ensure URL has a protocol
     * @param {string} url - URL string
     * @returns {string}
     */
    ensureProtocol(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return 'https://' + url;
        }
        return url;
    },
    
    /**
     * Encode URL for proxy
     * @param {string} url - URL to encode
     * @returns {string}
     */
    encodeForProxy(url) {
        return __uv$config.prefix + __uv$config.encodeUrl(url);
    },
    
    /**
     * Get display-friendly URL
     * @param {string} url - Full URL
     * @returns {string}
     */
    getDisplayUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.hostname + parsed.pathname.slice(0, 30) + (parsed.pathname.length > 30 ? '...' : '');
        } catch {
            return url.slice(0, 50) + (url.length > 50 ? '...' : '');
        }
    }
};

// =============================================
// Animation Utilities
// =============================================
const animations = {
    /**
     * Fade out element
     * @param {HTMLElement} element
     * @param {number} duration
     */
    async fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        await this.wait(duration);
    },
    
    /**
     * Fade in element
     * @param {HTMLElement} element
     * @param {number} duration
     */
    async fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        // Force reflow
        element.offsetHeight;
        
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        await this.wait(duration);
    },
    
    /**
     * Wait for specified duration
     * @param {number} ms
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// =============================================
// Toast Notifications
// =============================================
const toast = {
    /**
     * Show a toast notification
     * @param {string} message
     * @param {string} type - 'success' | 'error' | 'info'
     * @param {number} duration
     */
    show(message, type = 'info', duration = 3000) {
        const toastEl = document.createElement('div');
        toastEl.className = `toast ${type}`;
        
        const icons = {
            success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };
        
        toastEl.innerHTML = `
            ${icons[type] || icons.info}
            <span class="toast-message">${message}</span>
        `;
        
        elements.toastContainer.appendChild(toastEl);
        
        setTimeout(() => {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateX(100%)';
            setTimeout(() => toastEl.remove(), 300);
        }, duration);
    }
};

// =============================================
// Viewer Controller
// =============================================
const viewer = {
    /**
     * Open the viewer with a URL
     * @param {string} url
     */
    async open(url) {
        if (!url) {
            toast.show('Please enter a URL or search term', 'error');
            return;
        }
        
        state.currentUrl = url;
        state.isViewerActive = true;
        
        // Add to history
        state.history.push(url);
        state.historyIndex = state.history.length - 1;
        
        // Update URL display
        elements.urlDisplay.textContent = urlUtils.getDisplayUrl(url);
        
        // Show loading
        this.showLoading();
        
        // Animate transition
        await this.transitionToViewer();
        
        // Load content
        this.loadContent(url);
    },
    
    /**
     * Transition from search to viewer
     */
    async transitionToViewer() {
        // Hide header with animation
        elements.header.classList.add('hidden');
        
        // Fade out main content
        await animations.fadeOut(elements.mainContent, 200);
        elements.mainContent.style.display = 'none';
        
        // Show and animate viewer
        elements.viewerSection.classList.add('active');
        await animations.wait(50);
    },
    
    /**
     * Close the viewer and return to search
     */
    async close() {
        state.isViewerActive = false;
        state.isFullscreen = false;
        
        // Reset fullscreen
        elements.viewerSection.classList.remove('fullscreen');
        
        // Hide viewer
        elements.viewerSection.classList.remove('active');
        
        // Show header
        elements.header.classList.remove('hidden');
        
        // Show and animate main content
        elements.mainContent.style.display = 'block';
        await animations.fadeIn(elements.mainContent, 300);
        
        // Clear iframe
        elements.iframeWindow.src = 'about:blank';
        
        // Reset input focus
        elements.urlInput.focus();
    },
    
    /**
     * Load content into iframe
     * @param {string} url
     */
    loadContent(url) {
        const proxyUrl = urlUtils.encodeForProxy(url);
        
        elements.iframeWindow.onload = () => {
            this.hideLoading();
            toast.show('Resource loaded successfully', 'success');
        };
        
        elements.iframeWindow.onerror = () => {
            this.hideLoading();
            toast.show('Failed to load resource', 'error');
        };
        
        elements.iframeWindow.src = proxyUrl;
    },
    
    /**
     * Refresh current content
     */
    refresh() {
        if (state.currentUrl) {
            this.showLoading();
            this.loadContent(state.currentUrl);
        }
    },
    
    /**
     * Go back in history
     */
    goBack() {
        if (state.historyIndex > 0) {
            state.historyIndex--;
            const url = state.history[state.historyIndex];
            state.currentUrl = url;
            elements.urlDisplay.textContent = urlUtils.getDisplayUrl(url);
            this.showLoading();
            this.loadContent(url);
        } else {
            this.close();
        }
    },
    
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        state.isFullscreen = !state.isFullscreen;
        elements.viewerSection.classList.toggle('fullscreen', state.isFullscreen);
        
        // Update button icon
        const icon = elements.fullscreenBtn.querySelector('svg');
        if (state.isFullscreen) {
            icon.innerHTML = `
                <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
            `;
        } else {
            icon.innerHTML = `
                <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
            `;
        }
    },
    
    /**
     * Show loading overlay
     */
    showLoading() {
        state.isLoading = true;
        elements.loadingOverlay.classList.add('active');
    },
    
    /**
     * Hide loading overlay
     */
    hideLoading() {
        state.isLoading = false;
        elements.loadingOverlay.classList.remove('active');
    }
};

// =============================================
// Event Handlers
// =============================================

// Search form submission
function handleSearch(event) {
    if (event) event.preventDefault();
    
    const input = elements.urlInput.value;
    const url = urlUtils.processInput(input);
    
    if (url) {
        viewer.open(url);
    }
}

// Keyboard navigation
function handleKeydown(event) {
    // Enter to search
    if (event.key === 'Enter' && document.activeElement === elements.urlInput) {
        handleSearch();
    }
    
    // Escape to close viewer
    if (event.key === 'Escape' && state.isViewerActive) {
        viewer.close();
    }
    
    // Alt+Left to go back
    if (event.altKey && event.key === 'ArrowLeft' && state.isViewerActive) {
        viewer.goBack();
    }
    
    // F11 or Cmd/Ctrl+Shift+F for fullscreen
    if ((event.key === 'F11' || (event.key === 'f' && (event.metaKey || event.ctrlKey) && event.shiftKey)) && state.isViewerActive) {
        event.preventDefault();
        viewer.toggleFullscreen();
    }
}

// Quick link click
function handleQuickLink(event) {
    const button = event.target.closest('.quick-link');
    if (button) {
        const url = button.dataset.url;
        if (url) {
            elements.urlInput.value = url;
            viewer.open(url);
        }
    }
}

// =============================================
// Initialization
// =============================================

function init() {
    // Search events
    elements.searchButton.addEventListener('click', handleSearch);
    elements.urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Quick links
    elements.quickLinks.addEventListener('click', handleQuickLink);
    
    // Viewer controls
    elements.backBtn.addEventListener('click', () => viewer.goBack());
    elements.refreshBtn.addEventListener('click', () => viewer.refresh());
    elements.fullscreenBtn.addEventListener('click', () => viewer.toggleFullscreen());
    elements.closeBtn.addEventListener('click', () => viewer.close());
    
    // Global keyboard events
    document.addEventListener('keydown', handleKeydown);
    
    // Focus input on load
    elements.urlInput.focus();
    
    // Handle iframe load timeout
    let loadTimeout;
    elements.iframeWindow.addEventListener('loadstart', () => {
        loadTimeout = setTimeout(() => {
            if (state.isLoading) {
                viewer.hideLoading();
                toast.show('Loading is taking longer than expected', 'info');
            }
        }, 15000);
    });
    
    elements.iframeWindow.addEventListener('load', () => {
        clearTimeout(loadTimeout);
    });
    
    console.log('MathVerse Research Portal initialized');
}

// Start application
document.addEventListener('DOMContentLoaded', init);
