import { useEffect, useState } from "react";
import {
  Bell,
  Lock,
  Mail,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoggedInUser } from "../features/auth/authSlice";

const settingTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

function Settings() {
  const dispatch = useDispatch();
  const { user, userLoading, userError } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) {
      dispatch(fetchLoggedInUser());
    }
  }, [dispatch, user]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">Settings</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Account Settings
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Manage your admin profile, access, and panel preferences.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="space-y-1">
            {settingTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon size={19} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {activeTab === "profile" && (
            <div>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    Logged In User
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Details fetched from your authenticated user API.
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
                  <ShieldCheck size={22} />
                </div>
              </div>

              {userLoading && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600">
                  Loading user details...
                </div>
              )}

              {userError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  {userError}
                </div>
              )}

              {user && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Name
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {user.name}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Username
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {user.username}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Role
                    </p>
                    <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                      {user.role}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Email
                    </p>
                    <p className="mt-2 flex min-w-0 items-center gap-2 text-base font-semibold text-slate-900">
                      <Mail size={17} className="shrink-0 text-slate-500" />
                      <span className="break-all">{user.email}</span>
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      User ID
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                      {user.id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "security" && (
            <SettingsPlaceholder
              title="Security"
              description="Password changes and access controls can be added here."
            />
          )}

          {activeTab === "notifications" && (
            <SettingsPlaceholder
              title="Notifications"
              description="Order, inventory, and low-stock alert preferences can be managed here."
            />
          )}

          {activeTab === "preferences" && (
            <SettingsPlaceholder
              title="Preferences"
              description="Dashboard display, timezone, and store preferences can be configured here."
            />
          )}
        </div>
      </section>
    </div>
  );
}

function SettingsPlaceholder({ title, description }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-sm font-medium text-slate-500">
        Settings controls coming soon.
      </div>
    </div>
  );
}

export default Settings;
