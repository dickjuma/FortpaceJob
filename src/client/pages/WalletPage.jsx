import React, { useEffect, useState } from 'react';
import { walletAPI } from '../../common/services/api';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [walletData, txData] = await Promise.all([
        walletAPI.getWallet(),
        walletAPI.getTransactions()
      ]);
      setWallet(walletData.wallet || walletData.data);
      setTransactions(txData.transactions || txData.data || []);
    } catch (err) {
      setError('Failed to load wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading wallet...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Wallet</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl shadow p-6 text-white">
          <h2 className="text-lg font-medium text-brand-100">Available Balance</h2>
          <p className="text-3xl font-bold mt-2">${wallet?.balance || '0.00'}</p>
          <button className="mt-4 bg-white text-brand-700 px-4 py-2 rounded-md font-medium text-sm hover:bg-brand-50 transition-colors">
            Deposit Funds
          </button>
        </div>
        <div className="bg-white dark:bg-surface-dark-secondary rounded-xl shadow p-6">
          <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">Locked in Escrow</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${wallet?.escrowBalance || '0.00'}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold dark:text-white mb-4">Recent Transactions</h2>
      <div className="bg-white dark:bg-surface-dark-secondary rounded-xl shadow overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No transactions yet.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-surface dark:bg-surface-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {tx.type} - {tx.description || 'Transaction'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {tx.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
