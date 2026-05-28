import React, { useState } from 'react';

export default function NotificationsPage() {
  const [notifications] = useState([
    { id: 1, type: 'info', message: 'Welcome to Forte Marketplace!', date: new Date().toISOString() },
    { id: 2, type: 'success', message: 'Your profile has been approved.', date: new Date().toISOString() }
  ]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Notifications</h1>
      </div>

      <div className="bg-white dark:bg-surface-dark-secondary rounded-xl shadow overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            You have no new notifications.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map(notif => (
              <li key={notif.id} className="p-6 hover:bg-surface dark:hover:bg-surface-dark transition-colors">
                <div className="flex items-start">
                  <div className={`w-2 h-2 mt-2 rounded-full mr-4 ${notif.type === 'success' ? 'bg-green-500' : 'bg-brand-500'}`} />
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{notif.message}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(notif.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
