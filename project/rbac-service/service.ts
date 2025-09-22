import { User, Document, ServiceResponse } from '../common-libs/types';
import { formatTimestamp } from '../common-libs/utils';

export class RBACService {
  private users: User[] = [
    {
      id: "user-1",
      email: "admin@company.com",
      role: "admin",
      permissions: ["read:all", "write:all", "admin:dashboard"]
    },
    {
      id: "user-2", 
      email: "engineer@company.com",
      role: "user",
      permissions: ["read:internal", "read:engineering"]
    },
    {
      id: "user-3",
      email: "guest@company.com", 
      role: "guest",
      permissions: ["read:public"]
    }
  ];

  async getUserById(userId: string): Promise<ServiceResponse<User>> {
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        error: "User not found",
        timestamp: formatTimestamp()
      };
    }

    return {
      success: true,
      data: user,
      timestamp: formatTimestamp()
    };
  }

  async filterDocumentsByPermissions(userId: string, documents: Document[]): Promise<ServiceResponse<Document[]>> {
    const userResult = await this.getUserById(userId);
    
    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        error: "Failed to get user permissions",
        timestamp: formatTimestamp()
      };
    }

    const user = userResult.data;
    const filteredDocs = documents.filter(doc => {
      const accessLevel = doc.metadata.accessLevel;
      
      // Admin can access everything
      if (user.role === 'admin') return true;
      
      // Public documents are accessible to everyone
      if (accessLevel === 'public') return true;
      
      // Check specific permissions
      return user.permissions.some(permission => 
        permission === `read:${accessLevel}` || permission === 'read:all'
      );
    });

    return {
      success: true,
      data: filteredDocs,
      timestamp: formatTimestamp()
    };
  }

  async checkPermission(userId: string, permission: string): Promise<ServiceResponse<boolean>> {
    const userResult = await this.getUserById(userId);
    
    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        error: "Failed to get user",
        timestamp: formatTimestamp()
      };
    }

    const hasPermission = userResult.data.permissions.includes(permission);
    
    return {
      success: true,
      data: hasPermission,
      timestamp: formatTimestamp()
    };
  }
}