import { v4 as uuidv4 } from 'uuid';
import { logger } from '../middleware/logger';

// Define SongMetadata interface
interface SongMetadata {
  originalname: string;
  mimetype: string;
  size: number;
  filePath: string;
  uploadedAt: Date;
}

class SongService {
  private songData = new Map<string, SongMetadata>();

  // Add a new song to the in-memory store
  addSong(songData: Omit<SongMetadata, 'uploadedAt'>): string {
    const songId = uuidv4();
    
    this.songData.set(songId, {
      ...songData,
      uploadedAt: new Date()
    });
    
    logger.info(`Added song with ID: ${songId}`);
    return songId;
  }

  // Get song by ID
  getSong(songId: string): SongMetadata | undefined {
    return this.songData.get(songId);
  }

  // Delete song by ID
  deleteSong(songId: string): boolean {
    return this.songData.delete(songId);
  }
}

// Create singleton instance
export const songService = new SongService();