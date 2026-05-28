import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  suspendUserApi, 
  activateUserApi, 
  banUserApi, 
  verifyKycApi, 
  freezeWalletApi 
} from '../../api/users/users.api';

export function useUserActions() {
  const queryClient = useQueryClient();

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const suspendUser = useMutation({
    mutationFn: ({ userId, reason, duration }) => suspendUserApi(userId, { reason, duration }),
    onSuccess: () => {
      invalidateUsers();
      toast.success('User suspended successfully');
    },
    onError: (error) => toast.error(error.message || 'Failed to suspend user'),
  });

  const activateUser = useMutation({
    mutationFn: ({ userId }) => activateUserApi(userId),
    onSuccess: () => {
      invalidateUsers();
      toast.success('User activated successfully');
    },
    onError: (error) => toast.error(error.message || 'Failed to activate user'),
  });

  const banUser = useMutation({
    mutationFn: ({ userId, reason }) => banUserApi(userId, { reason }),
    onSuccess: () => {
      invalidateUsers();
      toast.success('User banned permanently');
    },
    onError: (error) => toast.error(error.message || 'Failed to ban user'),
  });

  const verifyKyc = useMutation({
    mutationFn: ({ userId, status, notes }) => verifyKycApi(userId, { status, notes }),
    onSuccess: () => {
      invalidateUsers();
      toast.success('KYC status updated');
    },
    onError: (error) => toast.error(error.message || 'Failed to update KYC'),
  });

  const freezeWallet = useMutation({
    mutationFn: ({ userId, reason, duration }) => freezeWalletApi(userId, { reason, duration }),
    onSuccess: () => {
      invalidateUsers();
      toast.success('Wallet frozen successfully');
    },
    onError: (error) => toast.error(error.message || 'Failed to freeze wallet'),
  });

  const unsupportedAdminMutation = async () => {
    throw new Error('This admin operation is not exposed by the current backend API.');
  };

  const assignRole = useMutation({
    mutationFn: unsupportedAdminMutation,
    onError: (error) => toast.error(error.message || 'Failed to assign role'),
  });

  const createAdmin = useMutation({
    mutationFn: unsupportedAdminMutation,
    onError: (error) => toast.error(error.message || 'Failed to create administrator'),
  });

  return { 
    suspendUser, 
    activateUser, 
    banUser, 
    verifyKyc, 
    freezeWallet, 
    assignRole, 
    createAdmin 
  };
}
