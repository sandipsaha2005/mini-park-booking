import {
    authenticate,
    defineMiddlewares,
    MedusaNextFunction,
    MedusaRequest,
    MedusaResponse
} from "@medusajs/framework/http";

const requestLogger = (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start
        console.log(`[${req.method}] ${req.path} → ${res.statusCode} (${duration}ms)`)
    });

    next();
}

const requireApiKey = (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    const apiKey = req.headers["x-api-key"]

    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    next()
}

export default defineMiddlewares({
    routes: [
        {
            matcher: "/bookings*",
            middlewares: [requestLogger]
        },
        {
            matcher: "/admin/tickets*",
            middlewares: [requireApiKey]
        },
        {
            matcher: "/store/bookings*",
            middlewares: [
                authenticate("customer", ["bearer", "session"]), 
            ],
        },
    ]
})