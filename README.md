# Project 1 — Course selector with Responsive Frontend Interface

A simple project where users can register, log in, browse available courses, and save their enrolled selections.
Data is stored in MongoDB.

This repo contains the frontend project.
Built with HTML, CSS, and Vanilla JavaScript.

---

## What it does

- **Register** — new users create an account with a username and password via the Register tab. The form sends a POST request to the backend and shows a success or error message.
- **Login** — existing users log in with their credentials. On success, the username is stored in localStorage and the dashboard loads.
- **Course dashboard** — after login, 10 available courses are displayed as cards.
- **Select courses** — clicking a card toggles it selected or deselected. Selected cards are visually highlighted.
- **Save selections** — a Save button sends the selected course IDs to the backend via POST. The backend updates the user's document in MongoDB.
- **Sidebar — My Courses** — enrolled courses appear as a list in the sidebar. Each entry has a remove button that sends a DELETE request to the backend and deselects the card.
- **Saved data Persists** — when the user logs back in, the frontend fetches their saved course IDs from the backend (GET request) and pre-highlights the previously enrolled cards.
- **Category filters** — sidebar buttons filter the course grid by category (All, Programming, AI/ML, Data, Infrastructure, Security).
- **Mobile-responsive** — layout shifts between single-column (mobile), two-column (tablet), and three-column (desktop) using CSS Grid. A hamburger menu handles navigation on small screens.


---

## Tech used

- HTML5 (semantic elements)
- CSS3 (Grid, Flexbox, custom properties, clamp())
- Vanilla JavaScript (fetch API, localStorage, DOM manipulation)

---

## Files

```
frontend/
  index.html    Main page — login/register + dashboard
  styles.css    All styles
  script.js     All frontend JS logic
```

---

## How to run

This frontend is served by the backend server.

1. Make sure the backend server is running (see the backend repo)
2. Open `http://localhost:3000` in your browser


---

*DecodeLabs Internship — 2026*
