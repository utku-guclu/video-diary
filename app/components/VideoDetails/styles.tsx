import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    notFoundContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notFoundText: {
      fontSize: 18,
      color: '#666',
    },
    videoContainer: {
      width: '100%',
      backgroundColor: 'black',
    },
    videoContainerLandscape: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    video: {
      width: '100%',
      height: '100%',
    },
    detailsPanel: {
      flex: 1,
      padding: 16,
    },
    detailsPanelLandscape: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 2,
    },
    dragHandle: {
      width: 40,
      height: 5,
      opacity: 0.5,
      borderRadius: 2.5,
      alignSelf: 'center',
      marginBottom: 10,
    },
    detailsContent: {
      gap: 16,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      flex: 1,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 16,
    },
    actionButton: {
      padding: 4,
    },
    metadataContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginTop: 8,
    },
    metadataItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metadataText: {
      marginLeft: 4,
      opacity: 0.7,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
    },
  });

  export default styles;