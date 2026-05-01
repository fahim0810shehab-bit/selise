// SELISE DATA GATEWAY — UserSite Schema
// Schema: UserSite | Collection: UserSites
// Fields: UserId (unique), Username (unique), IsPublished, RootNode

import { dg } from '../lib/selise';
import { SiteData } from '../types/vibe';
import { defaultRootNode } from '../utils/vibeDefaults';

export const contentService = {

  getSiteData: async (userId: string): Promise<SiteData | null> => {
    try {
      const result: any = await dg.query('UserSite', {
        UserId: { _eq: userId }
      });
      const records = result?.UserSite;
      if (!records || records.length === 0) return null;
      const record = records[0];
      return {
        user_id: record.UserId,
        username: record.Username,
        is_published: record.IsPublished,
        rootNode: typeof record.RootNode === 'string'
          ? JSON.parse(record.RootNode)
          : record.RootNode
      };
    } catch (err) {
      console.warn('getSiteData: falling back to localStorage', err);
      const data = localStorage.getItem(`vibe_site_${userId}`);
      return data ? JSON.parse(data) : null;
    }
  },

  getSiteDataByUsername: async (username: string): Promise<SiteData | null> => {
    try {
      const result: any = await dg.query('UserSite', {
        Username: { _eq: username }
      });
      const records = result?.UserSite;
      if (!records || records.length === 0) return null;
      const record = records[0];
      return {
        user_id: record.UserId,
        username: record.Username,
        is_published: record.IsPublished,
        rootNode: typeof record.RootNode === 'string'
          ? JSON.parse(record.RootNode)
          : record.RootNode
      };
    } catch (err) {
      console.warn('getSiteDataByUsername: falling back to localStorage', err);
      const data = localStorage.getItem(`vibe_site_user_${username}`);
      return data ? JSON.parse(data) : null;
    }
  },

  saveSiteData: async (payload: SiteData): Promise<void> => {
    // Always save to localStorage first as backup
    localStorage.setItem(`vibe_site_${payload.user_id}`, JSON.stringify(payload));
    localStorage.setItem(`vibe_site_user_${payload.username}`, JSON.stringify(payload));

    try {
      await dg.mutate('UserSite', {
        UserId: payload.user_id,
        Username: payload.username,
        IsPublished: payload.is_published,
        RootNode: JSON.stringify(payload.rootNode)
      });
    } catch (err) {
      console.warn('saveSiteData: saved to localStorage only', err);
    }
  },

  createDefaultSiteData: (userId: string, username: string): SiteData => ({
    user_id: userId,
    username,
    is_published: false,
    rootNode: JSON.parse(JSON.stringify(defaultRootNode))
  })
};
