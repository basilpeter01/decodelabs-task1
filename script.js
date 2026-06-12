document.addEventListener('DOMContentLoaded', () => {

    // check if already logged in
    const savedUser = localStorage.getItem('decodelabs_user');
    if (savedUser) {
        showApp(savedUser);
    }

    // ---- Tab switcher (Login / Register) ----
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.getAttribute('data-tab');

            // show the right form
            document.getElementById('loginForm').classList.toggle('hidden', target !== 'login');
            document.getElementById('registerForm').classList.toggle('hidden', target !== 'register');

            // clear any messages
            document.getElementById('loginError').textContent = '';
            document.getElementById('registerMsg').textContent = '';
        });
    });


    // ---- Login form ----
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginError = document.getElementById('loginError');

        loginError.textContent = '';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('decodelabs_user', data.name);
                showApp(data.name);
            } else {
                loginError.textContent = data.error;
            }
        } catch (err) {
            document.getElementById('loginError').textContent = 'Could not reach the server.';
        }
    });


    // ---- Register form ----
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const registerMsg = document.getElementById('registerMsg');

        registerMsg.textContent = '';
        registerMsg.className = 'form-response login-error';

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // switch to login tab with a success message
                registerMsg.textContent = data.message + ' Please log in.';
                registerMsg.className = 'form-response success login-error';
                document.getElementById('registerForm').reset();
            } else {
                registerMsg.textContent = data.error;
            }
        } catch (err) {
            registerMsg.textContent = 'Could not reach the server.';
        }
    });


    // ---- Logout ----
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await fetch('/api/logout', { method: 'POST' });
        localStorage.removeItem('decodelabs_user');
        showLogin();
    });


    // ---- menu ----
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');

            const lines = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('open')) {
                lines[0].style.transform = 'rotate(45deg) translate(6px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(6px, -5px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }


    // ---- Filter buttons ----
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const selected = e.target.getAttribute('data-target');
            const cards = document.querySelectorAll('.content-card');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (selected === 'all' || category === selected) {
                    card.style.display = 'block';
                    setTimeout(() => { card.style.opacity = '1'; }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });

});


function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginForm').reset();
}


async function showApp(name) {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('welcomeText').textContent = 'Hi, ' + name + '!';

    await loadProjects();
}


async function loadProjects() {
    const container = document.getElementById('projectContainer');

    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();

        container.innerHTML = '';

        projects.forEach(project => {
            const card = document.createElement('article');
            card.className = 'content-card';
            card.setAttribute('data-category', project.category);
            card.innerHTML = `
                <div class="card-icon">${project.number}</div>
                <h2>${project.title}</h2>
                <p>${project.description}</p>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        container.innerHTML = '<p style="color:red">Failed to load projects. Is the server running?</p>';
    }
}