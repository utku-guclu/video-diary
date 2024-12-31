import '@testing-library/jest-native/extend-expect';

global.React = require('react');

// Mock required native modules
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
}));

jest.mock('expo-constants', () => ({
    manifest: {
        scheme: 'your-scheme'
    }
}));
