// Use performance optimization techniques
document.addEventListener('DOMContentLoaded', function() {
    // Critical operations first for faster initial render
    // Fetch cryptocurrency prices from CoinGecko API
    function fetchCryptoPrices() {
        // Define the cryptocurrencies to fetch
        const cryptos = {
            'bitcoin': {
                priceElement: 'bitcoinPrice',
                changeElement: 'bitcoinChange'
            },
            'ethereum': {
                priceElement: 'ethereumPrice',
                changeElement: 'ethereumChange'
            },
            'tether': {
                priceElement: 'usdtPrice',
                changeElement: 'usdtChange'
            },
            'tron': {
                priceElement: 'tronPrice',
                changeElement: 'tronChange'
            },
            'binancecoin': {
                priceElement: 'bnbPrice',
                changeElement: 'bnbChange'
            }
        };
        
        // Create the API URL with all cryptocurrencies
        const cryptoIds = Object.keys(cryptos).join(',');
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`;
        
        // Show loading indicator
        const updateTime = document.createElement('div');
        updateTime.className = 'update-time';
        updateTime.textContent = 'Updating prices...';
        document.querySelector('.crypto-ticker').appendChild(updateTime);
        
        // Fetch data from API
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update each cryptocurrency's price and change
                for (const [crypto, elements] of Object.entries(cryptos)) {
                    const priceElement = document.getElementById(elements.priceElement);
                    const changeElement = document.getElementById(elements.changeElement);
                    
                    if (priceElement && data[crypto] && data[crypto].usd) {
                        const price = data[crypto].usd;
                        // Format price based on value (show more decimals for lower-value coins)
                        if (price < 1) {
                            priceElement.textContent = '$' + price.toFixed(4);
                        } else if (price < 10) {
                            priceElement.textContent = '$' + price.toFixed(2);
                        } else {
                            priceElement.textContent = '$' + price.toLocaleString(undefined, {maximumFractionDigits: 2});
                        }
                    }
                    
                    if (changeElement && data[crypto] && data[crypto].usd_24h_change) {
                        const change = data[crypto].usd_24h_change.toFixed(2);
                        changeElement.textContent = change + '%';
                        
                        // Add color based on price change
                        if (change > 0) {
                            changeElement.classList.add('positive');
                            changeElement.classList.remove('negative');
                        } else if (change < 0) {
                            changeElement.classList.add('negative');
                            changeElement.classList.remove('positive');
                        } else {
                            changeElement.classList.remove('positive');
                            changeElement.classList.remove('negative');
                        }
                    }
                }
                
                // Update the last updated time
                const now = new Date();
                const formattedTime = now.toLocaleTimeString();
                updateTime.textContent = `Last updated: ${formattedTime}`;
                updateTime.classList.add('updated');
                
                // Remove the update notification after 5 seconds
                setTimeout(() => {
                    updateTime.remove();
                }, 5000);
            })
            .catch(error => {
                console.error('Error fetching cryptocurrency prices:', error);
                // Show error message
                const updateTime = document.querySelector('.update-time');
                if (updateTime) {
                    updateTime.textContent = 'Error updating prices';
                    updateTime.classList.add('error');
                    
                    // Remove the error message after 5 seconds
                    setTimeout(() => {
                        updateTime.remove();
                    }, 5000);
                }
            });
    }
    
    // Fetch cryptocurrency prices initially with a slight delay to prioritize UI rendering
    setTimeout(fetchCryptoPrices, 300);
    
    // Then update every minute
    const priceUpdateInterval = 60000; // 1 minute in milliseconds
    setInterval(fetchCryptoPrices, priceUpdateInterval);
    
    // Use requestIdleCallback for non-critical operations if available
    const runWhenIdle = (callback) => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(callback);
        } else {
            setTimeout(callback, 200);
        }
    };
    
    // Real-time date and time display
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const formattedDateTime = now.toLocaleDateString('en-US', options);
        
        const dateTimeElement = document.getElementById('currentDateTime');
        if (dateTimeElement) {
            dateTimeElement.textContent = formattedDateTime;
        }
    }
    
    // Update time immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Dark mode functionality
    function initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const moonIcon = darkModeToggle.querySelector('i');
        const header = document.querySelector('header');
        
        // Function to update header styles based on dark mode state
        function updateHeaderStyles(isDarkMode) {
            if (window.scrollY > 10) {
                header.style.boxShadow = isDarkMode ? 
                    '0 4px 15px rgba(0, 0, 0, 0.3)' : 
                    '0 4px 15px rgba(0, 0, 0, 0.1)';
                header.style.background = isDarkMode ? 
                    'rgba(30, 30, 30, 0.98)' : 
                    'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.boxShadow = isDarkMode ? 
                    '0 2px 10px rgba(0, 0, 0, 0.3)' : 
                    '0 2px 10px rgba(0, 0, 0, 0.1)';
                header.style.background = isDarkMode ? 
                    '#1e1e1e' : 
                    '#ffffff';
            }
        }
        
        // Check for saved user preference
        const savedDarkMode = localStorage.getItem('darkMode');
        
        // Apply dark mode if previously saved
        if (savedDarkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            moonIcon.classList.remove('fa-moon');
            moonIcon.classList.add('fa-sun');
            updateHeaderStyles(true);
        }
        
        // Toggle dark mode when button is clicked
        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            if (isDarkMode) {
                // Switch to light mode
                document.body.classList.remove('dark-mode');
                moonIcon.classList.remove('fa-sun');
                moonIcon.classList.add('fa-moon');
                localStorage.setItem('darkMode', 'disabled');
                updateHeaderStyles(false);
            } else {
                // Switch to dark mode
                document.body.classList.add('dark-mode');
                moonIcon.classList.remove('fa-moon');
                moonIcon.classList.add('fa-sun');
                localStorage.setItem('darkMode', 'enabled');
                updateHeaderStyles(true);
            }
        });
    }
    
    // News slider functionality
    let currentNewsIndex = 0;
    const newsItems = document.querySelectorAll('.news-item');
    const totalNews = newsItems.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentIndexDisplay = document.getElementById('currentNewsIndex');
    const totalNewsDisplay = document.getElementById('totalNewsCount');
    
    // Initialize news slider
    function initNewsSlider() {
        if (totalNewsDisplay) totalNewsDisplay.textContent = totalNews;
        updateNewsDisplay();
        updateNavigationButtons();
    }
    
    // Update which news item is visible
    function updateNewsDisplay() {
        newsItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentNewsIndex) {
                item.classList.add('active');
            }
        });
        
        if (currentIndexDisplay) {
            currentIndexDisplay.textContent = currentNewsIndex + 1;
        }
    }
    
    // Update navigation button states
    function updateNavigationButtons() {
        if (prevBtn) {
            prevBtn.disabled = currentNewsIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentNewsIndex === totalNews - 1;
        }
    }
    
    // Event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentNewsIndex > 0) {
                currentNewsIndex--;
                updateNewsDisplay();
                updateNavigationButtons();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentNewsIndex < totalNews - 1) {
                currentNewsIndex++;
                updateNewsDisplay();
                updateNavigationButtons();
            }
        });
    }
    
    // Initialize critical UI components immediately
    updateDateTime();
    
    // Initialize non-critical components when browser is idle
    runWhenIdle(() => {
        initNewsSlider();
        initDarkMode();
    });
    
    // Modal Functionality
    const privacyBtn = document.getElementById('privacyBtn');
    const termsBtn = document.getElementById('termsBtn');
    const privacyModal = document.getElementById('privacyModal');
    const termsModal = document.getElementById('termsModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal-container');

    if (privacyBtn && privacyModal) {
        privacyBtn.addEventListener('click', function() {
            privacyModal.classList.add('active');
        });
    }

    if (termsBtn && termsModal) {
        termsBtn.addEventListener('click', function() {
            termsModal.classList.add('active');
        });
    }
    
    // Close modal when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside the content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Function to add new news items
    window.addNewsItem = function(title, content, date = null) {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;
        
        // Create date string (use provided date or current date)
        const newsDate = date || new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create news item element
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.setAttribute('data-index', totalNews);
        
        // Add animation class for new items
        newsItem.classList.add('news-item-new');
        
        // Create HTML structure
        newsItem.innerHTML = `
            <div class="news-date">${newsDate}</div>
            <h3>${title}</h3>
            <p>${content}</p>
        `;
        
        // Add to the news container
        newsContainer.appendChild(newsItem);
        
        // Update total count and navigation
        const newTotal = document.querySelectorAll('.news-item').length;
        if (totalNewsDisplay) totalNewsDisplay.textContent = newTotal;
        
        // Go to the new item
        currentNewsIndex = newTotal - 1;
        updateNewsDisplay();
        updateNavigationButtons();
        
        // Remove animation class after animation completes
        setTimeout(() => {
            newsItem.classList.remove('news-item-new');
        }, 1000);
        
        return newsItem;
    };
    // Sticky header effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (window.scrollY > 10) {
            header.style.boxShadow = isDarkMode ? 
                '0 4px 15px rgba(0, 0, 0, 0.3)' : 
                '0 4px 15px rgba(0, 0, 0, 0.1)';
            header.style.background = isDarkMode ? 
                'rgba(30, 30, 30, 0.98)' : 
                'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = isDarkMode ? 
                '0 2px 10px rgba(0, 0, 0, 0.3)' : 
                '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.background = isDarkMode ? 
                '#1e1e1e' : 
                '#ffffff';
        }
    });
    
    // Add subtle animation to the header text
    const logo = document.querySelector('.logo h1');
    if (logo) {
        logo.style.transition = 'color 0.3s ease';
        
        logo.addEventListener('mouseover', function() {
            this.style.color = '#27ae60';
        });
        
        logo.addEventListener('mouseout', function() {
            this.style.color = '#2ecc71';
        });
    }
    
    // Owner Modal Functionality
    const ownerBtn = document.getElementById('ownerBtn');
    const ownerModal = document.getElementById('ownerModal');
    
    // Open owner modal when button is clicked
    if (ownerBtn) {
        ownerBtn.addEventListener('click', function() {
            ownerModal.classList.add('active');
        });
    }
    
    // Contact Form Functionality
    const contactBtn = document.getElementById('contactBtn');
    const contactFormContainer = document.getElementById('contactFormContainer');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const emailForm = document.getElementById('emailForm');
    
    // Open contact form when button is clicked
    contactBtn.addEventListener('click', function() {
        contactFormContainer.classList.add('active');
    });
    
    // Close contact form when close button is clicked
    closeFormBtn.addEventListener('click', function() {
        contactFormContainer.classList.remove('active');
    });
    
    // Close contact form when clicking outside the form
    contactFormContainer.addEventListener('click', function(e) {
        if (e.target === contactFormContainer) {
            contactFormContainer.classList.remove('active');
        }
    });
    
    // Handle form submission
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        // For now, we'll simulate a successful submission
        
        // Create data object for sending
        const formData = {
            name: name,
            email: email,
            subject: subject,
            message: message,
            // This would be your email address where you want to receive messages
            recipient: 'your-email@example.com'
        };
        
        // Simulate sending (in a real application, you would use fetch or XMLHttpRequest)
        console.log('Form data to be sent:', formData);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form and close it
        emailForm.reset();
        contactFormContainer.classList.remove('active');
    });
});
