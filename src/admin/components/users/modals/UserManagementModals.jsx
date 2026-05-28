import React from 'react';
import useUserManagementStore from '../../../store/userManagementStore';
import CreateAdminModal from './CreateAdminModal';
import SuspendUserModal from './SuspendUserModal';
import EditUserModal from './EditUserModal';
import UserProfileModal from '../UserProfileModal';
import UserRankingModal from '../UserRankingModal';
import UserFlagModal from '../UserFlagModal';

/**
 * Global component to render the active user management modal.
 */
const UserManagementModals = () => {
  const { activeModal, closeModal, modalTargetUser } = useUserManagementStore();

  if (!activeModal) return null;

  return (
    <>
      <CreateAdminModal />
      <SuspendUserModal />
      <EditUserModal />
      
      {/* High Fidelity Modals */}
      <UserProfileModal 
        isOpen={activeModal === 'VIEW_PROFILE'} 
        onClose={closeModal} 
        user={modalTargetUser}
        onAction={(type, user) => {
          // This allows the profile modal to trigger ranking/flagging
          const modalMap = {
            'ranking': 'ADJUST_RANKING',
            'flag': 'FLAG_USER',
            'profile': 'VIEW_PROFILE'
          };
          useUserManagementStore.getState().openModal(modalMap[type], user);
        }}
      />
      
      <UserRankingModal 
        isOpen={activeModal === 'ADJUST_RANKING'} 
        onClose={closeModal} 
        user={modalTargetUser} 
      />
      
      <UserFlagModal 
        isOpen={activeModal === 'FLAG_USER'} 
        onClose={closeModal} 
        user={modalTargetUser} 
      />

      {/* Special case for Suspend/Ban using the generic Flag modal if preferred, 
          but we have dedicated ones too. Mapping them to the new ones for consistency. */}
      {activeModal === 'BAN_USER' && (
        <UserFlagModal 
          isOpen={true} 
          onClose={closeModal} 
          user={modalTargetUser} 
        />
      )}
    </>
  );
};

export default UserManagementModals;
