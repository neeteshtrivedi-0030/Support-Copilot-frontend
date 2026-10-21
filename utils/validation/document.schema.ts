import Joi from 'joi';

export const documentUploadMetadataSchema = Joi.object({
  name: Joi.string().trim().max(255).allow('').optional().messages({
    'string.max': 'Document name cannot exceed 255 characters',
  }),
  department: Joi.string()
    .valid(
      'HR',
      'IT',
      'Finance',
      'Engineering',
      'Security',
      'Legal',
      'Operations',
      'General',
      'Public'
    )
    .required()
    .messages({
      'any.only': 'Please select a valid department',
      'string.empty': 'Department is required',
    }),
});

export const documentFilterSchema = Joi.object({
  department: Joi.string()
    .valid(
      'HR',
      'IT',
      'Finance',
      'Engineering',
      'Security',
      'Legal',
      'Operations',
      'General',
      'Public',
      ''
    )
    .optional(),
  status: Joi.string().valid('uploaded', 'processing', 'processed', 'failed', '').optional(),
  search: Joi.string().trim().max(100).allow('').optional(),
});
