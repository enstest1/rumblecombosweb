import { Request, Response, NextFunction } from 'express';
import { songService } from '../services/song.service';
import { analysisService } from '../services/analysis.service';
import { logger } from '../middleware/logger';

export const songController = {
  // Upload a new song
  uploadSong: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Upload handler called, request file:', req.file);
      
      if (!req.file) {
        logger.error('No file in request');
        return res.status(400).json({
          error: {
            message: 'No file uploaded',
            code: 'FILE_MISSING'
          }
        });
      }

      const { originalname, mimetype, size, path: filePath } = req.file;
      logger.info(`File uploaded: ${originalname}, size: ${size}, path: ${filePath}`);
      
      // Store song metadata and get a unique ID
      const songId = songService.addSong({
        originalname,
        mimetype,
        size,
        filePath
      });

      // Trigger asynchronous analysis
      setTimeout(() => {
        analysisService.performFullAnalysis(songId)
          .catch(error => {
            logger.error(`Analysis error for song ${songId}:`, error);
          });
      }, 0);

      // Respond immediately with 202 Accepted
      logger.info(`Song added with ID: ${songId}, responding with 202 Accepted`);
      return res.status(202).json({
        songId,
        status: 'processing'
      });
    } catch (error) {
      logger.error('Error uploading song:', error);
      next(error);
    }
  },

  // Get song details
  getSongDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { songId } = req.params;
      
      const song = songService.getSong(songId);
      
      if (!song) {
        return res.status(404).json({
          error: {
            message: 'Song not found',
            code: 'SONG_NOT_FOUND'
          }
        });
      }
      
      // Return basic song details (excluding file path for security)
      return res.status(200).json({
        id: songId,
        originalname: song.originalname,
        mimetype: song.mimetype,
        size: song.size,
        uploadedAt: song.uploadedAt
      });
    } catch (error) {
      logger.error('Error getting song details:', error);
      next(error);
    }
  }
};