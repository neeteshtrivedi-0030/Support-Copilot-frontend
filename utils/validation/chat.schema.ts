import Joi from 'joi';

export const chatMessageSchema = Joi.object({
  message: Joi.string().trim().min(2).max(2000).required().messages({
    'string.empty': 'Please enter a question or message',
    'string.min': 'Message must be at least 2 characters',
    'string.max': 'Message cannot exceed 2000 characters',
  }),
  conversationId: Joi.string().hex().length(24).allow('').optional(),
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
});

export const renameConversationSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Conversation title cannot be empty',
    'string.max': 'Title cannot exceed 100 characters',
  }),
});
