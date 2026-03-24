"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  X, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  Search,
  Settings as SettingsIcon,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

// --- Types ---
interface Permission {
  id: string;
  name: string;
  code: string;
  module: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions?: Permission[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  roles?: Role[];
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "permissions" | "users">("roles");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Role Assignment State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [savingRoles, setSavingRoles] = useState(false);
  const [userRoleIds, setUserRoleIds] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (activeTab === "roles") {
        res = await apiClient.admin.rbac.listRoles();
      } else if (activeTab === "permissions") {
        res = await apiClient.admin.rbac.listPermissions();
      } else if (activeTab === "users") {
        res = await apiClient.admin.rbac.listUsers({ limit: 100 });
      }

      if (res) {
        const resData = res.data as any;
        let items = [];
        if (Array.isArray(resData)) {
          items = resData;
        } else if (resData && Array.isArray(resData.data)) {
          items = resData.data;
        } else if (resData && Array.isArray(resData.items)) {
          items = resData.items;
        }

        if (activeTab === "roles") setRoles(items);
        else if (activeTab === "permissions") setPermissions(items);
        else if (activeTab === "users") setUsers(items);
      }
    } catch (err: any) {
      console.error("Failed to fetch RBAC data", err);
      setError(err.message || "Không thể tải dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Load roles once if not already loaded to use in modal
  useEffect(() => {
    if (roles.length === 0 && activeTab !== "roles") {
      apiClient.admin.rbac.listRoles().then(res => {
        const resData = res.data as any;
        const items = Array.isArray(resData) ? resData : (resData?.data || resData?.items || []);
        setRoles(items);
      }).catch(console.error);
    }
  }, []);

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    const currentRoleIds = user.roles?.map(r => r.id) || [];
    setUserRoleIds(currentRoleIds);
    setShowRoleModal(true);
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;
    setSavingRoles(true);
    try {
      await apiClient.admin.rbac.replaceUserRoles(selectedUser.id, userRoleIds);
      setShowRoleModal(false);
      fetchData(); // Refresh user list
    } catch (err: any) {
      alert(err.message || "Lỗi khi cập nhật vai trò");
    } finally {
      setSavingRoles(false);
    }
  };

  const toggleRoleId = (id: string) => {
    setUserRoleIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const tabs = [
    { id: "roles", label: "Vai trò", icon: Shield, desc: "Quản lý nhóm quyền" },
    { id: "permissions", label: "Quyền hạn", icon: Lock, desc: "Danh mục hành động" },
    { id: "users", label: "Phân quyền User", icon: Users, desc: "Gán vai trò cho người dùng" },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Role Assignment Modal */}
      <AnimatePresence>
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Gán vai trò</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Người dùng: {selectedUser.name}</p>
                </div>
                <button onClick={() => setShowRoleModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-2 max-h-[400px] overflow-y-auto">
                {roles.map(role => (
                  <button 
                    key={role.id}
                    onClick={() => toggleRoleId(role.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                      userRoleIds.includes(role.id)
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${
                        userRoleIds.includes(role.id) ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                      }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${userRoleIds.includes(role.id) ? "text-emerald-900" : "text-gray-700"}`}>
                          {role.name}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{role.code}</p>
                      </div>
                    </div>
                    {userRoleIds.includes(role.id) && (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleSaveRoles}
                  disabled={savingRoles}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {savingRoles ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  {savingRoles ? "Đang lưu..." : "Cập nhật"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800"></h1>
          <p className="text-gray-500 text-sm mt-0.5"></p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-all font-bold text-sm">
            <Plus className="w-4 h-4" />
            <span>Thêm mới</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-1 text-sm font-bold transition-all relative ${
                isActive ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </div>
              {isActive && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={`Tìm kiếm ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Sắp xếp: Mới nhất</span>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-gray-400 text-xs font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <h3 className="font-bold text-gray-900">Không thể tải dữ liệu</h3>
              <p className="text-gray-500 text-sm mt-1">{error}</p>
              <button onClick={fetchData} className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-gray-700">
                Thử lại
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "roles" && (
                <motion.div
                  key="roles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-3"
                >
                  {roles.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-white border border-gray-200 rounded-lg">Chưa có vai trò nào.</div>
                  ) : (
                    roles.map((role) => (
                      <div key={role.id} className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-800">{role.name}</h4>
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-tight">{role.code}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                          <ChevronRight className="w-4 h-4 text-gray-300 ml-1" />
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === "permissions" && (
                <motion.div
                  key="permissions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {permissions.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400 bg-white border border-gray-200 rounded-lg">Chưa có quyền hạn nào.</div>
                  ) : (
                    permissions.map((perm) => (
                      <div key={perm.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-all group">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase">{perm.module}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{perm.code}</span>
                            </div>
                            <h4 className="font-bold text-gray-800 text-sm">{perm.name}</h4>
                            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{perm.description}</p>
                          </div>
                          <button className="p-1.5 text-gray-300 hover:text-emerald-600 transition-colors"><SettingsIcon className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-3"
                >
                  {users.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-white border border-gray-200 rounded-lg">Không tìm thấy người dùng.</div>
                  ) : (
                    users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center font-bold text-sm shadow-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm">{u.name}</h4>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Quyền hạn</span>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg">
                              <Shield className="w-3 h-3 text-emerald-600" />
                              <span className="text-[10px] font-bold text-gray-700">
                                {u.role?.toUpperCase() || u.roles?.[0]?.code?.toUpperCase() || 'LEARNER'}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleOpenRoleModal(u)}
                            className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-300 rounded-lg transition-all"
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
      </div>
    </div>
  );
}
