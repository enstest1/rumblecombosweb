import { Request, Response, NextFunction } from 'express';
import { analysisService } from '../services/analysis.service';
import { songService } from '../services/song.service';
import { logger } from '../middleware/logger';

export const analysisController = {
  // Get analysis status and results
  getAnalysisStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { songId } = req.params;
      logger.info(`Received request for analysis status for song: ${songId}`);
      
      // Check if song exists
      const song = songService.getSong(songId);
      if (!song) {
        logger.error(`Song not found: ${songId}`);
        return res.status(404).json({
          error: {
            message: 'Song not found',
            code: 'SONG_NOT_FOUND'
          }
        });
      }
      
      // Get analysis data
      const analysis = analysisService.getAnalysis(songId);
      
      if (!analysis) {
        logger.error(`Analysis not found for song: ${songId}`);
        return res.status(404).json({
          error: {
            message: 'Analysis not found',
            code: 'ANALYSIS_NOT_FOUND'
          }
        });
      }
      
      logger.info(`Returning analysis data for song ${songId}:`, {
        status: analysis.status,
        bpm: analysis.bpm,
        duration: analysis.duration,
        energySegments: analysis.energyProfile?.length || 0
      });
      
      // Return the analysis data
      return res.status(200).json({
        songId,
        status: analysis.status,
        bpm: analysis.bpm,
        variableBpm: analysis.variableBpm,
        energyProfile: analysis.energyProfile,
        duration: analysis.duration,
        error: analysis.error || undefined,
        completedAt: analysis.completedAt
      });
    } catch (error) {
      logger.error('Error getting analysis status:', error);
      next(error);
    }
  }
};