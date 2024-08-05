import React from 'react';
import { Link, Outlet } from 'react-router-dom';

interface CardProps {
    title: string;
    count: number;
    description: string;
    href: string;
}

const Header = () => (
    <header className="header">
        <h1>Pod Status Analyzer By LLMs</h1>
    </header>
);

const Footer = () => (
    <footer className="footer"></footer>
);

const Card: React.FC<CardProps> = ({ title, count, description, href }) => (
    <div className="card">
        <h2>
            {title}
            <span>{count}</span>
        </h2>
        <p>{description}</p>
        <Link to={href}>More Info</Link>
    </div>
);

const podStatuses = [
    { name: 'Running', count: 24, description: 'Pods that are currently in a running state.', href: '/pod-analyzer/running' },
    { name: 'Pending', count: 3, description: 'Pods waiting to be scheduled or have unmet dependencies.', href: '/pod-analyzer/pending' },
    { name: 'Failed', count: 1, description: 'Pods that have failed to complete successfully.', href: '/pod-analyzer/failed' }
];

const CardContainer = () => (
    <div className="card-container">
        <div className="card-header">
            <div>Pod Status</div>
            <button
                // onClick={() => mutate('http://<kubesphere-api-url>/api/v1/pods')}
                className="reload-button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M8 16H3v5"></path>
                </svg>
            </button>
        </div>
        <div className="cards">
            {podStatuses.map((status) => (
                <Card 
                    key={status.name} 
                    title={status.name} 
                    count={status.count} 
                    description={status.description} 
                    href={status.href} 
                />
            ))}
        </div>
    </div>
);

const App = () => (
    <html lang="en">
        <head>
            <title>Pod Status Analyzer</title>
            <meta name="description" content="Pod Status" />
            <link rel="stylesheet" href="https://fonts.proxy.ustclug.org/css2?family=Inter:wght@400;700&display=swap" />
            <style>
                {`
                    :root {
                        --foreground-rgb: 0, 0, 0;
                        --background-start-rgb: 224, 225, 230;
                        --background-end-rgb: 255, 255, 255;
                    }

                    @media (prefers-color-scheme: dark) {
                        :root {
                            --foreground-rgb: 255, 255, 255;
                            --background-start-rgb: 0, 0, 0;
                            --background-end-rgb: 0, 0, 0;
                        }
                    }

                    body {
                        color: rgb(var(--foreground-rgb));
                        background: rgb(var(--background-start-rgb));
                        font-family: 'Inter', sans-serif;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        flex-direction: column;
                        min-height: 100vh;
                        align-items: center;
                        justify-content: space-between;
                        padding: 24px;
                    }

                    .main {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                        max-width: 1200px;
                    }

                    .header {
                        text-align: center;
                        margin-top: 12px;
                        margin-bottom: 80px;
                    }

                    .header h1 {
                        font-size: 4.8rem;
                        font-weight: bold;
                    }

                    .footer {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 48px;
                        display: flex;
                        align-items: end;
                        justify-content: center;
                        background: linear-gradient(to top, white, transparent);
                    }

                    @media (prefers-color-scheme: dark) {
                        .footer {
                            background: linear-gradient(to top, black, transparent);
                        }
                    }

                    .footer div {
                        pointer-events: none;
                        display: flex;
                        align-items: center;
                        gap: 2px;
                        padding: 8px;
                    }

                    .content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                    }

                    .card-container {
                        background-color: rgb(227, 233, 233);
                        border-radius: 1rem; 
                        padding: 16px;
                        width: 100%;
                        max-width: 1200px;
                        margin-bottom: 24px; 
                    }

                    .card-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 16px;
                    }

                    .card-header div {
                        font-weight: bold;
                        font-size: 1.5rem;
                    }

                    .cards {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 20px;
                        text-align: center;
                    }

                    @media (min-width: 1024px) {
                        .cards {
                            grid-template-columns: repeat(3, 1fr);
                            text-align: left;
                        }
                    }

                    .card {
                        background-color: white;
                        border-radius: 1rem; 
                        border: 1px solid transparent;
                        padding: 20px;
                        transition: all 0.2s;
                    }

                    .card:hover {
                        border-color: #d1d5db;
                        background-color: #f3f4f6;
                    }

                    @media (prefers-color-scheme: dark) {
                        .card:hover {
                            border-color: #374151;
                            background-color: rgba(31, 41, 55, 0.3);
                        }
                    }

                    .card h2 {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 2rem;
                        font-weight: 600;
                        margin-bottom: 12px;
                    }

                    .card p {
                        margin: 0;
                        max-width: 50ch;
                        font-size: 1rem;
                        opacity: 0.5;
                    }

                    .card a {
                        display: block;
                        margin-top: 10px;
                        font-size: 1rem;
                        color: #1d4ed8;
                        text-decoration: none;
                    }

                    .card a:hover {
                        text-decoration: underline;
                    }

                    .reload-button {
                        background: none;
                        border: none;
                        padding: 0;
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .reload-button:focus {
                        outline: none;
                    }

                    .reload-button svg {
                        transition: transform 0.2s;
                    }

                    .reload-button:hover svg {
                        transform: rotate(90deg);
                    }
                `}
            </style>
        </head>
        <body>
            <main className="main">
                <Header />
                <CardContainer />
                <Outlet />
                <Footer />
            </main>
        </body>
    </html>
);

export default App;


