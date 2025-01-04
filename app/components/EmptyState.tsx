import { View, Text, useWindowDimensions, AccessibilityInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import { scale, verticalScale } from 'react-native-size-matters';
import React from 'react';

interface EmptyStateProps {
    isCollectionTab: boolean;
    onPress?: () => void;
}

const EmptyState = ({ isCollectionTab, onPress }: EmptyStateProps) => {
    const theme = useTheme();
    const { width } = useWindowDimensions();

    // Dynamic scaling based on screen size
    const iconSize = scale(64);
    const titleSize = scale(18);
    const subtitleSize = scale(14);

    const title = isCollectionTab ? "No Videos in Collection" : "Start Your Video Diary";
    const subtitle = isCollectionTab 
        ? "Start building your collection by selecting and cropping 5-second highlights from your video diary" 
        : "Tap the + button to add your first video memory";

    return (
        <View 
            className="flex-1 items-center justify-center p-8"
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel={`${title}. ${subtitle}`}
            accessibilityHint={isCollectionTab 
                ? "Shows empty collection state" 
                : "Shows empty diary state"}
        >
            <Ionicons
                name={isCollectionTab ? "film-outline" : "videocam-outline"}
                size={iconSize}
                color={theme.colors.muted}
                style={{ marginBottom: verticalScale(20) }}
                accessibilityElementsHidden={true}
                importantForAccessibility="no"
            />
            
            <Text 
                style={{ 
                    color: theme.colors.text,
                    fontSize: titleSize,
                    fontWeight: '600',
                    marginBottom: verticalScale(8),
                    textAlign: 'center'
                }}
                accessibilityRole="header"
            >
                {title}
            </Text>

            <Text
                style={{
                    color: theme.colors.muted,
                    fontSize: subtitleSize,
                    textAlign: 'center',
                    lineHeight: verticalScale(20),
                    maxWidth: width * 0.8
                }}
                accessibilityRole="text"
            >
                {subtitle}
            </Text>
        </View>
    );
};

// Memoize component for performance
export default React.memo(EmptyState);
