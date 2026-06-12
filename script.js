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
            document.getElementById('loginForm').classList.toggle('hidden', target !== 'login');
            document.getElementById('registerForm').classList.toggle('hidden', target !== 'register');
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

    // ---- Hamburger menu ----
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

    // ---- Save button ----
    document.getElementById('saveBtn').addEventListener('click', async () => {
        const username = localStorage.getItem('decodelabs_user');
        const saveMsg = document.getElementById('saveMsg');

        saveMsg.textContent = 'Saving...';
        saveMsg.className = 'save-msg';

        // get currently selected course IDs
        const selectedCards = document.querySelectorAll('.content-card.selected');
        const selectedIds = Array.from(selectedCards).map(c => parseInt(c.getAttribute('data-id')));

        // save to localStorage right away so it works even without DB
        localStorage.setItem('enrolled_' + username, JSON.stringify(selectedIds));

        try {
            // POST to backend - will be properly handled once DB is ready
            await fetch('/api/courses/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, courseIds: selectedIds })
            });
        } catch (err) {
            // silently ignore - localStorage already saved it
        }

        saveMsg.textContent = '✓ Courses saved!';
        saveMsg.className = 'save-msg success';
        setTimeout(() => { saveMsg.textContent = ''; }, 3000);

        updateEnrolledSidebar(selectedIds);
    });

});


// ---- Course data (will come from GET /api/courses once backend is ready) ----
const allCourses = [
    { id: 1,  title: 'Web Development',        icon: '🌐', category: 'programming',    description: 'HTML, CSS, JavaScript, and modern frameworks for building websites.' },
    { id: 2,  title: 'Artificial Intelligence', icon: '🤖', category: 'ai-ml',          description: 'Fundamentals of AI, neural networks, and intelligent systems.' },
    { id: 3,  title: 'Machine Learning',        icon: '📊', category: 'ai-ml',          description: 'Supervised and unsupervised learning, model training and evaluation.' },
    { id: 4,  title: 'Data Science',            icon: '📈', category: 'data',           description: 'Data analysis, visualization, and statistical methods.' },
    { id: 5,  title: 'Python Programming',      icon: '🐍', category: 'programming',    description: 'Python from basics to advanced — great for AI, data, and scripting.' },
    { id: 6,  title: 'Database Management',     icon: '🗄️', category: 'data',           description: 'SQL, NoSQL, database design and query optimization.' },
    { id: 7,  title: 'Cloud Computing',         icon: '☁️', category: 'infrastructure', description: 'AWS, Azure, GCP, and cloud architecture fundamentals.' },
    { id: 8,  title: 'Cybersecurity',           icon: '🔐', category: 'security',       description: 'Network security, ethical hacking, and protecting data.' },
    { id: 9,  title: 'Mobile App Development',  icon: '📱', category: 'programming',    description: 'Build iOS and Android apps with React Native or Flutter.' },
    { id: 10, title: 'DevOps & CI/CD',          icon: '⚙️', category: 'infrastructure', description: 'Docker, Kubernetes, automation, and deployment pipelines.' },
];


function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginForm').reset();
}


async function showApp(name) {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('welcomeText').textContent = 'Hi, ' + name + '!';

    let enrolled = [];

    try {
        const response = await fetch('/api/courses/enrolled?username=' + name);
        const data = await response.json();
        if (response.ok) {
            enrolled = data.enrolledCourses;
            localStorage.setItem('enrolled_' + name, JSON.stringify(enrolled));
        }
    } catch (err) {
        enrolled = getEnrolledFromStorage(name);
    }

    renderCourses(enrolled);
    updateEnrolledSidebar(enrolled);
}


// get saved course IDs from localStorage
function getEnrolledFromStorage(username) {
    const saved = localStorage.getItem('enrolled_' + username);
    return saved ? JSON.parse(saved) : [];
}


// build the course cards and pre-select enrolled ones
function renderCourses(enrolledIds) {
    const container = document.getElementById('projectContainer');
    container.innerHTML = '';

    allCourses.forEach(course => {
        const isEnrolled = enrolledIds.includes(course.id);

        const card = document.createElement('article');
        card.className = 'content-card' + (isEnrolled ? ' selected' : '');
        card.setAttribute('data-category', course.category);
        card.setAttribute('data-id', course.id);

        card.innerHTML = `
            <div class="card-icon">${course.icon}</div>
            <h2>${course.title}</h2>
            <p>${course.description}</p>
            <span class="card-tag">${course.category}</span>
            ${isEnrolled ? '<span class="card-check">✓ Enrolled</span>' : ''}
        `;

        // clicking a card toggles its selected state
        card.addEventListener('click', () => toggleCourse(card, course));

        container.appendChild(card);
    });

    updateSelectionCount();
}


// toggle a course card selected/deselected
function toggleCourse(card, course) {
    card.classList.toggle('selected');

    // update or remove the enrolled badge
    const existingCheck = card.querySelector('.card-check');
    if (card.classList.contains('selected')) {
        if (!existingCheck) {
            const check = document.createElement('span');
            check.className = 'card-check';
            check.textContent = '✓ Enrolled';
            card.appendChild(check);
        }
    } else {
        if (existingCheck) existingCheck.remove();
    }

    updateSelectionCount();
}


// update the "X courses selected" text above the grid
function updateSelectionCount() {
    const count = document.querySelectorAll('.content-card.selected').length;
    document.getElementById('selectionCount').textContent = count + ' course' + (count !== 1 ? 's' : '') + ' selected';
}


// update the sidebar enrolled list and progress bar
function updateEnrolledSidebar(enrolledIds) {
    const list = document.getElementById('enrolledList');
    const countEl = document.getElementById('enrolledCount');
    const bar = document.getElementById('progressBar');

    const count = enrolledIds.length;
    countEl.textContent = count + ' of 10 courses';
    bar.style.width = (count / 10 * 100) + '%';

    if (count === 0) {
        list.innerHTML = '<li class="empty-msg">No courses saved yet.</li>';
        return;
    }

    list.innerHTML = '';

    enrolledIds.forEach(id => {
        const course = allCourses.find(c => c.id === id);
        if (!course) return;

        const item = document.createElement('li');
        item.className = 'enrolled-item';
        item.innerHTML = `
            <span>${course.icon} ${course.title}</span>
            <button class="remove-btn" data-id="${course.id}">✕</button>
        `;

        // remove button: deselect the card and update storage
        item.querySelector('.remove-btn').addEventListener('click', () => {
            removeCourse(course.id);
        });

        list.appendChild(item);
    });
}


// remove a course - update card, sidebar, and storage
function removeCourse(courseId) {
    const username = localStorage.getItem('decodelabs_user');

    // deselect the card in the grid
    const card = document.querySelector(`.content-card[data-id="${courseId}"]`);
    if (card) {
        card.classList.remove('selected');
        const check = card.querySelector('.card-check');
        if (check) check.remove();
    }

    updateSelectionCount();

    // get current enrolled list and remove this one
    const current = getEnrolledFromStorage(username);
    const updated = current.filter(id => id !== courseId);

    // save updated list
    localStorage.setItem('enrolled_' + username, JSON.stringify(updated));

    // tell the backend - will work once API/DB is ready
    fetch('/api/courses/enroll/' + courseId, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    }).catch(() => {}); // ignore error for now

    updateEnrolledSidebar(updated);
}