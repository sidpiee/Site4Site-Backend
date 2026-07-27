import { rateLimit, MINUTE } from 'express-rate-limit'

export const searchlimiter = rateLimit({
	windowMs: 1 * MINUTE, 
	limit: 20, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
})