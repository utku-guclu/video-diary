// Import necessary testing utilities and components
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../app/components/Home';
import * as ImagePicker from 'expo-image-picker';

// Mock the ImagePicker module to simulate device permissions and video selection
jest.mock('expo-image-picker', () => ({
  // Mock permission request to always return granted
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  // Mock video picker to return a test video asset
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'test-uri', type: 'video' }]
  })
}));

// Group related tests for the Home screen component
describe('Home Screen', () => {
  // Test 1: Verify all main UI elements are rendered
  it('renders main elements correctly', () => {
    const { getByText } = render(<Home />);
    // Check for presence of key text elements
    getByText('Video Diary');
    getByText('Your Video Collection');
    getByText('+');
  });

  // Test 2: Verify empty state messaging
  it('shows empty state message when no videos', () => {
    const { getByText } = render(<Home />);
    // Confirm empty state message is displayed
    getByText('No videos yet. Start by adding one!');
  });

  // Test 3: Verify video addition workflow
  it('handles add video button press', async () => {
    const { getByText } = render(<Home />);
    // Find and trigger the add button
    const addButton = getByText('+');
    await fireEvent.press(addButton);
    // Verify permission request was made
    expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
  });
});
