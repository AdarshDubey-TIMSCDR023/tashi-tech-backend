"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const db_1 = require("./config/db");
const Contact_1 = require("./models/Contact");
const Newsletter_1 = require("./models/Newsletter");
const Blog_1 = require("./models/Blog");
const FAQ_1 = require("./models/FAQ");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security and Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Rate Limiter for general endpoints
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Stricter rate limiter for contact form & newsletter signup
const contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per hour
    message: { error: 'Too many submissions, please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Connect to Database
(0, db_1.connectDB)();
// Input Validation Schemas with Zod
const ContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: zod_1.z.string().email('Invalid email address'),
    phone: zod_1.z.string().optional(),
    subject: zod_1.z.string().min(3, 'Subject must be at least 3 characters').max(200).optional(),
    message: zod_1.z.string().min(10, 'Message must be at least 10 characters').max(2000),
});
const NewsletterSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
// Seed data function to ensure dynamic mock content is present
const seedDatabase = async () => {
    try {
        const blogCount = await Blog_1.Blog.countDocuments();
        if (blogCount === 0) {
            console.log('Seeding blogs...');
            await Blog_1.Blog.create([
                {
                    title: 'The Future of AI in Modern Enterprise Solutions',
                    slug: 'future-of-ai-enterprise-solutions',
                    excerpt: 'Explore how deep learning, custom LLMs, and agentic workflows are reshaping corporate intelligence and automation.',
                    content: 'As artificial intelligence shifts from experimental models to fully integrated solutions, companies are recognizing the power of custom agentic workflows. From automated operations to smart retrieval systems (RAG), AI is no longer a luxury but a core driver of efficiency...',
                    category: 'Artificial Intelligence',
                    readTime: '5 min read',
                    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
                    author: {
                        name: 'Dr. Tashi Namgyal',
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
                    }
                },
                {
                    title: 'Architecting Serverless Applications with Next.js 15 and AWS',
                    slug: 'nextjs-15-aws-serverless-architecture',
                    excerpt: 'A comprehensive guide on building ultra-fast, auto-scaling Next.js applications using AWS Lambda, Edge routes, and modern infrastructure.',
                    content: 'Next.js 15 brings powerful compilation optimizations and Server Actions. Combining Next.js with serverless architectures on AWS provides developers with unmatched scalability, global delivery, and near-zero server maintenance overhead...',
                    category: 'Cloud Solutions',
                    readTime: '8 min read',
                    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
                    author: {
                        name: 'Karma Dorji',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
                    }
                },
                {
                    title: 'Optimizing Core Web Vitals: A Case Study in Web Performance',
                    slug: 'optimizing-core-web-vitals-case-study',
                    excerpt: 'How we helped an e-commerce platform improve LCP by 64% and achieve a perfect 100/100 Lighthouse performance rating.',
                    content: 'Web performance is directly correlated with business conversions. In this technical case study, we walk through modern page optimization techniques: tree shaking, asset minification, lazy loading, and critical CSS rendering to satisfy WCAG 2.2 and Lighthouse parameters...',
                    category: 'Web Development',
                    readTime: '6 min read',
                    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
                    author: {
                        name: 'Tandin Wangchuk',
                        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
                    }
                }
            ]);
            console.log('Blogs seeded.');
        }
        const faqCount = await FAQ_1.FAQ.countDocuments();
        if (faqCount === 0) {
            console.log('Seeding FAQs...');
            await FAQ_1.FAQ.create([
                {
                    question: 'What services does Tashi Tech provide?',
                    answer: 'We specialize in Website Development, Web Application Development, Mobile App Development, UI/UX Design, custom AI & Agentic Solutions, Cloud Infrastructure Services, SEO Optimization, and Digital Marketing.',
                    category: 'General',
                    order: 1
                },
                {
                    question: 'How long does a typical custom software project take?',
                    answer: 'While simple landing pages or SEO audits can be completed within 1-2 weeks, more complex web applications, custom AI workflows, or mobile apps usually span 4 to 12 weeks from scoping to final production deployment.',
                    category: 'Process',
                    order: 2
                },
                {
                    question: 'Does Tashi Tech offer post-deployment support?',
                    answer: 'Yes, we provide 24/7 technical support, security patching, cloud monitoring, and performance optimization packages to ensure your systems remain fast and secure long after the initial launch.',
                    category: 'Support',
                    order: 3
                },
                {
                    question: 'Is the website optimized for mobile and accessibility?',
                    answer: 'Absolutely. All our development projects are built mobile-first and strictly adhere to WCAG 2.2 AA accessibility guidelines, ensuring 100% keyboard navigation, screen-reader support, and proper contrast ratios.',
                    category: 'Compliance',
                    order: 4
                }
            ]);
            console.log('FAQs seeded.');
        }
    }
    catch (err) {
        console.error('Error seeding database:', err);
    }
};
// Seed immediately
seedDatabase();
// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});
// GET Blogs
app.get('/api/blogs', apiLimiter, async (req, res) => {
    try {
        const blogs = await Blog_1.Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog posts.' });
    }
});
// GET FAQs
app.get('/api/faqs', apiLimiter, async (req, res) => {
    try {
        const faqs = await FAQ_1.FAQ.find().sort({ order: 1 });
        res.json(faqs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch FAQs.' });
    }
});
// POST Contact Form Submission
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const parsedData = ContactSchema.parse(req.body);
        const newContact = new Contact_1.Contact(parsedData);
        await newContact.save();
        // Log to console/alerts
        console.log(`[Contact Submission] from ${parsedData.name} (${parsedData.email}): ${parsedData.message}`);
        res.status(201).json({ success: true, message: 'Message submitted successfully. Our team will get back to you shortly!' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        }
        else {
            res.status(500).json({ error: 'Failed to process contact submission.' });
        }
    }
});
// POST Newsletter Signup
app.post('/api/newsletter', contactLimiter, async (req, res) => {
    try {
        const parsedData = NewsletterSchema.parse(req.body);
        // Check if already subscribed
        const existing = await Newsletter_1.Newsletter.findOne({ email: parsedData.email });
        if (existing) {
            res.status(200).json({ success: true, message: 'You are already subscribed to our newsletter!' });
            return;
        }
        const newSubscriber = new Newsletter_1.Newsletter(parsedData);
        await newSubscriber.save();
        res.status(201).json({ success: true, message: 'Subscribed successfully! Thank you for joining our newsletter.' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        }
        else {
            res.status(500).json({ error: 'Failed to register newsletter subscription.' });
        }
    }
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error.' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
