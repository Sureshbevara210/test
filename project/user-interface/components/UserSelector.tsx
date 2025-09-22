import React from 'react';
import { Users } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
}

interface UserSelectorProps {
  users: User[];
  currentUser: User;
  onUserChange: (user: User) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ users, currentUser, onUserChange }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <Users className="w-5 h-5 text-gray-500" />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Current User</label>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const user = users.find(u => u.id === e.target.value);
              if (user) onUserChange(user);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};