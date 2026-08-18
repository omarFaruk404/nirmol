// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (themeToggle) {
        // Check for saved theme
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-theme');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 2. Magnetic UI Buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            // Calculate movement (limit to a max offset)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const moveX = (x - centerX) * 0.3; 
            const moveY = (y - centerY) * 0.3;

            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // 3. Scroll Reveals (IntersectionObserver)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. HTML5 Canvas Smog-to-Clear Engine (Only on pages with #hero-canvas)
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        const resizeCanvas = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
            }
            update(scrollRatio) {
                // scrollRatio 0 = dirty smog, scrollRatio 1 = clean green
                
                // If clean, flow to the right like a breeze. If dirty, chaotic.
                const targetSpeedX = scrollRatio * 3 + (1 - scrollRatio) * (Math.random() * 2 - 1);
                const targetSpeedY = (1 - scrollRatio) * (Math.random() * 2 - 1);
                
                // Lerp towards target speed
                this.speedX += (targetSpeedX - this.speedX) * 0.1;
                this.speedY += (targetSpeedY - this.speedY) * 0.1;

                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }
            draw(scrollRatio) {
                // Interpolate color from dirty gray to neon green
                // Dirty: rgba(80, 80, 80, 0.8)
                // Clean: rgba(57, 255, 20, 0.8)
                const r = Math.floor(80 + (57 - 80) * scrollRatio);
                const g = Math.floor(80 + (255 - 80) * scrollRatio);
                const b = Math.floor(80 + (20 - 80) * scrollRatio);
                
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.5 + 0.3 * scrollRatio})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const numParticles = Math.floor((width * height) / 10000); // density
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            // Calculate scroll ratio based on how far we scrolled (max out at 500px)
            const maxScroll = 500;
            let scrollY = window.scrollY;
            if (scrollY > maxScroll) scrollY = maxScroll;
            const scrollRatio = scrollY / maxScroll;

            // Clear canvas with trail effect
            ctx.fillStyle = body.classList.contains('dark-theme') ? 'rgba(18, 18, 18, 0.2)' : 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update(scrollRatio);
                p.draw(scrollRatio);
            });

            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }
});
