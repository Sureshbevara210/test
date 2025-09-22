import React, { useState, useEffect } from 'react';
import { MessageSquare, Settings, BarChart3 } from 'lucide-react';
import { QueryAPIService } from '../query-api/service';
import { ChatInterface } from '../user-interface/components/ChatInterface';
import { AdminDashboard } from '../user-interface/components/AdminDashboard';
import { UserSelector } from '../user-interface/components/UserSelector';

function App() {
  const [queryService] = useState(() => new QueryAPIService());
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');
  const [currentUser, setCurrentUser] = useState({
    id: "user-1",
    email: "admin@company.com",
    role: "admin"
  });
  
  const [users] = useState([
    { id: "user-1", email: "admin@company.com", role: "admin" },
    { id: "user-2", email: "engineer@company.com", role: "user" },
    { id: "user-3", email: "guest@company.com", role: "guest" }
  ]);

  const handleSendMessage = async (message: string) => {
    try {
      const response = await queryService.processQuery(currentUser.id, message);
      return response.success ? response.data || null : null;
    } catch (error) {
      console.error('Query failed:', error);
      return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">BA AGENT</h1>
          <p className="text-sm text-gray-500 mt-1">Microservices Demo</p>
        </div>
        
        <nav className="mt-6">
          <button
            onClick={() => setCurrentView('chat')}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
              currentView === 'chat' 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat Interface</span>
          </button>
          
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                currentView === 'admin' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200 bg-white">
          <div className="text-sm">
            <p className="font-medium text-gray-900">{currentUser.email}</p>
            <p className="text-gray-500 capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* User Selector */}
        <UserSelector 
          users={users}
          currentUser={currentUser}
          onUserChange={setCurrentUser}
        />

        {/* Content Area */}
        <div className="flex-1">
          {currentView === 'chat' ? (
            <ChatInterface 
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
            />
          ) : (
            <AdminDashboard queryService={queryService} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;