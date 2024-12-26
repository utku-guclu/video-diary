// Initial state for the video store
const videos: { id: string; title: string; url: string; }[] = [];

// Function to add a video
export const addVideo = (video: { id: string; title: string; url: string; }) => {
    videos.push(video);
};

// Function to remove a video by ID
export const removeVideo = (id: string) => {
    const index = videos.findIndex(video => video.id === id);
    if (index !== -1) {
        videos.splice(index, 1);
    }
};

// Function to get the current list of videos
export const getVideos = () => {
    return videos;
};

import { useState } from 'react';

export const useVideoStore = () => {
    const [videos, setVideos] = useState(getVideos());

    const addNewVideo = (video: { id: string; title: string; url: string; }) => {
        addVideo(video);
        setVideos(getVideos()); // Update state after adding
    };

    const removeVideoById = (id: string) => {
        removeVideo(id);
        setVideos(getVideos()); // Update state after removal
    };

    return {
        videos,
        addNewVideo,
        removeVideoById,
    };
};
