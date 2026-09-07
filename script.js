document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Generation
    function createParticles(containerId, count) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            
            // Random properties
            const size = Math.random() * 5 + 2; // 2px to 7px
            const left = Math.random() * 100; // 0% to 100%
            const top = Math.random() * 100;
            const duration = Math.random() * 10 + 10; // 10s to 20s
            const delay = Math.random() * 5;
            
            // Styling
            particle.style.position = 'absolute';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = Math.random() > 0.5 ? 'var(--gold)' : 'var(--gold-light)';
            particle.style.borderRadius = '50%';
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particle.style.boxShadow = `0 0 ${size}px var(--gold)`;
            
            // Animation via web animations API
            particle.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: particle.style.opacity },
                { transform: `translate(${Math.random() * 100 - 50}px, -${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                iterations: Infinity,
                easing: 'linear'
            });
            
            container.appendChild(particle);
        }
    }

    createParticles('particles-cover', 40);
    createParticles('particles-invitation', 50);

    // 2. Page Transition
    const openBtn = document.getElementById('open-invitation');
    const coverPage = document.getElementById('cover-page');
    const invPage = document.getElementById('invitation-page');
    const musicBtn = document.getElementById('music-btn');
    const audio = document.getElementById('bgMusic');
    if (audio) {
        audio.volume = 0.3; // set initial target volume
    }
    
    let isMusicPlaying = false;
    let autoCloseTimeout;

    function fadeAudioIn() {
        if (!audio) return;
        audio.volume = 0;
        audio.play().then(() => {
            isMusicPlaying = true;
            updateMusicIcon();
            let vol = 0;
            const fadeInterval = setInterval(() => {
                if (vol < 0.3) {
                    vol += 0.05;
                    audio.volume = Math.min(vol, 0.3);
                } else {
                    clearInterval(fadeInterval);
                }
            }, 200);
        }).catch(e => {
            console.log("Autoplay prevented or file not found.", e);
            isMusicPlaying = false;
            updateMusicIcon();
        });
    }

    openBtn.addEventListener('click', () => {
        // Transition effect
        coverPage.classList.remove('active');
        coverPage.classList.add('fade-out');
        
        setTimeout(() => {
            coverPage.style.display = 'none';
            invPage.classList.add('active');
            window.scrollTo(0, 0);
            
            // Show music button
            musicBtn.classList.add('visible');
            
            // Attempt to play audio with fade-in
            fadeAudioIn();
            
            // Trigger reveals that are in viewport
            revealOnScroll();
            
            // Auto close after 2 minutes (120000 ms)
            clearTimeout(autoCloseTimeout);
            autoCloseTimeout = setTimeout(() => {
                invPage.classList.remove('active');
                
                setTimeout(() => {
                    coverPage.style.display = 'flex';
                    // Slight delay to allow display flex to apply before transitioning opacity
                    setTimeout(() => {
                        coverPage.classList.remove('fade-out');
                        coverPage.classList.add('active');
                    }, 50);
                    
                    musicBtn.classList.remove('visible');
                    if (isMusicPlaying && audio) {
                        audio.pause();
                        isMusicPlaying = false;
                        updateMusicIcon();
                    }
                }, 1000);
            }, 120000);
        }, 800);
    });

    // 3. Audio Control
    musicBtn.addEventListener('click', () => {
        if (!audio) return;
        
        if (isMusicPlaying) {
            audio.pause();
            isMusicPlaying = false;
        } else {
            audio.volume = 0.3;
            audio.play().then(() => {
                isMusicPlaying = true;
            }).catch(e => console.log(e));
        }
        updateMusicIcon();
    });

    function updateMusicIcon() {
        const icon = document.getElementById('music-icon');
        if (isMusicPlaying) {
            icon.textContent = '🎵';
            musicBtn.classList.add('playing');
        } else {
            icon.textContent = '🔇';
            musicBtn.classList.remove('playing');
        }
    }

    // 4. Scroll Reveal
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach((reveal) => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 50; // trigger point
            
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
});
