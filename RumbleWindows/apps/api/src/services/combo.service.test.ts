import { describe, it, expect, beforeEach } from 'vitest';
import { comboService } from './combo.service';

// Reset test implementation of comboService for each test
// Note: In a real implementation, we would want to mock the service or create a test instance
class TestComboService {
  getData() {
    // @ts-expect-error - accessing private property for testing
    return comboService['comboData'];
  }
  
  clearData() {
    // @ts-expect-error - accessing private property for testing
    comboService['comboData'].clear();
  }
}

const testService = new TestComboService();

describe('ComboService', () => {
  beforeEach(() => {
    testService.clearData();
  });

  it('should return an empty array for non-existent song ID', () => {
    const combos = comboService.getCombos('non-existent-id');
    expect(combos).toEqual([]);
  });

  it('should generate initial combos based on analysis results', () => {
    const songId = 'test-song-id';
    const mockAnalysis = {
      songId,
      status: 'completed' as const,
      bpm: 120,
      variableBpm: false,
      energyProfile: [
        { startTime: 0, endTime: 30, level: 1 as const },
        { startTime: 30, endTime: 60, level: 2 as const },
        { startTime: 60, endTime: 90, level: 3 as const }
      ],
      duration: 90,
      startedAt: new Date()
    };
    
    const combos = comboService.generateInitialCombos(songId, mockAnalysis);
    
    // Check that combos were generated
    expect(combos.length).toBe(3); // One for each energy segment
    
    // Check that combos have the expected properties
    for (const combo of combos) {
      expect(combo.id).toBeTruthy();
      expect(combo.sequence).toBeTruthy();
      expect(combo.notation).toBeInstanceOf(Array);
      expect([1, 2, 3]).toContain(combo.energyLevel);
      expect(combo.bpm).toBe(mockAnalysis.bpm);
      expect(combo.createdAt).toBeInstanceOf(Date);
    }
    
    // Check that combos were stored in the service
    const storedCombos = comboService.getCombos(songId);
    expect(storedCombos).toEqual(combos);
  });

  it('should regenerate combos, excluding specified IDs', () => {
    const songId = 'test-song-id';
    const mockAnalysis = {
      songId,
      status: 'completed' as const,
      bpm: 120,
      variableBpm: false,
      energyProfile: [
        { startTime: 0, endTime: 30, level: 1 as const },
        { startTime: 30, endTime: 60, level: 2 as const },
        { startTime: 60, endTime: 90, level: 3 as const }
      ],
      duration: 90,
      startedAt: new Date()
    };
    
    // Generate initial combos
    const initialCombos = comboService.generateInitialCombos(songId, mockAnalysis);
    expect(initialCombos.length).toBe(3);
    
    // Get the ID of the first combo to exclude
    const comboIdToExclude = initialCombos[0].id;
    
    // Regenerate combos, excluding the first one
    const regeneratedCombos = comboService.regenerateCombos(songId, mockAnalysis, [comboIdToExclude]);
    
    // Should still have 3 combos total
    expect(regeneratedCombos.length).toBe(3);
    
    // The excluded combo ID should not be present in the regenerated list
    const excludedComboStillPresent = regeneratedCombos.some(combo => combo.id === comboIdToExclude);
    expect(excludedComboStillPresent).toBe(false);
    
    // The other two original combos should still be present
    const originalCombo1Present = regeneratedCombos.some(combo => combo.id === initialCombos[1].id);
    const originalCombo2Present = regeneratedCombos.some(combo => combo.id === initialCombos[2].id);
    expect(originalCombo1Present).toBe(true);
    expect(originalCombo2Present).toBe(true);
    
    // There should be one new combo
    const newCombos = regeneratedCombos.filter(combo => 
      !initialCombos.some(initialCombo => initialCombo.id === combo.id)
    );
    expect(newCombos.length).toBe(1);
  });

  it('should not generate combos if missing analysis data', () => {
    const songId = 'test-song-id';
    
    // Missing BPM
    let mockAnalysis = {
      songId,
      status: 'completed' as const,
      energyProfile: [
        { startTime: 0, endTime: 30, level: 1 as const }
      ],
      duration: 30,
      startedAt: new Date()
    };
    
    let combos = comboService.generateInitialCombos(songId, mockAnalysis);
    expect(combos).toEqual([]);
    
    // Missing energy profile
    mockAnalysis = {
      songId,
      status: 'completed' as const,
      bpm: 120,
      duration: 30,
      startedAt: new Date()
    };
    
    combos = comboService.generateInitialCombos(songId, mockAnalysis);
    expect(combos).toEqual([]);
    
    // Missing duration
    mockAnalysis = {
      songId,
      status: 'completed' as const,
      bpm: 120,
      energyProfile: [
        { startTime: 0, endTime: 30, level: 1 as const }
      ],
      startedAt: new Date()
    };
    
    combos = comboService.generateInitialCombos(songId, mockAnalysis);
    expect(combos).toEqual([]);
  });
});