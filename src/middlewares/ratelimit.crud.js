import { rateLimit, MINUTE } from 'express-rate-limit'

export const crudlimiter = rateLimit({
    windowMs: 15*MINUTE, 
    limit: 300, 
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    keyGenerator: (req) => req.user?.id,
})