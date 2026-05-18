// src/services/lead.service.ts
import { Lead, ILeadDocument } from '../models/Lead';
import { LeadStatus, LeadSource, LeadQueryParams, PaginationMeta } from '../types';
import { FilterQuery, SortOrder } from 'mongoose';

interface CreateLeadInput {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
  createdBy: string;
}

interface UpdateLeadInput {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
  assignedTo?: string;
}

interface LeadListResult {
  leads: ILeadDocument[];
  meta: PaginationMeta;
}

const DEFAULT_LIMIT = 10;

export class LeadService {
  async createLead(input: CreateLeadInput): Promise<ILeadDocument> {
    return Lead.create(input);
  }

  async getLeads(query: LeadQueryParams, userId: string, isAdmin: boolean): Promise<LeadListResult> {
    const {
      page = '1',
      limit = String(DEFAULT_LIMIT),
      status,
      source,
      search,
      sort = 'latest',
    } = query;

    const currentPage = Math.max(1, parseInt(page, 10));
    const pageLimit = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (currentPage - 1) * pageLimit;

    // Build filter
    const filter: FilterQuery<ILeadDocument> = {};

    // Non-admin users can only see their own leads
    if (!isAdmin) {
      filter.createdBy = userId;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    // Sort
    const sortOrder: { [key: string]: SortOrder } =
      sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort(sortOrder)
        .skip(skip)
        .limit(pageLimit),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / pageLimit);

    return {
      leads,
      meta: {
        currentPage,
        totalPages,
        totalLeads: total,
        limit: pageLimit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  }

  async getLeadById(id: string, userId: string, isAdmin: boolean): Promise<ILeadDocument | null> {
    const filter: FilterQuery<ILeadDocument> = { _id: id };
    if (!isAdmin) filter.createdBy = userId;

    return Lead.findOne(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
  }

  async updateLead(
    id: string,
    input: UpdateLeadInput,
    userId: string,
    isAdmin: boolean
  ): Promise<ILeadDocument | null> {
    const filter: FilterQuery<ILeadDocument> = { _id: id };
    if (!isAdmin) filter.createdBy = userId;

    return Lead.findOneAndUpdate(filter, { $set: input }, { new: true, runValidators: true })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
  }

  async deleteLead(id: string, userId: string, isAdmin: boolean): Promise<ILeadDocument | null> {
    const filter: FilterQuery<ILeadDocument> = { _id: id };
    if (!isAdmin) filter.createdBy = userId;

    return Lead.findOneAndDelete(filter);
  }

  async getAllLeadsForExport(userId: string, isAdmin: boolean): Promise<ILeadDocument[]> {
    const filter: FilterQuery<ILeadDocument> = {};
    if (!isAdmin) filter.createdBy = userId;
    return Lead.find(filter).sort({ createdAt: -1 });
  }
}

export const leadService = new LeadService();
