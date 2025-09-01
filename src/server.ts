import express from 'express';
import cors from 'cors';
import config from './config/config';
import generateRoute from './routes/generateRoute';
import audioRoute from './routes/audioRoute';
import imagesRoute from './routes/imagesRoute';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Routes
app.use('/generate', generateRoute);
app.use('/generate/audio', audioRoute);
app.use('/generate/images', imagesRoute);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
const server = app.listen(config.port, () => {
    const address = server.address();
    const port = typeof address === 'string' ? address : address?.port;
    console.log(`Server running on http://localhost:${port}`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
    console.log('Received shutdown signal. Performing graceful shutdown...');
    server.close(() => {
        console.log('Server closed. Process will exit.');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default server;
