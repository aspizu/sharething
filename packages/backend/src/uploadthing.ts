import {createUploadthing, type FileRouter} from "uploadthing/server"

const f = createUploadthing()

export const uploadRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    uploader: f(["image", "video", "text", "blob", "audio"]).onUploadComplete(
        (data) => {
            console.log("upload completed", data)
        },
    ),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
