// Public data service for sharing admin-managed content with all users
// This simulates a backend API using localStorage as a shared database

export interface PublicData {
  supportGroups: any[];
  events: any[];
  lastUpdated: string;
}

class PublicDataService {
  private readonly PUBLIC_STORAGE_KEY = 'wmh_public_data';
  private readonly PUBLIC_VERSION_KEY = 'wmh_public_version';
  private readonly CURRENT_VERSION = '1.0.0';

  // Get default public data
  private getDefaultPublicData(): PublicData {
    return {
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

  // Load public data from localStorage
  loadPublicData(): PublicData {
    try {
      const version = localStorage.getItem(this.PUBLIC_VERSION_KEY);
      const storedData = localStorage.getItem(this.PUBLIC_STORAGE_KEY);

      // If no data exists or version mismatch, return default data
      if (!storedData || version !== this.CURRENT_VERSION) {
        console.log('🔄 Initializing with default public data');
        const defaultData = this.getDefaultPublicData();
        this.savePublicData(defaultData);
        return defaultData;
      }

      const parsedData = JSON.parse(storedData);

      // Ensure data has the required structure
      if (!parsedData.supportGroups) parsedData.supportGroups = [];
      if (!parsedData.events) parsedData.events = [];

      console.log('📂 Loaded public data from localStorage:', {
        supportGroups: parsedData.supportGroups.length,
        events: parsedData.events.length,
        lastUpdated: parsedData.lastUpdated
      });

      return parsedData;
    } catch (error) {
      console.error('❌ Error loading public data from localStorage:', error);
      const defaultData = this.getDefaultPublicData();
      this.savePublicData(defaultData);
      return defaultData;
    }
  }

  // Save public data to localStorage
  savePublicData(data: PublicData): void {
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.PUBLIC_STORAGE_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(this.PUBLIC_VERSION_KEY, this.CURRENT_VERSION);
      console.log('💾 Public data saved to localStorage:', dataToSave);
    } catch (error) {
      console.error('❌ Error saving public data to localStorage:', error);
    }
  }

  // Update support groups
  updateSupportGroups(supportGroups: any[]): void {
    const currentData = this.loadPublicData();
    currentData.supportGroups = supportGroups;
    this.savePublicData(currentData);
  }

  // Update events
  updateEvents(events: any[]): void {
    const currentData = this.loadPublicData();
    currentData.events = events;
    this.savePublicData(currentData);
  }

  // Get only public and active support groups
  getPublicSupportGroups(): any[] {
    const data = this.loadPublicData();
    return data.supportGroups.filter(group => group.isActive && group.isPublic);
  }

  // Get only public and active upcoming events
  getPublicEvents(): any[] {
    const data = this.loadPublicData();
    const now = new Date();
    return data.events.filter(event => 
      event.isActive && 
      event.isPublic && 
      new Date(event.startDate) >= now
    );
  }

  // Clear all public data (for testing)
  clearPublicData(): void {
    localStorage.removeItem(this.PUBLIC_STORAGE_KEY);
    localStorage.removeItem(this.PUBLIC_VERSION_KEY);
    console.log('🗑️ All public data cleared from localStorage');
  }
}

// Singleton instance
export const publicDataService = new PublicDataService();

// Helper functions for easy access
export const publicDataHelpers = {
  // Load all public data
  loadPublicData: () => publicDataService.loadPublicData(),
  
  // Get filtered public data
  getPublicSupportGroups: () => publicDataService.getPublicSupportGroups(),
  getPublicEvents: () => publicDataService.getPublicEvents(),
  
  // Update public data (admin only)
  updateSupportGroups: (groups: any[]) => publicDataService.updateSupportGroups(groups),
  updateEvents: (events: any[]) => publicDataService.updateEvents(events),
  
  // Utility functions
  clearPublicData: () => publicDataService.clearPublicData()
};

export default publicDataService;
