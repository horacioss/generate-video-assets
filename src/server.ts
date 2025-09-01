import express from 'express';
import cors from 'cors';
import config from './config/config';
import generateRoute from './routes/generateRoute';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Routes
app.use('/generate', generateRoute);
app.use('/generate/audio', generateRoute);
app.use('/generate/images', generateRoute);

// Start server
const server = app.listen(config.port, () => {
    const address = server.address();
    const port = typeof address === 'string' ? address : address?.port;
    console.log(`Server running on port ${port}`);
});

// Handle hot reload in development
if (process.env.NODE_ENV === 'development') {
    process.on('SIGTERM', () => {
        console.log('Received SIGTERM. Performing graceful shutdown...');
        server.close(() => {
            console.log('Server closed. Process will exit.');
            process.exit(0);
        });
    });
}

export default server;
