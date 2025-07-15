// Data persistence service using localStorage
// In a real app, this would be replaced with API calls to a backend database

export interface StorageData {
  communityPosts: any[];
  resources: any[];
  partners: any[];
  ngos: any[];
  supportGroups: any[];
  events: any[];
  lastUpdated: string;
}

class DataPersistenceService {
  private readonly STORAGE_KEY = 'wmh_shared_app_data'; // Shared across all users
  private readonly VERSION_KEY = 'wmh_shared_data_version';
  private readonly CURRENT_VERSION = '1.0.0';

  // Initialize with default data
  private getDefaultData(): StorageData {
    return {
      communityPosts: [
        {
          id: '1',
          title: 'Welcome to Our Community',
          content: 'This is a safe space for all women to share their mental health journey. We believe in supporting each other through every step of our healing process.',
          author: 'Admin',
          category: 'announcement',
          tags: ['welcome', 'community'],
          isPublished: true,
          createdAt: '2025-01-10T10:00:00.000Z',
          updatedAt: '2025-01-10T10:00:00.000Z',
          likes: 45,
          replies: 12
        },
        {
          id: '2',
          title: 'Mental Health Awareness Week',
          content: 'Join us for a week of activities focused on mental health awareness. We have workshops, group sessions, and expert talks planned.',
          author: 'Admin',
          category: 'announcement',
          tags: ['awareness', 'events'],
          isPublished: true,
          createdAt: '2025-01-08T14:30:00.000Z',
          updatedAt: '2025-01-08T14:30:00.000Z',
          likes: 32,
          replies: 8
        },
        {
          id: '3',
          title: 'Celebrating Small Victories',
          content: 'Remember that every small step forward is a victory worth celebrating. Share your wins, no matter how small they might seem!',
          author: 'Dr. Sarah Johnson',
          category: 'support',
          tags: ['motivation', 'progress'],
          isPublished: true,
          createdAt: '2025-01-11T09:15:00.000Z',
          updatedAt: '2025-01-11T09:15:00.000Z',
          likes: 67,
          replies: 23
        }
      ],
      resources: [
        {
          id: '1',
          title: 'Mindfulness Meditation Guide',
          description: 'A comprehensive guide to mindfulness meditation for beginners',
          content: 'Learn the basics of mindfulness meditation with step-by-step instructions...',
          category: 'self-care',
          type: 'article',
          imageUrl: 'https://i.pinimg.com/736x/12/29/15/1229152f0c674df114d92cfe2bcbcc30.jpg',
          tags: ['meditation', 'mindfulness', 'beginner'],
          isPublished: true,
          createdAt: '2025-01-09T16:20:00.000Z',
          updatedAt: '2025-01-09T16:20:00.000Z',
          views: 234,
          rating: 4.8
        },
        {
          id: '2',
          title: 'Crisis Support Hotlines',
          description: 'Emergency contact numbers for mental health crisis support',
          content: 'Important phone numbers and resources for crisis situations...',
          category: 'crisis',
          type: 'article',
          tags: ['crisis', 'emergency', 'support'],
          isPublished: true,
          createdAt: '2025-01-07T11:45:00.000Z',
          updatedAt: '2025-01-07T11:45:00.000Z',
          views: 156,
          rating: 4.9
        },
        {
          id: '3',
          title: 'Breathing Exercises for Anxiety',
          description: 'Simple breathing techniques to help manage anxiety',
          content: 'These proven breathing exercises can help calm your mind...',
          category: 'self-care',
          type: 'video',
          url: 'https://example.com/breathing-video',
          imageUrl: 'https://i.pinimg.com/736x/95/3d/6d/953d6d0c48de448247870ed5740e4b7e.jpg',
          tags: ['anxiety', 'breathing', 'techniques'],
          isPublished: true,
          createdAt: '2025-01-11T13:30:00.000Z',
          updatedAt: '2025-01-11T13:30:00.000Z',
          views: 89,
          rating: 4.7
        }
      ],
      partners: [
        {
          id: '1',
          name: 'MindCare Therapy Center',
          description: 'Professional therapy services specializing in women\'s mental health',
          logo: 'https://via.placeholder.com/100x100',
          website: 'https://mindcare.com',
          contactEmail: 'info@mindcare.com',
          contactPhone: '+1-555-0123',
          services: ['Individual Therapy', 'Group Therapy', 'Crisis Intervention'],
          location: 'New York, NY',
          isActive: true,
          createdAt: '2025-01-05T08:00:00.000Z',
          updatedAt: '2025-01-05T08:00:00.000Z'
        },
        {
          id: '2',
          name: 'Wellness First Clinic',
          description: 'Holistic approach to mental health and wellness',
          logo: 'https://via.placeholder.com/100x100',
          website: 'https://wellnessfirst.com',
          contactEmail: 'contact@wellnessfirst.com',
          services: ['Counseling', 'Meditation Classes', 'Support Groups'],
          location: 'Los Angeles, CA',
          isActive: true,
          createdAt: '2025-01-03T12:00:00.000Z',
          updatedAt: '2025-01-03T12:00:00.000Z'
        }
      ],
      ngos: [
        {
          id: '1',
          name: 'Women\'s Mental Health Alliance',
          description: 'Supporting women through mental health challenges with comprehensive care and community support',
          mission: 'To provide accessible mental health resources and support for all women',
          logo: '',
          website: 'https://wmha.org',
          email: 'info@wmha.org',
          phone: '+1-555-0456',
          address: '123 Support St, Care City, CC 12345',
          services: ['Counseling', 'Support Groups', 'Educational Workshops', 'Crisis Intervention'],
          isVerified: true,
          isActive: true,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          name: 'Mindful Mothers Foundation',
          description: 'Specialized support for maternal mental health and postpartum wellness',
          mission: 'Empowering mothers through their mental health journey with specialized care and peer support',
          logo: '',
          website: 'https://mindful-mothers.org',
          email: 'support@mindful-mothers.org',
          phone: '+1-555-0789',
          address: '456 Wellness Ave, Healing Heights, HH 67890',
          services: ['Postpartum Support', 'Maternal Counseling', 'Family Therapy', 'Peer Support Groups'],
          isVerified: true,
          isActive: true,
          createdAt: '2025-01-02T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z'
        },
        {
          id: '3',
          name: 'Safe Haven Crisis Center',
          description: '24/7 crisis intervention and emergency mental health support for women in distress',
          mission: 'Providing immediate, compassionate crisis support and long-term recovery resources',
          logo: '',
          website: 'https://safehaven-crisis.org',
          email: 'crisis@safehaven.org',
          phone: '+1-555-CRISIS',
          address: '789 Emergency Blvd, Crisis City, CR 11111',
          services: ['24/7 Crisis Hotline', 'Emergency Counseling', 'Safety Planning', 'Trauma Recovery'],
          isVerified: true,
          isActive: true,
          createdAt: '2025-01-03T00:00:00.000Z',
          updatedAt: '2025-01-03T00:00:00.000Z'
        },
        {
          id: '4',
          name: 'Healing Hearts Community',
          description: 'Community-based mental health support focusing on holistic wellness and peer connections',
          mission: 'Building stronger communities through mental health awareness and peer support networks',
          logo: '',
          website: 'https://healing-hearts.org',
          email: 'community@healing-hearts.org',
          phone: '+1-555-0321',
          address: '321 Community Circle, Unity Town, UT 22222',
          services: ['Peer Support', 'Community Workshops', 'Wellness Programs', 'Mental Health Education'],
          isVerified: false,
          isActive: true,
          createdAt: '2025-01-04T00:00:00.000Z',
          updatedAt: '2025-01-04T00:00:00.000Z'
        }
      ],
      supportGroups: [
        {
          id: '1',
          name: 'Anxiety Support Circle',
          description: 'A safe space for women dealing with anxiety to share experiences and coping strategies',
          category: 'anxiety',
          facilitator: 'Dr. Emily Chen',
          facilitatorBio: 'Licensed therapist specializing in anxiety disorders with 10+ years experience',
          maxMembers: 12,
          currentMembers: 8,
          meetingSchedule: 'Every Tuesday at 7:00 PM EST',
          meetingType: 'online',
          meetingLink: 'https://meet.example.com/anxiety-support',
          isActive: true,
          isPublic: true,
          requirements: ['18+ years old', 'Commitment to attend regularly', 'Respectful communication'],
          tags: ['anxiety', 'support', 'weekly'],
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          name: 'New Mothers Mental Health',
          description: 'Support group for new mothers navigating postpartum mental health challenges',
          category: 'general',
          facilitator: 'Sarah Williams, LCSW',
          facilitatorBio: 'Perinatal mental health specialist and mother of two',
          maxMembers: 10,
          currentMembers: 6,
          meetingSchedule: 'Every Thursday at 11:00 AM EST',
          meetingType: 'hybrid',
          meetingLink: 'https://meet.example.com/new-mothers',
          location: 'Community Center, Room 201',
          isActive: true,
          isPublic: true,
          requirements: ['New mothers (0-2 years postpartum)', 'Childcare available'],
          tags: ['postpartum', 'mothers', 'support'],
          createdAt: '2025-01-02T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z'
        }
      ],
      events: [
        {
          id: '1',
          title: 'Mindfulness Workshop: Finding Peace in Chaos',
          description: 'Learn practical mindfulness techniques to manage stress and anxiety in daily life',
          category: 'workshop',
          organizer: 'Dr. Maria Rodriguez',
          organizerContact: 'maria@mindfulwellness.com',
          startDate: '2025-01-25',
          endDate: '2025-01-25',
          startTime: '14:00',
          endTime: '16:00',
          timezone: 'EST',
          type: 'online',
          meetingLink: 'https://meet.example.com/mindfulness-workshop',
          maxAttendees: 50,
          currentAttendees: 23,
          isPublic: true,
          isFree: true,
          requirements: ['Quiet space for participation', 'Notebook and pen'],
          tags: ['mindfulness', 'stress-relief', 'workshop'],
          imageUrl: '',
          isActive: true,
          createdAt: '2025-01-10T00:00:00.000Z',
          updatedAt: '2025-01-10T00:00:00.000Z'
        },
        {
          id: '2',
          title: 'Women in Tech: Mental Health Panel',
          description: 'Panel discussion on mental health challenges faced by women in the technology industry',
          category: 'webinar',
          organizer: 'Tech Women United',
          organizerContact: 'events@techwomenunited.org',
          startDate: '2025-02-05',
          endDate: '2025-02-05',
          startTime: '19:00',
          endTime: '20:30',
          timezone: 'EST',
          type: 'online',
          meetingLink: 'https://meet.example.com/tech-women-panel',
          maxAttendees: 200,
          currentAttendees: 87,
          isPublic: true,
          isFree: true,
          requirements: ['Professional interest in tech industry'],
          tags: ['tech', 'career', 'panel', 'women'],
          imageUrl: '',
          isActive: true,
          createdAt: '2025-01-08T00:00:00.000Z',
          updatedAt: '2025-01-08T00:00:00.000Z'
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  // Load data from localStorage
  loadData(): StorageData {
    try {
      const version = localStorage.getItem(this.VERSION_KEY);
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      
      // If no data exists or version mismatch, return default data
      if (!storedData || version !== this.CURRENT_VERSION) {
        console.log('🔄 Initializing with default data');
        const defaultData = this.getDefaultData();
        this.saveData(defaultData);
        return defaultData;
      }
      
      const parsedData = JSON.parse(storedData);
      console.log('📂 Loaded data from localStorage:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('❌ Error loading data from localStorage:', error);
      const defaultData = this.getDefaultData();
      this.saveData(defaultData);
      return defaultData;
    }
  }

  // Save data to localStorage
  saveData(data: StorageData): void {
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
      console.log('💾 Data saved to localStorage:', dataToSave);
    } catch (error) {
      console.error('❌ Error saving data to localStorage:', error);
    }
  }

  // Update specific data type
  updateCommunityPosts(posts: any[]): void {
    const currentData = this.loadData();
    currentData.communityPosts = posts;
    this.saveData(currentData);
  }

  updateResources(resources: any[]): void {
    const currentData = this.loadData();
    currentData.resources = resources;
    this.saveData(currentData);
  }

  updatePartners(partners: any[]): void {
    const currentData = this.loadData();
    currentData.partners = partners;
    this.saveData(currentData);
  }

  updateNGOs(ngos: any[]): void {
    const currentData = this.loadData();
    currentData.ngos = ngos;
    this.saveData(currentData);
  }

  updateSupportGroups(supportGroups: any[]): void {
    const currentData = this.loadData();
    currentData.supportGroups = supportGroups;
    this.saveData(currentData);
  }

  updateEvents(events: any[]): void {
    const currentData = this.loadData();
    currentData.events = events;
    this.saveData(currentData);
  }

  // Clear all data (for testing)
  clearData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.VERSION_KEY);
    console.log('🗑️ All data cleared from localStorage');
  }

  // Get data size for debugging
  getDataSize(): string {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return '0 KB';
    
    const sizeInBytes = new Blob([data]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    return `${sizeInKB} KB`;
  }

  // Export data for backup
  exportData(): string {
    const data = this.loadData();
    return JSON.stringify(data, null, 2);
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
      console.log('📥 Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }
}

// Singleton instance
export const dataPersistenceService = new DataPersistenceService();

// Helper functions for easy access
export const persistenceHelpers = {
  // Load all data
  loadAllData: () => dataPersistenceService.loadData(),
  
  // Save specific data types
  saveCommunityPosts: (posts: any[]) => dataPersistenceService.updateCommunityPosts(posts),
  saveResources: (resources: any[]) => dataPersistenceService.updateResources(resources),
  savePartners: (partners: any[]) => dataPersistenceService.updatePartners(partners),
  saveNGOs: (ngos: any[]) => dataPersistenceService.updateNGOs(ngos),
  saveSupportGroups: (supportGroups: any[]) => dataPersistenceService.updateSupportGroups(supportGroups),
  saveEvents: (events: any[]) => dataPersistenceService.updateEvents(events),
  
  // Utility functions
  clearAllData: () => dataPersistenceService.clearData(),
  getStorageSize: () => dataPersistenceService.getDataSize(),
  exportBackup: () => dataPersistenceService.exportData(),
  importBackup: (data: string) => dataPersistenceService.importData(data)
};

export default dataPersistenceService;
