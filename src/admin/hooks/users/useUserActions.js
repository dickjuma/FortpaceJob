import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  suspendUserApi,
  restrictUserApi, 
  activateUserApi, 
  banUserApi, 
  verifyKycApi, 
  freezeWalletApi 
} from '../../api/users/users.api.js';
import { createAdminApi, assignRoleApi } from '../../api/users/admins.api.js';

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

  const flagUser = useMutation({
    mutationFn: ({ userId, reason }) => suspendUserApi(userId, { reason, flag: true }),
    onSuccess: () => {
      invalidateUsers();
      toast.success('User flagged successfully');
    },
    onError: (error) => toast.error(error.message || 'Failed to flag user'),
  });

  const assignRole = useMutation({
    mutationFn: ({ userId, role, permissions }) => assignRoleApi(userId, role, permissions),
    onSuccess: () => {
      invalidateUsers();
      toast.success('Role assigned successfully');
    },
    onError: (error) => toast.error(error.message || 'Failed to assign role'),
  });

  const createAdmin = useMutation({
    mutationFn: (data) => createAdminApi(data),
    onSuccess: () => {
      invalidateUsers();
      toast.success('Administrator created successfully');
    },
    onError: (error) => toast.error(error.message || 'Failed to create administrator'),
  });

  return { 
    suspendUser, 
    activateUser, 
    banUser, 
    verifyKyc, 
    freezeWallet,
    flagUser,
    assignRole, 
    createAdmin 
  };
}
