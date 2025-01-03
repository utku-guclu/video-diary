import { StyleSheet } from 'react-native';
import constants from "@/constants";

const { WINDOW_WIDTH, TIMELINE_HEIGHT } = constants;

const styles = StyleSheet.create({
    container: {
        height: TIMELINE_HEIGHT,
        width: WINDOW_WIDTH,
        backgroundColor: '#000',
        position: 'relative',
    },
    thumbnail: {
        height: '100%',
        width: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    selection: {
        position: 'absolute',
        top: 0,
        height: '100%',
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    timeIndicator: {
        position: 'absolute',
        width: 3,
        height: '100%',
        backgroundColor: '#FFD700',
        zIndex: 10,
    },
});

export default styles;