require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: true, // Reflect request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.get('origin')}`);
    next();
});

// Database Connection
const setupDB = async () => {
    if (process.env.NODE_ENV === 'development') {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log('Connected to In-Memory MongoDB');
        
        // Seed initial users
        const User = require('./models/User');
        const adminExists = await User.findOne({ role: 'Admin' });
        if (!adminExists) {
            const admin = new User({ email: 'admin@ems.com', password: 'adminpassword', role: 'Admin' });
            const user = new User({ email: 'user@ems.com', password: 'userpassword', role: 'User' });
            await admin.save();
            await user.save();
            console.log('Initial users seeded in memory');
        }
    } else {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    }
};

setupDB().catch(err => console.error('Database connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const maintenanceRoutes = require('./routes/maintenance');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require('./routes/reports');

app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('Event Management System API is running...');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
