# GitHub Trending Repositories & Analytics Platform

A responsive web application that helps developers discover recently created GitHub repositories with the highest star counts and explore detailed weekly development activity through interactive charts.

---

## 🚀 Overview

GitHub hosts millions of repositories, making it difficult for developers to identify newly created projects gaining momentum. This application provides:
1. **Repository Discovery**: Real-time trending repositories sorted by star count.
2. **Date-Based Filtering**: Filter repositories created within the **Last 1 Week** (7 days), **Last 2 Weeks** (14 days), or **Last 1 Month** (30 days).
3. **Continuous Browsing**: Seamless infinite scrolling powered by the Intersection Observer API.
4. **Development Activity Analytics**: Detailed weekly breakdowns of **commits**, **code additions**, and **code deletions**.
5. **Interactive Visualizations**: Two vertically stacked Highcharts graphs comparing aggregate repository volume and individual contributor breakdowns with interactive tooltips and legend toggling.

---

## 🛠️ Tech Stack & Architecture

| Technology | Responsibility |
|---|---|
| **React.js (v18)** | Frontend UI component architecture & lifecycle hooks |
| **Redux Toolkit** | Global state management for repositories and analytics |
| **Redux Saga** | Asynchronous workflows, side-effects, retries for GitHub API |
| **Material UI (MUI v6)** | Design system, responsive layout, cards, and theme |
| **Highcharts & Highcharts React** | Interactive data visualization charts |
| **React Router (v6)** | Client-side routing between Discovery and Analytics pages |
| **GitHub REST API** | Search, code frequency, commit activity, and contributors endpoints |
| **Vite** | Fast development server and production build bundler |

### Architecture Flow
```
React Components (UI)
        ↓ (dispatches actions)
  Redux Toolkit
        ↓ (caught by sagas)
   Redux Saga
        ↓ (API requests with retry & rate-limit handling)
  GitHub REST API
        ↓ (normalized weekly datasets)
   Redux Store
        ↓ (reactive selectors)
React UI & Highcharts Visualizations
```

---

## 📂 Project Folder Structure

```
github-trending-app/
├── public/
│   └── github-mark.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx           # App bar with token settings helper
│   │   ├── DateFilter.jsx       # 1-week, 2-week, 1-month creation filter
│   │   ├── RepositoryCard.jsx   # Repository item row with badges & actions
│   │   ├── RepositoryList.jsx   # List container with empty state handling
│   │   ├── Loading.jsx          # Skeletons and progress indicators
│   │   ├── ErrorMessage.jsx     # Alert banner with retry & rate limit guidance
│   │   └── InfiniteScroll.jsx   # IntersectionObserver infinite pagination
│   ├── pages/
│   │   ├── Home.jsx             # Trending repositories discovery dashboard
│   │   ├── RepositoryDetails.jsx# Repository analytics page
│   │   └── NotFound.jsx         # 404 page with navigation
│   ├── charts/
│   │   ├── TotalActivityChart.jsx   # Aggregate weekly activity chart
│   │   └── ContributorChart.jsx     # Multi-line individual contributor chart
│   ├── redux/
│   │   ├── store.js             # Redux store with saga middleware
│   │   ├── rootSaga.js          # Combined root saga
│   │   ├── repositories/
│   │   │   ├── repositorySlice.js # Repositories state & reducers
│   │   │   └── repositorySaga.js  # Search API saga
│   │   └── analytics/
│   │       ├── analyticsSlice.js  # Analytics state & metric switcher
│   │       └── analyticsSaga.js   # Stats saga with HTTP 202 retry logic
│   ├── services/
│   │   └── githubApi.js         # Centralized GitHub REST API client
│   ├── utils/
│   │   ├── dateUtils.js         # Date calculations and formatting
│   │   └── chartUtils.js        # Data normalization & Highcharts builders
│   ├── App.jsx                  # MUI theme provider and router definitions
│   ├── main.jsx                 # React root mounting
│   └── index.css                # Global styling
├── .env.example                 # Example environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🌟 Key Features & Acceptance Criteria Compliance

- **FR-01: Repository Discovery**: Queries GitHub Search API for recently created repositories sorted by stars descending.
- **FR-02: Date-Based Filtering**: Dynamically calculates cutoff dates for `7`, `14`, and `30` days back. Resets pagination on filter change.
- **FR-03: Repository Listing**: Displays one repository per row with owner avatar fallback, full name, stars, issues, language dot, and external links.
- **FR-04: Infinite Scrolling**: Uses `IntersectionObserver` to trigger sequential page requests, prevents duplicate requests, and handles the 1,000 search API limit gracefully.
- **FR-05: Repository Details**: Dedicated route `/repository/:owner/:repo` with back navigation and complete overview.
- **FR-06 - FR-08: Weekly Development Activity**: Retrieves `code_frequency`, `commit_activity`, and `contributors` endpoints, aligns weekly timestamps into a synchronized chronological timeline, and converts deletions to positive counts.
- **FR-09: Activity Metric Selection**: Interactive dropdown to switch between **Commits**, **Additions**, and **Deletions**.
- **FR-10: Total Activity Chart**: Interactive column chart with week date and count tooltips.
- **FR-11: Contributor Activity Chart**: Multi-line chart where each contributor has a dedicated colored line. Interactive legend allows toggling lines on and off.
- **FR-12: Vertically Stacked Layout**: Both charts share the same timeline and are presented vertically.
- **HTTP 202 Retries**: Handles GitHub's asynchronous statistics computation with controlled saga delays and retries.
- **Rate Limit Resilience**: Clear visual feedback on rate limits (403/429) with reset timestamps and an optional personal access token configuration helper.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18.0 or later)
- npm (v9.0 or later)

### Installation

1. Navigate to the project directory:
   ```bash
   cd github-trending-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up a GitHub Personal Access Token:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your token:
   ```env
   VITE_GITHUB_TOKEN=ghp_your_token_here
   ```
   *(Alternatively, you can click the key icon in the app header at runtime to input a token.)*

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```
The compiled assets will be placed in the `dist/` directory.

---

## 📜 License
MIT License.

