const body = document.body;
const themeIcon = document.getElementById('theme-icon');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray;

const form = document.getElementById('contactForm');
const popup = document.getElementById('successPopup');

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

window.toggleTheme = toggleTheme; 


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            if (entry.target.id === 'skills') {
                const progressBars = document.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('section').forEach(sec => observer.observe(sec));

document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.tilt-element').forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        }
    });
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() * 0.5) - 0.25;
        this.speedY = (Math.random() * 0.5) - 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        const isDark = body.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgba(0, 210, 255, 0.5)' : 'rgba(0, 122, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 80; i++) particlesArray.push(new Particle());
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();


form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const statusButton = form.querySelector('.btn');
    const originalText = statusButton.textContent;
    
    statusButton.textContent = 'Enviando...';
    statusButton.disabled = true;

    const data = new FormData(e.target);
    
    try {
        const response = await fetch(e.target.action, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            popup.classList.add('show');

            form.reset(); 

            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);

        } else {
            alert('Ops! Houve um problema ao enviar. Verifique seus dados e tente novamente.');
        }

    } catch (error) {
        alert('Erro de conexão. Não foi possível enviar a mensagem.');
    } finally {
        statusButton.textContent = originalText;
        statusButton.disabled = false;
    }
});