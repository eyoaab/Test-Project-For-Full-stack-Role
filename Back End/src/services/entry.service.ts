import { Entry, IEntry, EntryStatus } from '../models/Entry';
import { ApiError } from '../utils/ApiError';

export interface CreateEntryDTO {
  title: string;
  description: string;
  amount: number;
  createdBy: string;
}

export interface UpdateEntryStatusDTO {
  status: EntryStatus;
}

class EntryService {
  async createEntry(data: CreateEntryDTO): Promise<IEntry> {
    const entry = await Entry.create(data);
    return entry;
  }

  async getUserEntries(userId: string): Promise<IEntry[]> {
    const entries = await Entry.find({ createdBy: userId })
      .populate('createdBy', 'email role')
      .sort({ createdAt: -1 });

    return entries;
  }

  async getAllEntries(status?: EntryStatus): Promise<IEntry[]> {
    const filter = status ? { status } : {};

    const entries = await Entry.find(filter)
      .populate('createdBy', 'email role')
      .sort({ createdAt: -1 });

    return entries;
  }

  async getEntryById(entryId: string): Promise<IEntry> {
    const entry = await Entry.findById(entryId).populate(
      'createdBy',
      'email role'
    );

    if (!entry) {
      throw ApiError.notFound('Entry not found');
    }

    return entry;
  }

  async updateEntryStatus(
    entryId: string,
    data: UpdateEntryStatusDTO
  ): Promise<IEntry> {
    const entry = await Entry.findByIdAndUpdate(
      entryId,
      { status: data.status },
      { new: true, runValidators: true }
    ).populate('createdBy', 'email role');

    if (!entry) {
      throw ApiError.notFound('Entry not found');
    }

    return entry;
  }

  async deleteEntry(entryId: string): Promise<void> {
    const entry = await Entry.findByIdAndDelete(entryId);

    if (!entry) {
      throw ApiError.notFound('Entry not found');
    }
  }
}

export const entryService = new EntryService();
