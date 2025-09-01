import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../utils/test-utils';
import UserProfile from '../UserProfile';
import { getUser, updateUser, deleteUser } from '../../../lib/firestore';
import { deleteUser as deleteAuthUser } from 'firebase/auth';

// Mock the firestore functions
jest.mock('../../../lib/firestore');
jest.mock('firebase/auth');

const mockedGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockedUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>;
const mockedDeleteUser = deleteUser as jest.MockedFunction<typeof deleteUser>;
const mockedDeleteAuthUser = deleteAuthUser as jest.MockedFunction<typeof deleteAuthUser>;

const mockUser = {
  id: 'user123',
  email: 'test@example.com',
  name: 'John Doe',
  address: '123 Main St, City, State 12345',
  phone: '+1-555-123-4567',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockAuthUser = {
  uid: 'user123',
  email: 'test@example.com'
};

describe('UserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.confirm = jest.fn(() => true);
    mockedGetUser.mockResolvedValue(mockUser);
    mockedUpdateUser.mockResolvedValue(undefined);
    mockedDeleteUser.mockResolvedValue(undefined);
    mockedDeleteAuthUser.mockResolvedValue(undefined);
  });

  const preloadedState = {
    auth: { user: mockAuthUser, loading: false }
  };

  describe('Component Rendering', () => {
    it('displays loading state initially', () => {
      mockedGetUser.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderWithProviders(<UserProfile />, { preloadedState });
      
      expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    });

    it('displays user profile information after loading', async () => {
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('123 Main St, City, State 12345')).toBeInTheDocument();
        expect(screen.getByDisplayValue('+1-555-123-4567')).toBeInTheDocument();
      });
    });

    it('shows Edit Profile button when not editing', async () => {
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });
    });

    it('shows Save Changes and Cancel buttons when editing', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });
      
      const editButton = screen.getByText('Edit Profile');
      await user.click(editButton);
      
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('shows Delete Account button', async () => {
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });
    });

    it('displays error message when user fetch fails', async () => {
      mockedGetUser.mockRejectedValue(new Error('Failed to fetch user'));
      
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load user data')).toBeInTheDocument();
      });
    });

    it('shows "User not found" when user does not exist', async () => {
      mockedGetUser.mockResolvedValue(null);
      
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('User not found')).toBeInTheDocument();
      });
    });

    it('handles missing optional fields (address and phone)', async () => {
      const userWithoutOptionalFields = {
        ...mockUser,
        address: undefined,
        phone: undefined
      };
      mockedGetUser.mockResolvedValue(userWithoutOptionalFields);
      
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getAllByDisplayValue('Not provided')).toHaveLength(2);
      });
    });
  });

  describe('Edit Mode Functionality', () => {
    it('enables form fields when entering edit mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });
      
      const editButton = screen.getByText('Edit Profile');
      await user.click(editButton);
      
      const nameInput = screen.getByDisplayValue('John Doe');
      expect(nameInput).not.toBeDisabled();
      
      const addressTextarea = screen.getByDisplayValue('123 Main St, City, State 12345');
      expect(addressTextarea).not.toBeDisabled();
      
      const phoneInput = screen.getByDisplayValue('+1-555-123-4567');
      expect(phoneInput).not.toBeDisabled();
    });

    it('allows editing form fields', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });
      
      const editButton = screen.getByText('Edit Profile');
      await user.click(editButton);
      
      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'Jane Doe');
      
      expect(nameInput).toHaveValue('Jane Doe');
    });

    it('cancels edit mode and resets form data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });
      
      const editButton = screen.getByText('Edit Profile');
      await user.click(editButton);
      
      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'Changed Name');
      
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);
      
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      });
    });
  });

  describe('Save Functionality', () => {
    it('saves updated user information', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });
      
      const editButton = screen.getByText('Edit Profile');
      await user.click(editButton);
      
      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'Jane Doe');
      
      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);
      
      await waitFor(() => {
        expect(mockedUpdateUser).toHaveBeenCalledWith('user123', {
          name: 'Jane Doe',
          address: '123 Main St, City, State 12345',
          phone: '+1-555-123-4567'
        });
      });
      
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('handles save error', async () => {
      const user = userEvent.setup();
      mockedUpdateUser.mockRejectedValue(new Error('Save failed'));
      
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });
      
      const editButton = screen.getByText('Edit Profile');
      await user.click(editButton);
      
      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Save failed')).toBeInTheDocument();
      });
    });

    it('updates local state after successful save', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      });
      
      const editButton = screen.getByText('Edit Profile');
      await user.click(editButton);
      
      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');
      
      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Updated Name')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Account Functionality', () => {
    it('deletes account when confirmed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByText('Delete Account');
      await user.click(deleteButton);
      
      await waitFor(() => {
        expect(mockedDeleteUser).toHaveBeenCalledWith('user123');
        expect(mockedDeleteAuthUser).toHaveBeenCalledWith(mockAuthUser);
      });
    });

    it('does not delete account when not confirmed', async () => {
      const user = userEvent.setup();
      global.confirm = jest.fn(() => false);
      
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByText('Delete Account');
      await user.click(deleteButton);
      
      expect(mockedDeleteUser).not.toHaveBeenCalled();
      expect(mockedDeleteAuthUser).not.toHaveBeenCalled();
    });

    it('handles delete account error', async () => {
      const user = userEvent.setup();
      mockedDeleteUser.mockRejectedValue(new Error('Delete failed'));
      
      renderWithProviders(<UserProfile />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByText('Delete Account');
      await user.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByText('Delete failed')).toBeInTheDocument();
      });
    });
  });

  describe('No Auth User', () => {
    it('does not render when no authenticated user', () => {
      const noAuthState = { auth: { user: null, loading: false } };
      renderWithProviders(<UserProfile />, { preloadedState: noAuthState });
      
      expect(screen.queryByText('User Profile')).not.toBeInTheDocument();
    });
  });
});