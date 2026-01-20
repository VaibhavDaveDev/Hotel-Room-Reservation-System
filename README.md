# Hotel Room Reservation System
[![Hotel Room Reservation System](https://img.shields.io/badge/Hotel%20Room%20Reservation%20System-Live-009688?style=for-the-badge&logo=cloudflare&logoColor=white)](https://Hotel-Room-Reservation-System.pages.dev)
## Problem Statement
A hotel has 97 rooms distributed across 10 floors. The system needs to book rooms for guests (up to 5 rooms at a time) following specific rules:
1.  **Priority 1:** Book rooms on the same floor to minimize horizontal distance.
2.  **Priority 2:** If rooms are not available on the same floor, book rooms to minimize total travel time (vertical + horizontal).
    - Horizontal travel: 1 minute per room.
    - Vertical travel: 2 minutes per floor.

## Solution
This Angular application provides a visual interface to book rooms based on the above constraints.
- **Booking Algorithm:** Calculates the optimal room set using a sliding window for same-floor checks and a closest-cluster search for multi-floor bookings.
- **Visualization:** Displays the building structure, identifying stairs/lift and room statuses (Available/Booked).
- **Interactive Controls:** Allows users to book rooms, generate random occupancy, and reset the system.

## How to Run

### Prerequisites
- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **Angular CLI**: Install globally using `npm install -g @angular/cli`

### Steps
1.  Clone the repository:
    ```bash
    git clone https://github.com/VaibhavDaveDev/Hotel-Room-Reservation-System.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Hotel-Room-Reservation-System
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm start
    ```
    or
    ```bash
    ng serve
    ```
5.  Open your browser and navigate to `http://localhost:4200/`.

## Dependencies
- **Angular:** Frontend framework.
- **Tailwind CSS:** For styling (configured via `tailwind.config.js` and `styles.css`).

## 🌐 Deployment

This project is live and hosted on **Cloudflare Pages**. It is configured with a Continuous Deployment (CD) pipeline that automatically redeploys the site whenever changes are pushed to the main branch.

**Live Demo:** [https://Hotel-Room-Reservation-System.pages.dev](https://Hotel-Room-Reservation-System.pages.dev)

## ScreenShots
<img width="1384" height="1240" alt="website image" src="https://github.com/user-attachments/assets/b6ae8bbf-31a6-4d87-9449-0276fda7545f" />
