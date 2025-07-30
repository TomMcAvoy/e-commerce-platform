import mongoose from 'mongoose';
import User from '../models/User';

export interface Notification {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  type: 'post_recategorized' | 'post_moderated' | 'post_approved' | 'post_removed' | 'content_rewritten';
  title: string;
  message: string;
  postId?: mongoose.Types.ObjectId;
  originalCategory?: string;
  newCategory?: string;
  originalContent?: string;
  moderatedContent?: string;
  read: boolean;
  createdAt: Date;
}

export class NotificationService {
  
  /**
   * Send notification about post recategorization
   */
  static async notifyPostRecategorized(
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    originalCategory: string,
    newCategory: string,
    reason?: string
  ): Promise<void> {
    try {
      const message = reason || 
        `Your post has been moved from "${originalCategory}" to "${newCategory}" to help other users find it more easily.`;
      
      await this.createNotification({
        userId,
        postId,
        type: 'post_recategorized',
        title: 'Post Moved to Better Category',
        message,
        originalCategory,
        newCategory,
        read: false,
        createdAt: new Date()
      });

      // Optionally send email notification
      await this.sendEmailNotification(userId, 'Post Recategorized', message);
      
    } catch (error) {
      console.error('Failed to send recategorization notification:', error);
    }
  }

  /**
   * Send notification about content moderation/rewriting
   */
  static async notifyContentModerated(
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    originalContent: string,
    moderatedContent: string,
    reason: string = 'Content was rewritten to maintain community standards'
  ): Promise<void> {
    try {
      const message = `${reason}. Your message has been updated to be more professional and community-friendly.`;
      
      await this.createNotification({
        userId,
        postId,
        type: 'content_rewritten',
        title: 'Post Content Updated',
        message,
        originalContent,
        moderatedContent,
        read: false,
        createdAt: new Date()
      });

      // Optionally send email notification
      await this.sendEmailNotification(userId, 'Content Updated', message);
      
    } catch (error) {
      console.error('Failed to send moderation notification:', error);
    }
  }

  /**
   * Send notification about post approval
   */
  static async notifyPostApproved(
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId
  ): Promise<void> {
    try {
      const message = 'Your post has been approved and is now visible to the community!';
      
      await this.createNotification({
        userId,
        postId,
        type: 'post_approved',
        title: 'Post Approved',
        message,
        read: false,
        createdAt: new Date()
      });
      
    } catch (error) {
      console.error('Failed to send approval notification:', error);
    }
  }

  /**
   * Send notification about post removal
   */
  static async notifyPostRemoved(
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    reason: string
  ): Promise<void> {
    try {
      const message = `Your post has been removed. Reason: ${reason}. Please review our community guidelines.`;
      
      await this.createNotification({
        userId,
        postId,
        type: 'post_removed',
        title: 'Post Removed',
        message,
        read: false,
        createdAt: new Date()
      });

      await this.sendEmailNotification(userId, 'Post Removed', message);
      
    } catch (error) {
      console.error('Failed to send removal notification:', error);
    }
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(
    userId: mongoose.Types.ObjectId,
    limit: number = 20,
    offset: number = 0
  ): Promise<Notification[]> {
    try {
      // In a real implementation, you'd have a Notification model
      // For now, we'll return mock data or implement a simple storage
      return await this.getStoredNotifications(userId, limit, offset);
    } catch (error) {
      console.error('Failed to get user notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      // Implementation would update the notification in database
      console.log(`Marking notification ${notificationId} as read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number> {
    try {
      const notifications = await this.getStoredNotifications(userId);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Private method to create notification
   * In production, this should save to a Notification model
   */
  private static async createNotification(notification: Notification): Promise<void> {
    // For now, we'll log the notification
    // In production, save to database:
    // await NotificationModel.create(notification);
    
    console.log('📢 Notification created:', {
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message
    });
    
    // Store in memory for demo (replace with database in production)
    await this.storeNotification(notification);
  }

  /**
   * Private method to send email notification
   */
  private static async sendEmailNotification(
    userId: mongoose.Types.ObjectId,
    subject: string,
    message: string
  ): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user || !user.email) return;

      // In production, integrate with email service (SendGrid, AWS SES, etc.)
      console.log(`📧 Email notification sent to ${user.email}:`, {
        subject,
        message
      });
      
      // Example implementation:
      // await emailService.send({
      //   to: user.email,
      //   subject,
      //   html: `<p>${message}</p>`
      // });
      
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  /**
   * Store notification in memory (replace with database in production)
   */
  private static notifications: Map<string, Notification[]> = new Map();

  private static async storeNotification(notification: Notification): Promise<void> {
    const userId = notification.userId.toString();
    const userNotifications = this.notifications.get(userId) || [];
    
    notification._id = new mongoose.Types.ObjectId().toString();
    userNotifications.unshift(notification);
    
    // Keep only last 100 notifications per user
    if (userNotifications.length > 100) {
      userNotifications.splice(100);
    }
    
    this.notifications.set(userId, userNotifications);
  }

  private static async getStoredNotifications(
    userId: mongoose.Types.ObjectId,
    limit: number = 20,
    offset: number = 0
  ): Promise<Notification[]> {
    const userNotifications = this.notifications.get(userId.toString()) || [];
    return userNotifications.slice(offset, offset + limit);
  }

  /**
   * Clean up old notifications (call this periodically)
   */
  static async cleanupOldNotifications(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    for (const [userId, notifications] of this.notifications.entries()) {
      const filteredNotifications = notifications.filter(
        n => n.createdAt > cutoffDate
      );
      this.notifications.set(userId, filteredNotifications);
    }
    
    console.log(`🧹 Cleaned up notifications older than ${daysOld} days`);
  }
}