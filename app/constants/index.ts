import { Dimensions } from "react-native";

// Constants for dimensions and configurations
const WINDOW_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const TIMELINE_HEIGHT = 80;
const ACTIVE_AREA_WIDTH = WINDOW_WIDTH;
const MAX_DURATION = 5; // Maximum segment duration in seconds
const VIDEO_HEIGHT = SCREEN_HEIGHT * 0.7; // 70% of screen height

export default {
    WINDOW_WIDTH,
    TIMELINE_HEIGHT,
    ACTIVE_AREA_WIDTH,
    MAX_DURATION,
    SCREEN_HEIGHT,
    VIDEO_HEIGHT
};