// Centralized quotes utility with local and API-based quotes

export interface Quote {
    quote: string;
    author: string;
    category?: string;
    source?: 'local' | 'api';
}

// Local motivational quotes focused on learning and productivity
export const localQuotes: Quote[] = [
    {
        quote: "The expert in anything was once a beginner.",
        author: "Helen Hayes",
        category: "Growth",
        source: "local"
    },
    {
        quote: "Learning never exhausts the mind.",
        author: "Leonardo da Vinci",
        category: "Learning",
        source: "local"
    },
    {
        quote: "Focus is a matter of deciding what things you're not going to do.",
        author: "John Carmack",
        category: "Focus",
        source: "local"
    },
    {
        quote: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier",
        category: "Consistency",
        source: "local"
    },
    {
        quote: "The only way to learn a new programming language is by writing programs in it.",
        author: "Dennis Ritchie",
        category: "Practice",
        source: "local"
    },
    {
        quote: "Stay focused and never give up on your dreams.",
        author: "Anonymous",
        category: "Motivation",
        source: "local"
    },
    {
        quote: "Every expert was once a beginner. Every pro was once an amateur.",
        author: "Robin Sharma",
        category: "Inspiration",
        source: "local"
    },
    {
        quote: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
        author: "Alexander Graham Bell",
        category: "Focus",
        source: "local"
    },
    {
        quote: "The beautiful thing about learning is that nobody can take it away from you.",
        author: "B.B. King",
        category: "Learning",
        source: "local"
    },
    {
        quote: "Progress, not perfection, is the goal.",
        author: "Anonymous",
        category: "Progress",
        source: "local"
    },
    {
        quote: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        category: "Action",
        source: "local"
    },
    {
        quote: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
        category: "Persistence",
        source: "local"
    }
];

// API Quote interfaces
interface QuotableQuote {
    content: string;
    author: string;
    tags: string[];
}

interface ZenQuote {
    q: string;
    a: string;
    h: string;
}

/**
 * Fetch quotes from open-source APIs
 */
export async function fetchQuoteFromAPI(): Promise<Quote | null> {
    const apis = [
        // Quotable API - Free, no key required
        {
            name: 'quotable',
            url: 'https://api.quotable.io/random?tags=motivational|inspirational|success|wisdom',
            transform: (data: QuotableQuote): Quote => ({
                quote: data.content,
                author: data.author,
                category: data.tags[0] || 'Inspiration',
                source: 'api'
            })
        },
        // ZenQuotes API - Free, no key required
        {
            name: 'zenquotes',
            url: 'https://zenquotes.io/api/random',
            transform: (data: ZenQuote[]): Quote => ({
                quote: data[0].q,
                author: data[0].a,
                category: 'Inspiration',
                source: 'api'
            })
        }
    ];

    // Try each API in sequence
    for (const api of apis) {
        try {
            const response = await fetch(api.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                return api.transform(data);
            }
        } catch (error) {
            console.warn(`Failed to fetch from ${api.name}:`, error);
            continue;
        }
    }

    return null;
}

/**
 * Get a random quote - tries API first, falls back to local
 */
export async function getRandomQuote(): Promise<Quote> {
    try {
        const apiQuote = await fetchQuoteFromAPI();
        if (apiQuote) {
            return apiQuote;
        }
    } catch (error) {
        console.warn('API quote fetch failed, using local quote:', error);
    }

    // Fallback to local quotes
    return getRandomLocalQuote();
}

/**
 * Get a random local quote
 */
export function getRandomLocalQuote(): Quote {
    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    return localQuotes[randomIndex];
}

/**
 * Get quote of the day (consistent for 24 hours)
 */
export function getDailyQuote(): Quote {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % localQuotes.length;
    return localQuotes[index];
}

/**
 * Get quotes by category
 */
export function getQuotesByCategory(category: string): Quote[] {
    return localQuotes.filter(quote =>
        quote.category?.toLowerCase() === category.toLowerCase()
    );
}