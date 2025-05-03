import { Request, Response, NextFunction } from 'express';
import { comboService } from '../services/combo.service';
import { songService } from '../services/song.service';
import { analysisService } from '../services/analysis.service';
import { logger } from '../middleware/logger';

export const comboController = {
  // Get combos for a song
  getCombos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { songId } = req.params;
      
      // Check if song exists
      const song = songService.getSong(songId);
      if (!song) {
        return res.status(404).json({
          error: {
            message: 'Song not found',
            code: 'SONG_NOT_FOUND'
          }
        });
      }
      
      // Check if analysis is complete
      const analysis = analysisService.getAnalysis(songId);
      if (!analysis || analysis.status !== 'completed') {
        return res.status(400).json({
          error: {
            message: 'Analysis not completed',
            code: 'ANALYSIS_NOT_COMPLETED'
          }
        });
      }
      
      // Get combos
      const combos = comboService.getCombos(songId);
      
      // If no combos exist yet, generate them
      if (!combos || combos.length === 0) {
        const newCombos = comboService.generateInitialCombos(songId, analysis);
        return res.status(200).json(newCombos);
      }
      
      return res.status(200).json(combos);
    } catch (error) {
      logger.error('Error getting combos:', error);
      next(error);
    }
  },
  
  // Regenerate combos
  regenerateCombos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { songId } = req.params;
      const { excludeComboIds } = req.body || {};
      
      // Check if song exists
      const song = songService.getSong(songId);
      if (!song) {
        return res.status(404).json({
          error: {
            message: 'Song not found',
            code: 'SONG_NOT_FOUND'
          }
        });
      }
      
      // Check if analysis is complete
      const analysis = analysisService.getAnalysis(songId);
      if (!analysis || analysis.status !== 'completed') {
        return res.status(400).json({
          error: {
            message: 'Analysis not completed',
            code: 'ANALYSIS_NOT_COMPLETED'
          }
        });
      }
      
      // Regenerate combos
      const newCombos = comboService.regenerateCombos(songId, analysis, excludeComboIds);
      
      return res.status(200).json(newCombos);
    } catch (error) {
      logger.error('Error regenerating combos:', error);
      next(error);
    }
  }
};