import { useState, useRef } from "react";
import {
  UserIcon,
  LockIcon,
  ImageIcon,
  ImageStackIcon,
  UploadIcon,
  EyeIcon,
  EyeOffIcon,
} from "./Icons";

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [toast, setToast] = useState(null);

  const avatarRef = useRef();
  const coverRef = useRef();

  const [accountForm, setAccountForm] = useState({ fullName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    if (!accountForm.fullName || !accountForm.email)
      return showToast("All fields are required", "error");
    // TODO: call updateAccountDetails API
    showToast("Account details updated successfully!");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    )
      return showToast("All fields are required", "error");
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return showToast("New passwords do not match", "error");
    if (passwordForm.newPassword.length < 8)
      return showToast("Password must be at least 8 characters", "error");
    // TODO: call changeCurrentPassword API
    showToast("Password changed successfully!");
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarSubmit = () => {
    if (!avatarPreview)
      return showToast("Please select an avatar image", "error");
    // TODO: call updateUserAvatar API with avatarRef.current.files[0]
    showToast("Avatar updated successfully!");
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleCoverSubmit = () => {
    if (!coverPreview) return showToast("Please select a cover image", "error");
    // TODO: call updateUsercoverImage API with coverRef.current.files[0]
    showToast("Cover image updated successfully!");
  };

  const tabs = [
    { id: "account", label: "Account Details", icon: UserIcon },
    { id: "password", label: "Change Password", icon: LockIcon },
    { id: "avatar", label: "Avatar", icon: ImageIcon },
    { id: "cover", label: "Cover Image", icon: ImageStackIcon },
  ];

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all duration-300
            ${toast.type === "error" ? "bg-red-600/90 text-white" : "bg-violet-600/90 text-white"}`}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Edit Profile
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <aside className="lg:w-56 shrink-0">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 w-full text-left
                    ${
                      activeTab === tab.id
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                    }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Panel */}
          <main className="flex-1 min-w-0">
            {/* ── ACCOUNT DETAILS ── */}
            {activeTab === "account" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-semibold mb-1">Account Details</h2>
                <p className="text-zinc-500 text-sm mb-6">
                  Update your name and email address
                </p>
                <form onSubmit={handleAccountSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={accountForm.fullName}
                      onChange={(e) =>
                        setAccountForm({
                          ...accountForm,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Your full name"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={accountForm.email}
                      onChange={(e) =>
                        setAccountForm({
                          ...accountForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="you@example.com"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/40 active:scale-95"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── CHANGE PASSWORD ── */}
            {activeTab === "password" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-semibold mb-1">Change Password</h2>
                <p className="text-zinc-500 text-sm mb-6">
                  Make sure your new password is at least 6 characters
                </p>
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  {[
                    {
                      key: "old",
                      label: "Current Password",
                      field: "oldPassword",
                      placeholder: "Enter current password",
                    },
                    {
                      key: "new",
                      label: "New Password",
                      field: "newPassword",
                      placeholder: "Enter new password",
                    },
                    {
                      key: "confirm",
                      label: "Confirm New Password",
                      field: "confirmPassword",
                      placeholder: "Re-enter new password",
                    },
                  ].map(({ key, label, field, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type={showPass[key] ? "text" : "password"}
                          value={passwordForm[field]}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              [field]: e.target.value,
                            })
                          }
                          placeholder={placeholder}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPass((p) => ({ ...p, [key]: !p[key] }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {showPass[key] ? (
                            <EyeOffIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Password strength bar */}
                  {passwordForm.newPassword && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-zinc-500">
                          Password strength
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            passwordForm.newPassword.length < 6
                              ? "text-red-400"
                              : passwordForm.newPassword.length < 10
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {passwordForm.newPassword.length < 6
                            ? "Weak"
                            : passwordForm.newPassword.length < 10
                              ? "Fair"
                              : "Strong"}
                        </span>
                      </div>
                      <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            passwordForm.newPassword.length < 6
                              ? "w-1/4 bg-red-500"
                              : passwordForm.newPassword.length < 10
                                ? "w-2/4 bg-yellow-500"
                                : "w-full bg-green-500"
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/40 active:scale-95"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── AVATAR ── */}
            {activeTab === "avatar" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-semibold mb-1">Profile Avatar</h2>
                <p className="text-zinc-500 text-sm mb-6">
                  Upload a new profile picture. Recommended: square image, at
                  least 200×200px.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* Preview circle */}
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 rounded-full border-2 border-zinc-700 overflow-hidden bg-zinc-800 flex items-center justify-center">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon size={40} className="text-zinc-600" />
                      )}
                    </div>
                    {avatarPreview && (
                      <button
                        onClick={() => {
                          setAvatarPreview(null);
                          avatarRef.current.value = "";
                        }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <input
                      ref={avatarRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-all duration-200 group"
                    >
                      <UploadIcon
                        size={24}
                        className="text-zinc-600 group-hover:text-violet-400 mb-2 transition-colors"
                      />
                      <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                        Click to select image
                      </span>
                      <span className="text-xs text-zinc-600 mt-1">
                        PNG, JPG, WEBP up to 10MB
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-800">
                  <button
                    onClick={handleAvatarSubmit}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/40 active:scale-95 disabled:opacity-40"
                    disabled={!avatarPreview}
                  >
                    Save Avatar
                  </button>
                </div>
              </div>
            )}

            {/* ── COVER IMAGE ── */}
            {activeTab === "cover" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-semibold mb-1">Cover Image</h2>
                <p className="text-zinc-500 text-sm mb-6">
                  This banner appears at the top of your channel. Recommended:
                  1280×360px.
                </p>

                {/* Preview banner */}
                <div className="w-full h-40 rounded-xl border border-zinc-700 overflow-hidden bg-zinc-800 flex items-center justify-center mb-6 relative">
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setCoverPreview(null);
                          coverRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-600">
                      <ImageStackIcon size={32} />
                      <span className="text-sm">No cover image selected</span>
                    </div>
                  )}
                </div>

                <input
                  ref={coverRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-all duration-200 group"
                >
                  <UploadIcon
                    size={18}
                    className="text-zinc-600 group-hover:text-violet-400 transition-colors"
                  />
                  <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    Click to select cover image
                  </span>
                </label>

                <div className="mt-6 pt-5 border-t border-zinc-800">
                  <button
                    onClick={handleCoverSubmit}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/40 active:scale-95 disabled:opacity-40"
                    disabled={!coverPreview}
                  >
                    Save Cover Image
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
