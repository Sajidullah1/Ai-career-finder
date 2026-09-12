import { app } from '../server';

/**
 * Vercel Serverless Function entry point for AI Career Finder API.
 * Exports the Express app instance as default export so Vercel's Node runtime
 * mounts it natively as a serverless function.
 */
export default app;
export { app };

