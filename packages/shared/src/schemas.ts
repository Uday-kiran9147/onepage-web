import { z } from 'zod';

// ─── User Schema ─────────────────────────────────────────────────
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).regex(/^[a-z0-9_-]+$/, 'Username must be lowercase alphanumeric, dashes, or underscores'),
  name: z.string().min(1, 'Name is required'),
  bio: z.string().max(300, 'Bio must be under 300 characters').default(''),
  avatarUrl: z.string().url('Avatar must be a valid URL').or(z.literal('')).default(''),
  isOnboarded: z.boolean().default(false),
  createdAt: z.coerce.date(),
});
export type User = z.infer<typeof UserSchema>;

export const ProfileUpdateSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be under 30 characters')
    .regex(/^[a-z0-9_-]+$/, 'Username must be lowercase alphanumeric, dashes, or underscores')
    .optional(),
  name: z.string().min(1, 'Name is required').optional(),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
  avatarUrl: z.string().url('Avatar must be a valid URL').or(z.literal('')).optional(),
});
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;

// ─── Section Item Schemas ────────────────────────────────────────

export const LinkItemSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  url: z.string().url('URL must be valid'),
  icon: z.string().default('link'),
});
export type LinkItem = z.infer<typeof LinkItemSchema>;

export const ProjectItemSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().default(''),
  url: z.string().url('URL must be valid').or(z.literal('')).default(''),
  tags: z.array(z.string()).default([]),
  status: z.enum(['in-progress', 'shipped', 'archived']).default('shipped'),
});
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const ExperienceItemSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  duration: z.string().min(1, 'Duration is required'),
  description: z.string().default(''),
});
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

// ─── Section Schema ──────────────────────────────────────────────

export const SectionTypeEnum = z.enum(['links', 'projects', 'experience', 'about', 'skills']);
export type SectionType = z.infer<typeof SectionTypeEnum>;

export const SectionSchema = z.object({
  id: z.string(),
  type: SectionTypeEnum,
  title: z.string().min(1, 'Section title is required'),
  data: z.record(z.any()), // Raw JSON data for flexibility (validated client-side/server-side per type)
  order: z.number().int(),
  createdAt: z.coerce.date(),
});
export type Section = z.infer<typeof SectionSchema>;

// Section validation helpers
export const LinksSectionDataSchema = z.object({
  links: z.array(LinkItemSchema),
});

export const ProjectsSectionDataSchema = z.object({
  projects: z.array(ProjectItemSchema),
});

export const ExperienceSectionDataSchema = z.object({
  items: z.array(ExperienceItemSchema),
});

export const AboutSectionDataSchema = z.object({
  content: z.string().max(2000, 'Content must be under 2000 characters'),
});
