import cors from "@elysiajs/cors"
import {Elysia} from "elysia"
import logixlysia from "logixlysia"
import {createRouteHandler} from "uploadthing/server"
import {uploadRouter} from "./uploadthing"

const handlers = createRouteHandler({
    router: uploadRouter,
    config: {},
})

const app = new Elysia()
    .use(logixlysia())
    .use(cors())
    .get("/", () => `Hello 🚀`)
    .get("/api/uploadthing", ({request}) => handlers(request))
    .post("/api/uploadthing", ({request}) => handlers(request))
    .listen({
        hostname: import.meta.env.HOSTNAME,
        port: import.meta.env.PORT,
    })

export type App = typeof app
