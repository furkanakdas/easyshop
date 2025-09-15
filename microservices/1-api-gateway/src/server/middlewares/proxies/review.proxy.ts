import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../../../config';



export const reviewProxy = createProxyMiddleware({
    target: config.REVIEW_BASE_URL,
    changeOrigin: true,
});


