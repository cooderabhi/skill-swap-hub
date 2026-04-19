<div align="center">
    <h1>🤝 SkillSwap</h1>
    <p><b>A modern, responsive, and serverless web application for community knowledge exchange.</b></p>
</div>

<br>

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/LocalStorage-5C2D91?style=for-the-badge&logo=json&logoColor=white" alt="LocalStorage" />
</div>

<br>

> Welcome to **SkillSwap**! A fully static, highly interactive web platform connecting users looking to trade knowledge. Why pay for a course when you can swap skills with a community member? This application demonstrates advanced frontend DOM manipulation, client-side data persistence, and dynamic component rendering—with zero backend required.

## 🚀 Features

- **Intelligent Mutual Matching**: Using an active algorithm, the platform dynamically scans user criteria to identify and suggest mutually beneficial skill overlaps.
- **Simulated Real-Time Inbox**: An async-simulated notification center that triggers organic alert badges, simulating WebSocket-like latency and interactions.
- **Persisted State & Local Storage**: Utilizes `localStorage` architecture to securely maintain user profiles, bookmark favorites, and save application states across browser sessions.
- **Rich User Profiles & Avatar Integration**: Automatic API fetching integrates realistic dynamic avatars alongside custom-built user cards highlighting ratings, skill levels, and bios.
- **Dynamic Live Ticker & Onboarding**: A frontend-driven live feed ticker and an intuitive spotlight overlay system mapping UI components iteratively for first-time visitors.
- **Interactive Review System**: Live star-rating calculators capable of aggregating and projecting user reputation scores on-the-fly.

## 🛠 Tech Stack

Since this prototype is designed to run statically without a dedicated server architecture, the tech stack relies heavily on raw, specialized Vanilla Web Technologies.

### Core Frameworks & Languages
- **JavaScript (Vanilla JS)** – Handles core logic, algorithms, state management, and DOM injections.
- **HTML5** – Semantic document layout ensuring accessibility and parsing logic.

### Styling & CSS Architecture
- **Vanilla CSS3** – Highly modular cascading stylesheets with grid systems, flexbox alignments, animations, and CSS variable-driven light/dark mode.

### State Management & Storage
- **Browser LocalStorage API** – Serves as the pseudo-database for persisting mock payloads and user progression logic.

### External API Tools
- **Pravatar API** – Open-source profile generation fetching realistic avatar imagery dynamically by ID.

*(Note: React, Next.js, Tailwind, Axios, and Socket.io were intentionally eschewed to maintain a true zero-dependency, serverless environment.)*

## 📁 Project Structure

```text
/
├── index.html       # The main skeleton housing the navigation, forms, and core UI modals
├── style.css        # Responsive stylesheets, animation loops, and design variables
├── script.js        # DOM controllers, state handlers, algorithms, and mock data models
└── README.md        # Project documentation
```

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cooderabhi/skill-swap-hub.git
   ```
2. **Navigate to the directory:**
   ```bash
   cd skill-swap-hub
   ```
3. **Launch the application:**
   No package management or build tools are required. Simply open `index.html` in your preferred modern web browser.
   *(Optional: Serve via VS Code's Live Server extension for hot-reloading during development).*

## 🔒 Environment Variables

No environment variables are necessary for this project. All logic is self-contained within the client browser.

## 💻 Usage

- **Exploring:** Use the active category filters or the text-search input to locate specific skills in the Explore section.
- **Adding a Skill:** Fill out the "Offer a Skill" form to inject a custom profile into the client state.
- **Requesting a Swap:** Clicking "Request Swap" will trigger the simulated Inbox feature. Watch the top right bell icon to visualize asynchronous alerts!
- **Bookmarking:** Click the heart icon on any card and navigate to the `Saved ♥` filter to view your isolated favorites list.

## 🔌 API Integration

- This project relies on **zero backend databases**. 
- It simulates REST methodologies by mapping JSON objects into `localStorage`, enabling full Create, Read, Update, and Delete (CRUD) operations for the "Current User".
- Image rendering utilizes public external queries explicitly bound inside the Javascript templates (`https://i.pravatar.cc/`).

## 🧪 Testing

Testing is currently handled manually via browser validation:
1. Reloading the page to ensure LocalStorage retention.
2. Form submission lifecycle mapping.
3. Asynchronous wait validations on notification timeouts.
4. CSS media query scaling down to `320px` width for mobile responsiveness.

## ⚡ Performance Considerations

- Uses efficient CSS transitions and hardware-accelerated animations (`transform`, `opacity`) to ensure 60FPS scrolling.
- Limits array searching complexity in the Mutual Matches algorithm `O(N^2)` to only process top candidates preventing DOM blockage.
- Images rely on `loading="lazy"` tags embedded directly within DOM creation injections.

## 🔮 Future Improvements

- Migrate to a formal **React/Next.js** framework ecosystem.
- Connect a **Node.js/Express + MongoDB** stack to authenticate real users and persist global cloud data.
- Integrate **Socket.io** for genuine real-time peer-to-peer chatting abilities rather than simulating them.
- Introduce **TailwindCSS** to consolidate styling efficiency.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
1. Fork this project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
