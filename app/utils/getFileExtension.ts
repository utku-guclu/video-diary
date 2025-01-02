import { VideoExtension } from "@/types";

export default function getFileExtension(uri: string): VideoExtension {
    const extension = uri.split('.').pop()?.toLowerCase();
    return extension as VideoExtension;
}