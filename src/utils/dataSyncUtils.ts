// Utility functions for syncing admin data to public storage
import { persistenceHelpers } from '../services/DataPersistence';
import { publicDataHelpers } from '../services/PublicDataService';

export const syncAdminDataToPublic = () => {
  console.log('🔄 Starting manual sync of admin data to public storage...');
  
  try {
    // Load all admin data
    const adminData = persistenceHelpers.loadAllData();
    console.log('📂 Loaded admin data:', adminData);
    
    // Sync support groups
    const supportGroups = adminData.supportGroups || [];
    publicDataHelpers.updateSupportGroups(supportGroups);
    console.log('✅ Synced support groups:', supportGroups.length);
    
    // Sync events
    const events = adminData.events || [];
    publicDataHelpers.updateEvents(events);
    console.log('✅ Synced events:', events.length);
    
    // Verify sync
    const publicData = publicDataHelpers.loadPublicData();
    console.log('🔍 Verification - Public data after sync:', publicData);
    
    return {
      success: true,
      supportGroupsCount: supportGroups.length,
      eventsCount: events.length,
      publicData
    };
  } catch (error) {
    console.error('❌ Error syncing admin data to public:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const debugPublicData = () => {
  console.log('🔍 Debug: Checking public data...');
  
  const publicData = publicDataHelpers.loadPublicData();
  const publicSupportGroups = publicDataHelpers.getPublicSupportGroups();
  const publicEvents = publicDataHelpers.getPublicEvents();
  
  console.log('📊 Public Data Summary:');
  console.log('- Raw support groups:', publicData.supportGroups?.length || 0);
  console.log('- Raw events:', publicData.events?.length || 0);
  console.log('- Filtered support groups:', publicSupportGroups.length);
  console.log('- Filtered events:', publicEvents.length);
  
  console.log('📋 Detailed Data:');
  console.log('- All public data:', publicData);
  console.log('- Filtered support groups:', publicSupportGroups);
  console.log('- Filtered events:', publicEvents);
  
  return {
    rawSupportGroups: publicData.supportGroups?.length || 0,
    rawEvents: publicData.events?.length || 0,
    filteredSupportGroups: publicSupportGroups.length,
    filteredEvents: publicEvents.length,
    publicData,
    publicSupportGroups,
    publicEvents
  };
};

export const clearAllData = () => {
  console.log('🗑️ Clearing all data...');
  
  // Clear admin data
  persistenceHelpers.clearAllData();
  
  // Clear public data
  publicDataHelpers.clearPublicData();
  
  console.log('✅ All data cleared');
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).syncAdminDataToPublic = syncAdminDataToPublic;
  (window as any).debugPublicData = debugPublicData;
  (window as any).clearAllData = clearAllData;
}
