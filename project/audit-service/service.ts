import { AuditLog, ServiceResponse } from '../common-libs/types';
import { generateId, formatTimestamp } from '../common-libs/utils';

export class AuditService {
  private logs: AuditLog[] = [];

  async logEvent(userId: string, action: string, metadata: Record<string, any> = {}): Promise<ServiceResponse<AuditLog>> {
    const log: AuditLog = {
      id: generateId(),
      userId,
      action,
      queryId: metadata.queryId,
      timestamp: formatTimestamp(),
      metadata
    };

    this.logs.push(log);

    return {
      success: true,
      data: log,
      timestamp: formatTimestamp()
    };
  }

  async getLogsByUser(userId: string): Promise<ServiceResponse<AuditLog[]>> {
    const userLogs = this.logs.filter(log => log.userId === userId);
    
    return {
      success: true,
      data: userLogs,
      timestamp: formatTimestamp()
    };
  }

  async getAllLogs(): Promise<ServiceResponse<AuditLog[]>> {
    return {
      success: true,
      data: this.logs,
      timestamp: formatTimestamp()
    };
  }

  async getRecentActivity(limit: number = 10): Promise<ServiceResponse<AuditLog[]>> {
    const recentLogs = this.logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return {
      success: true,
      data: recentLogs,
      timestamp: formatTimestamp()
    };
  }
}