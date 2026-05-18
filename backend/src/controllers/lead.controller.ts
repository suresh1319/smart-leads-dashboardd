// src/controllers/lead.controller.ts
import { Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.middleware';
import { leadService } from '../services/lead.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { generateCSV } from '../utils/csvExport';
import { AuthRequest, LeadQueryParams } from '../types';

export const createLeadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .notEmpty()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  validate,
];

export const updateLeadValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']),
  body('notes').optional().isLength({ max: 500 }),
  validate,
];

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const lead = await leadService.createLead({
      ...req.body,
      createdBy: req.user.userId,
    });
    sendSuccess(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const query = req.query as unknown as LeadQueryParams;
    const isAdmin = req.user.role === 'admin';
    const result = await leadService.getLeads(query, req.user.userId, isAdmin);
    sendSuccess(res, result.leads, 'Leads retrieved successfully', 200, result.meta);
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const isAdmin = req.user.role === 'admin';
    const lead = await leadService.getLeadById(req.params.id, req.user.userId, isAdmin);
    if (!lead) { sendError(res, 'Lead not found', 404); return; }
    sendSuccess(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const isAdmin = req.user.role === 'admin';
    const lead = await leadService.updateLead(req.params.id, req.body, req.user.userId, isAdmin);
    if (!lead) { sendError(res, 'Lead not found or unauthorized', 404); return; }
    sendSuccess(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const isAdmin = req.user.role === 'admin';
    const lead = await leadService.deleteLead(req.params.id, req.user.userId, isAdmin);
    if (!lead) { sendError(res, 'Lead not found or unauthorized', 404); return; }
    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const isAdmin = req.user.role === 'admin';
    const leads = await leadService.getAllLeadsForExport(req.user.userId, isAdmin);
    const csv = generateCSV(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
