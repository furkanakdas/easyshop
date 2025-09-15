import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../../../config';



export const orderProxy = createProxyMiddleware({
    target: config.ORDER_BASE_URL,
    changeOrigin: true,
});
