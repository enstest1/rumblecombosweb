import { describe, it, expect, beforeEach } from 'vitest';
import { songService } from './song.service';

// Reset test implementation of songService for each test
// Note: In a real implementation, we would want to mock the service or create a test instance
class TestSongService {
  getData() {
    // @ts-expect-error - accessing private property for testing
    return songService['songData'];
  }
  
  clearData() {
    // @ts-expect-error - accessing private property for testing
    songService['songData'].clear();
  }
}

const testService = new TestSongService();

describe('SongService', () => {
  beforeEach(() => {
    testService.clearData();
  });

  it('should add a song and return a songId', () => {
    const testSong = {
      originalname: 'test-song.mp3',
      mimetype: 'audio/mpeg',
      size: 1024,
      filePath: '/test/path/test-song.mp3'
    };
    
    const songId = songService.addSong(testSong);
    
    // Check that a non-empty string ID was returned
    expect(songId).toBeTruthy();
    expect(typeof songId).toBe('string');
    
    // Check that the song was added to the internal data map
    expect(testService.getData().size).toBe(1);
    expect(testService.getData().has(songId)).toBe(true);
  });

  it('should retrieve a song by ID', () => {
    const testSong = {
      originalname: 'test-song.mp3',
      mimetype: 'audio/mpeg',
      size: 1024,
      filePath: '/test/path/test-song.mp3'
    };
    
    const songId = songService.addSong(testSong);
    const retrievedSong = songService.getSong(songId);
    
    // Check the retrieved song matches what we added
    expect(retrievedSong).toBeTruthy();
    expect(retrievedSong?.originalname).toBe(testSong.originalname);
    expect(retrievedSong?.mimetype).toBe(testSong.mimetype);
    expect(retrievedSong?.size).toBe(testSong.size);
    expect(retrievedSong?.filePath).toBe(testSong.filePath);
    expect(retrievedSong?.uploadedAt).toBeInstanceOf(Date);
  });

  it('should return undefined for non-existent song ID', () => {
    const nonExistentSong = songService.getSong('non-existent-id');
    expect(nonExistentSong).toBeUndefined();
  });

  it('should delete a song by ID', () => {
    const testSong = {
      originalname: 'test-song.mp3',
      mimetype: 'audio/mpeg',
      size: 1024,
      filePath: '/test/path/test-song.mp3'
    };
    
    const songId = songService.addSong(testSong);
    
    // Verify song was added
    expect(testService.getData().has(songId)).toBe(true);
    
    // Delete the song
    const deleteResult = songService.deleteSong(songId);
    
    // Check delete was successful
    expect(deleteResult).toBe(true);
    expect(testService.getData().has(songId)).toBe(false);
  });

  it('should return false when deleting non-existent song', () => {
    const deleteResult = songService.deleteSong('non-existent-id');
    expect(deleteResult).toBe(false);
  });
});