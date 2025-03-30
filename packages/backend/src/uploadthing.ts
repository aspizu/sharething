import {createUploadthing, type FileRouter} from "uploadthing/server"

const f = createUploadthing()

const options = {
    maxFileSize: "64MB",
    maxFileCount: 100,
} as const

export const uploadRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    uploader: f({
        image: options,
        video: options,
        text: options,
        blob: options,
        audio: options,
    }).onUploadComplete((data) => {}),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
