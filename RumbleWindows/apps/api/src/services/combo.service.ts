import { v4 as uuidv4 } from 'uuid';
import { logger } from '../middleware/logger';

// Energy segment type
interface EnergySegment {
  startTime: number;
  endTime: number;
  level: 1 | 2 | 3;
}

// Analysis record type
interface AnalysisRecord {
  songId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bpm?: number;
  variableBpm?: boolean;
  energyProfile?: EnergySegment[];
  duration?: number;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
}

// Combo type
interface Combo {
  id: string;
  sequence: string;
  notation: string[];
  energyLevel: 1 | 2 | 3;
  bpm: number;
  time: number;
  duration: number;
  createdAt: Date;
}

class ComboService {
  private comboData = new Map<string, Combo[]>();

  // Get combos for a song
  getCombos(songId: string): Combo[] {
    return this.comboData.get(songId) || [];
  }

  // Generate initial combos based on analysis results
  generateInitialCombos(songId: string, analysis: AnalysisRecord): Combo[] {
    if (!analysis.bpm || !analysis.energyProfile || !analysis.duration) {
      logger.error(`Cannot generate combos: missing analysis data for song ${songId}`);
      return [];
    }

    const combos: Combo[] = [];
    
    // Generate a combo for each energy segment (up to 10 combos)
    const segments = analysis.energyProfile.slice(0, 10);
    
    for (const segment of segments) {
      const combo = this.generateCombo(
        analysis.bpm,
        segment.level,
        segment.startTime,
        segment.endTime - segment.startTime
      );
      
      combos.push(combo);
    }
    
    // Store the combos
    this.comboData.set(songId, combos);
    
    return combos;
  }

  // Regenerate combos, excluding certain IDs
  regenerateCombos(songId: string, analysis: AnalysisRecord, excludeComboIds: string[] = []): Combo[] {
    if (!analysis.bpm || !analysis.energyProfile || !analysis.duration) {
      logger.error(`Cannot regenerate combos: missing analysis data for song ${songId}`);
      return [];
    }
    
    // Get existing combos
    const existingCombos = this.comboData.get(songId) || [];
    
    // Filter out excluded combos
    const retainedCombos = existingCombos.filter(combo => !excludeComboIds.includes(combo.id));
    
    // Generate new combos to replace excluded ones
    const newCombos: Combo[] = [];
    
    for (let i = 0; i < excludeComboIds.length; i++) {
      // Get a random energy segment
      const randomSegmentIndex = Math.floor(Math.random() * analysis.energyProfile.length);
      const segment = analysis.energyProfile[randomSegmentIndex];
      
      const combo = this.generateCombo(
        analysis.bpm,
        segment.level,
        segment.startTime,
        segment.endTime - segment.startTime
      );
      
      newCombos.push(combo);
    }
    
    // Combine retained and new combos
    const allCombos = [...retainedCombos, ...newCombos];
    
    // Update stored combos
    this.comboData.set(songId, allCombos);
    
    return allCombos;
  }

  // Generate a single combo
  private generateCombo(bpm: number, energyLevel: 1 | 2 | 3, time: number, duration: number): Combo {
    // Define punch mappings
    const punchMap: { [key: number]: string } = {
      1: "Jab",
      2: "Cross",
      3: "Lead hook",
      4: "Rear hook",
      5: "Lead uppercut",
      6: "Rear uppercut"
    };
    
    // Define complexity based on energy level
    let minPunches = 3;
    let maxPunches = 6;
    
    switch (energyLevel) {
      case 1: // Low energy
        minPunches = 2;
        maxPunches = 4;
        break;
      case 2: // Medium energy
        minPunches = 3;
        maxPunches = 5;
        break;
      case 3: // High energy
        minPunches = 4;
        maxPunches = 6;
        break;
    }
    
    // Generate random number of punches within the range
    const numPunches = Math.floor(Math.random() * (maxPunches - minPunches + 1)) + minPunches;
    
    // Generate sequence
    const sequence: number[] = [];
    
    // First punch is often a jab (1) or cross (2)
    sequence.push(Math.random() > 0.3 ? 1 : 2);
    
    // Add remaining punches with some basic boxing logic
    for (let i = 1; i < numPunches; i++) {
      const lastPunch = sequence[sequence.length - 1];
      
      // Avoid repeating the same punch
      let nextPunch: number;
      do {
        nextPunch = Math.floor(Math.random() * 6) + 1;
      } while (nextPunch === lastPunch);
      
      sequence.push(nextPunch);
    }
    
    // Convert to notation
    const notation = sequence.map(punch => punchMap[punch]);
    
    // Create combo object
    return {
      id: uuidv4(),
      sequence: sequence.join('-'),
      notation,
      energyLevel,
      bpm,
      time,
      duration,
      createdAt: new Date()
    };
  }
}

// Create singleton instance
export const comboService = new ComboService();