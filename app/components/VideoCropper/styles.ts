
import { StyleSheet } from 'react-native';
import constants from '@/constants';

const { VIDEO_HEIGHT } = constants;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoContainer: {
        height: VIDEO_HEIGHT,
        backgroundColor: '#000',
    },
    video: {
        flex: 1,
    },
    controlsContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    timestampContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 8,
    },
    timestampText: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'monospace',
    },
    durationText: {
        color: '#FFD700',
        fontSize: 12,
        fontFamily: 'monospace',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 20,
    },
    button: {
        padding: 12,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    playButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentTimeText: {
        color: '#FFD700',
        fontSize: 12,
        fontFamily: 'monospace',
        fontWeight: 'bold',
    },
});

export default styles;