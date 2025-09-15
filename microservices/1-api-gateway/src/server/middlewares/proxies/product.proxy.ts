import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../../../config';



export const productProxy = createProxyMiddleware({
    target: config.PRODUCT_BASE_URL,
    changeOrigin: true,
});
