import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';
import DocumentUploader from '../DocumentUploader';
import { pick, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { check, request, RESULTS } from 'react-native-permissions';

// Mock dependencies
jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  isErrorWithCode: jest.fn(),
  errorCodes: {
    OPERATION_CANCELED: 'OPERATION_CANCELED',
    UNABLE_TO_OPEN_FILE_TYPE: 'UNABLE_TO_OPEN_FILE_TYPE',
    IN_PROGRESS: 'IN_PROGRESS',
  },
  types: {
    allFiles: 'allFiles',
    images: 'images',
    pdf: 'pdf',
  },
}));

jest.mock('@theme/ThemeProvider', () => ({
  useThemeContext: () => ({
    theme: {
      colors: { text: 'black', secondary: 'grey', lableText: 'green', red: 'red' },
    },
  }),
}));

jest.mock('react-native-permissions', () => ({
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
  openSettings: jest.fn(),
  PERMISSIONS: {
    IOS: { PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY' },
    ANDROID: { 
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
      READ_MEDIA_IMAGES: 'android.permission.READ_MEDIA_IMAGES'
    },
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    BLOCKED: 'blocked',
  },
}));

describe('DocumentUploader - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handles permission denied gracefully by offering OS settings link', async () => {
    check.mockResolvedValueOnce(RESULTS.DENIED);
    request.mockResolvedValueOnce(RESULTS.BLOCKED);

    const { getByText } = render(
      <DocumentUploader label="Upload ID" onUpload={jest.fn()} />
    );

    fireEvent.press(getByText('Upload ID'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permission Required',
        'Storage permission is needed to upload documents. Please enable it in Settings.',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Open Settings' })
        ])
      );
    });
  });

  it('handles successful document selection and returns correctly formatted object', async () => {
    const mockOnUpload = jest.fn();
    const mockFile = {
      fileCopyUri: 'file://document/path.pdf',
      type: 'application/pdf',
      name: 'policy.pdf',
      size: 1024,
    };

    pick.mockResolvedValueOnce([mockFile]);

    const { getByText } = render(
      <DocumentUploader label="Upload ID" onUpload={mockOnUpload} />
    );

    fireEvent.press(getByText('Upload ID'));

    await waitFor(() => {
      expect(pick).toHaveBeenCalled();
      expect(mockOnUpload).toHaveBeenCalledWith({
        uri: 'file://document/path.pdf',
        type: 'application/pdf',
        name: 'policy.pdf',
        size: 1024,
      });
    });
  });

  it('handles OPERATION_CANCELED correctly', async () => {
    const mockError = new Error('Canceled');
    mockError.code = 'OPERATION_CANCELED';
    pick.mockRejectedValueOnce(mockError);
    isErrorWithCode.mockReturnValueOnce(true);

    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

    const { getByText } = render(
      <DocumentUploader label="Upload ID" onUpload={jest.fn()} />
    );

    fireEvent.press(getByText('Upload ID'));

    await waitFor(() => {
      expect(spyConsoleLog).toHaveBeenCalledWith('User canceled document picker');
    });

    spyConsoleLog.mockRestore();
  });

  it('handles UNABLE_TO_OPEN_FILE_TYPE correctly', async () => {
    const mockError = new Error('Unsupported');
    mockError.code = 'UNABLE_TO_OPEN_FILE_TYPE';
    pick.mockRejectedValueOnce(mockError);
    isErrorWithCode.mockReturnValueOnce(true);

    const { getByText } = render(
      <DocumentUploader label="Upload ID" onUpload={jest.fn()} />
    );

    fireEvent.press(getByText('Upload ID'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Unsupported File',
        'This file type cannot be opened on this platform.'
      );
    });
  });

  it('handles unknown general picker errors', async () => {
    pick.mockRejectedValueOnce(new Error('Random Crash'));
    isErrorWithCode.mockReturnValueOnce(false);

    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = render(
      <DocumentUploader label="Upload ID" onUpload={jest.fn()} />
    );

    fireEvent.press(getByText('Upload ID'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Unexpected issue occurred.'
      );
    });
    
    spyConsoleError.mockRestore();
  });
});
