// src/routes/lead.routes.ts
import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  createLeadValidation,
  updateLeadValidation,
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/leads/export  (Admin only)
router.get('/export', authorize('admin', 'sales'), exportLeadsCSV);

// GET /api/leads
router.get('/', getLeads);

// POST /api/leads
router.post('/', createLeadValidation, createLead);

// GET /api/leads/:id
router.get('/:id', getLeadById);

// PUT /api/leads/:id
router.put('/:id', updateLeadValidation, updateLead);

// DELETE /api/leads/:id (Admin only)
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
