import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { entryService } from '../services/entry.service';
import { EntryStatus } from '../models/Entry';

class EntryController {
  async createEntry(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, description, amount } = req.body;
      const userId = req.user!.userId;

      const entry = await entryService.createEntry({
        title,
        description,
        amount,
        createdBy: userId,
      });

      res.status(201).json({
        success: true,
        message: 'Entry created successfully',
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserEntries(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const entries = await entryService.getUserEntries(userId);

      res.status(200).json({
        success: true,
        message: 'Entries retrieved successfully',
        data: entries,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEntries(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const status = req.query.status as EntryStatus | undefined;

      const entries = await entryService.getAllEntries(status);

      res.status(200).json({
        success: true,
        message: 'Entries retrieved successfully',
        data: entries,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEntryById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const entry = await entryService.getEntryById(id);

      res.status(200).json({
        success: true,
        message: 'Entry retrieved successfully',
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEntryStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const entry = await entryService.updateEntryStatus(id, { status });

      res.status(200).json({
        success: true,
        message: 'Entry status updated successfully',
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEntry(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      await entryService.deleteEntry(id);

      res.status(200).json({
        success: true,
        message: 'Entry deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const entryController = new EntryController();
