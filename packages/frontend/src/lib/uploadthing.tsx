import {genUploader} from "uploadthing/client"
import type {UploadRouter} from "../../../backend/src/uploadthing"

export const {uploadFiles} = genUploader<UploadRouter>({
    url: import.meta.env.VITE_BACKEND,
})
