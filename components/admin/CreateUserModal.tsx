'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { adminService } from '../../services/admin.service';
import { useJoiValidation } from '../../hooks/useJoiValidation';
import { registerSchema } from '../../utils/validation/auth.schema';
import { DEPARTMENTS } from '../../utils/constants';
import { UserDepartment, UserRole, CreateUserModalProps } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';
import { User, Mail, Lock, Shield, UserPlus, AlertCircle } from 'lucide-react';

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState<UserDepartment>('General');
  const [role, setRole] = useState<UserRole>('employee');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { errors, validate } = useJoiValidation(registerSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const isValid = validate({ name, email, password, department, role });
    if (!isValid) return;

    setIsLoading(true);
    try {
      const createdUser = await adminService.createUser({
        name,
        email,
        password,
        department,
        role,
      });

      dispatch(
        addToast({
          type: 'success',
          title: 'User Registered Successfully',
          message: `${createdUser.name} has been enrolled as ${createdUser.role} in ${createdUser.department.toUpperCase()} department.`,
        })
      );

      // Reset fields
      setName('');
      setEmail('');
      setPassword('');
      setDepartment('General');
      setRole('employee');

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setServerError(
        error.response?.data?.message || error.message || 'Failed to create user account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Employee / User"
      description="Register an employee account with department access permissions."
      maxWidth="md"
    >
      {serverError && (
        <div className="mb-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 p-3 border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Jane Doe"
          leftIcon={<User className="w-4 h-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <Input
          label="Enterprise Email"
          type="email"
          placeholder="jane.doe@programming.com"
          leftIcon={<Mail className="w-4 h-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <Input
          label="Temporary Initial Password"
          type="password"
          placeholder="Minimum 6 characters"
          leftIcon={<Lock className="w-4 h-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
              Department Scope
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as UserDepartment)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
            {errors.department && <p className="mt-1 text-xs text-rose-600">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
              Access Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="employee">Employee (Standard Access)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} leftIcon={<UserPlus className="w-4 h-4" />}>
            Register User
          </Button>
        </div>
      </form>
    </Modal>
  );
};
