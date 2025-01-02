import React from "react";
import { Text } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { TouchableOpacity } from "react-native";


export default function CustomButton({ text, onClose }: { onClose: () => void, text?: string }) {
    const theme = useTheme();
    return (
        <TouchableOpacity
            onPress={onClose}
            className="p-4 self-end rounded-xl"
            style={{ backgroundColor: theme.colors.surface }}
        >
            <Text style={{ color: theme.colors.primary }}>{text || "Cancel"}</Text>
        </TouchableOpacity>
    )
}