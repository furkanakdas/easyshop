import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { config } from '../../../config';
import { Request, Response } from 'express';



export const authProxy = createProxyMiddleware({
    target: config.AUTH_BASE_URL,
    changeOrigin: true,
    // pathRewrite: {
    //     "^/api/auth" : '', // /api/auth/signup → /signup
    // },


    on: {
        // proxyRes: (proxyRes, req, res) => {
        //     const cookies = proxyRes.headers['set-cookie'];
        //     if (cookies) {
        //         // Set-Cookie header'ını tarayıcıya geçiyoruz
        //         res.setHeader('Set-Cookie', cookies);
        //     }
        // },
    },
});


