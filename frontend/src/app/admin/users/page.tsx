// app/admin/users/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, UserPlus, Edit, Trash2, Lock, Unlock,
  Mail, Calendar, CheckCircle, XCircle, Loader2, Clock,
  AlertCircle, X, Save,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { EnhancedStatCard } from "@/components/ui/EnhancedStatCard";

interface RbacUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string;
  roles?: { id: string; name: string }[];
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface EditRoleModalProps {
  user: RbacUser;
  roles: Role[];
  onClose: () => void;
  onSaved: () => void;
}

function EditRoleModal({ user, roles, onClose, onSaved }: EditRoleModalProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    user.roles?.map((r) => r.id) ?? []
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const toggle = (id: string) =>
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  const handleSave = async () => {
    setSaving(true);
    setErr("");
    try {
      await apiClient.admin.rbac.replaceUserRoles(user.id, selectedRoleIds);
      onSaved();
      onClose();
    } catch (e: any) {
      setErr(e.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Chỉnh sửa vai trò</h3>
            <p className="text-sm text-gray-500">{user.name} — {user.email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {err && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />{err}
            </div>
          )}
          <p className="text-sm text-gray-600 mb-2">Chọn vai trò cho người dùng:</p>
          {roles.map((role) => (
            <label key={role.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors">
              <input
                type="checkbox"
                checked={selectedRoleIds.includes(role.id)}
                onChange={() => toggle(role.id)}
                className="w-4 h-4 accent-emerald-600"
              />
              <div>
                <p className="font-medium text-gray-800 capitalize">{role.name}</p>
                {role.description && <p className="text-xs text-gray-500">{role.description}</p>}
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [users, setUsers] = useState<RbacUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<RbacUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.admin.rbac.listUsers({
        search: searchTerm || undefined,
        role: selectedRole !== "all" ? selectedRole : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      });
      const list: RbacUser[] = Array.isArray(res.data)
        ? res.data
        : (res.data as any)?.items ?? [];
      setUsers(list);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedRole, selectedStatus]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await apiClient.admin.rbac.listRoles();
      setRoles(Array.isArray(res.data) ? res.data : []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "pending_verification": return "bg-yellow-100 text-yellow-700";
      case "suspended": return "bg-red-100 text-red-700";
      case "deleted": return "bg-gray-100 text-gray-500";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Hoạt động";
      case "pending_verification": return "Chờ xác thực";
      case "suspended": return "Bị khóa";
      case "deleted": return "Đã xóa";
      default: return status;
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  const activeCount = users.filter((u) => u.status === "active").length;
  const pendingCount = users.filter((u) => u.status === "pending_verification").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
          <p className="text-gray-600">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all">
          <UserPlus className="w-4 h-4" />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <EnhancedStatCard icon={Users} label="Tổng người dùng" value={users.length} change="" color="from-blue-500 to-blue-600" bgColor="bg-white" index={0} />
        <EnhancedStatCard icon={CheckCircle} label="Đang hoạt động" value={activeCount} change="" color="from-green-500 to-green-600" bgColor="bg-white" index={1} />
        <EnhancedStatCard icon={Clock} label="Chờ xác thực" value={pendingCount} change="" color="from-yellow-500 to-yellow-600" bgColor="bg-white" index={2} />
        <EnhancedStatCard icon={XCircle} label="Bị khóa" value={suspendedCount} change="" color="from-red-500 to-red-600" bgColor="bg-white" index={3} />
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="all">Tất cả vai trò</option>
            <option value="learner">Học viên</option>
            <option value="instructor">Giảng viên</option>
            <option value="curator">Curator</option>
            <option value="org_admin">Org Admin</option>
            <option value="admin">Admin</option>
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="pending_verification">Chờ xác thực</option>
            <option value="suspended">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={fetchUsers} className="ml-auto text-sm underline">Thử lại</button>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p>Không có người dùng nào</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <motion.tr key={user.id} variants={item} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.name?.charAt(0) ?? "?"}
                          </div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((r) => (
                              <span key={r.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium capitalize">
                                {r.name}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium capitalize">
                              {user.role}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusLabel(user.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            title="Chỉnh sửa vai trò"
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            title={user.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {user.status === "active"
                              ? <Lock className="w-4 h-4 text-yellow-500" />
                              : <Unlock className="w-4 h-4 text-green-500" />
                            }
                          </button>
                          <button title="Xóa người dùng" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <EditRoleModal
          user={editingUser}
          roles={roles}
          onClose={() => setEditingUser(null)}
          onSaved={fetchUsers}
        />
      )}
    </div>
  );
}
