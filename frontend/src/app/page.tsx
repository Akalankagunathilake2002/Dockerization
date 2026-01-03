"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ListChecks,
  Sparkles,
  RefreshCcw,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type User = { _id: string; name: string; email: string };
type Task = {
  _id: string;
  title: string;
  description: string;
  userId: string;
  createdAt?: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const cardPop = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, scale: 0.98, y: 10, transition: { duration: 0.2 } },
};

export default function Home() {
  const [tab, setTab] = useState<"users" | "tasks">("users");

  return (
    <main className="min-h-screen bg-[#070A12] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <div className="absolute top-24 left-10 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-indigo-500/15 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.06)_1px,transparent_0)] [background-size:22px_22px] opacity-40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <Sparkles className="h-4 w-4" />
              Welcome to Task dashboard using dockerization with NEXT.JS
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Manage <span className="text-white/80">Users</span> &{" "}
              <span className="text-white/80">Tasks</span>
            </h1>

           
          </div>

          {/* Tabs */}
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-2 shadow-[0_0_0_1px_rgba(255,255,255,.06)] backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2">
              <TabButton
                active={tab === "users"}
                onClick={() => setTab("users")}
                icon={<Users className="h-4 w-4" />}
                label="Users"
              />
              <TabButton
                active={tab === "tasks"}
                onClick={() => setTab("tasks")}
                icon={<ListChecks className="h-4 w-4" />}
                label="Tasks"
              />
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {tab === "users" ? (
              <motion.div
                key="users"
                variants={cardPop}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <UsersPanel />
              </motion.div>
            ) : (
              <motion.div
                key="tasks"
                variants={cardPop}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <TasksPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.footer
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 text-xs text-white/50"
        >
         
        </motion.footer>
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "relative flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
        active ? "text-slate-900" : "text-white/80 hover:bg-white/10"
      )}
    >
      {active && (
        <motion.span
          layoutId="activeTab"
          className="absolute inset-0 rounded-xl bg-white shadow-sm"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
      <span className={cx("relative z-10", active ? "text-slate-900" : "")}>
        {icon}
      </span>
      <span className={cx("relative z-10", active ? "text-slate-900" : "")}>
        {label}
      </span>
    </button>
  );
}

/* ---------------- USERS ---------------- */

function UsersPanel() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: "ok" | "err" | null; msg?: string }>({ type: null });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function refresh() {
    setLoading(true);
    setStatus({ type: null });
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load users");
      setItems(data);
      setStatus({ type: "ok", msg: "Users loaded" });
    } catch (e: any) {
      setStatus({ type: "err", msg: e.message });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus((s) => (s.type === "ok" ? { type: null } : s)), 1200);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createUser() {
    setStatus({ type: null });
    try {
      if (!name.trim() || !email.trim()) {
        setStatus({ type: "err", msg: "Please enter name and email." });
        return;
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create user");

      setName("");
      setEmail("");
      setStatus({ type: "ok", msg: "User created ✅" });
      await refresh();
    } catch (e: any) {
      setStatus({ type: "err", msg: e.message });
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,.06)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Users</h2>
          <p className="text-sm text-white/70">Create and view users stored.</p>
        </div>

        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 transition"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <StatusPill status={status} />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassCard title="Create user" subtitle="Fast create (no validation) — just demo">
          <div className="grid gap-3">
            <Input value={name} onChange={setName} placeholder="Name" />
            <Input value={email} onChange={setEmail} placeholder="Email" />
            <PrimaryButton onClick={createUser} icon={<PlusCircle className="h-4 w-4" />}>
              Create User
            </PrimaryButton>
          </div>
        </GlassCard>

        <GlassCard title="User list" subtitle="Animated list with hover effects">
          {loading ? (
            <ShimmerList />
          ) : items.length === 0 ? (
            <EmptyState text="No users yet. Create one on the left." />
          ) : (
            <div className="max-h-[380px] space-y-3 overflow-auto pr-2">
              <AnimatePresence>
                {items.map((u) => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-sm text-white/70">{u.email}</p>
                      </div>
                      <span className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                        user
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-white/50">ID: {u._id}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
}

/* ---------------- TASKS ---------------- */

function TasksPanel() {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: "ok" | "err" | null; msg?: string }>({ type: null });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");

  async function refresh() {
    setLoading(true);
    setStatus({ type: null });
    try {
      const res = await fetch("/api/tasks", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load tasks");
      setItems(data);
      setStatus({ type: "ok", msg: "Tasks loaded" });
    } catch (e: any) {
      setStatus({ type: "err", msg: e.message });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus((s) => (s.type === "ok" ? { type: null } : s)), 1200);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createTask() {
    setStatus({ type: null });
    try {
      if (!title.trim() || !userId.trim()) {
        setStatus({ type: "err", msg: "Title and User ID are required." });
        return;
      }

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create task");

      setTitle("");
      setDescription("");
      setStatus({ type: "ok", msg: "Task created → RabbitMQ event sent ✅" });
      await refresh();
    } catch (e: any) {
      setStatus({ type: "err", msg: e.message });
    }
  }

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }, [items]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,.06)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Tasks</h2>
          <p className="text-sm text-white/70">
            Creating a task publishes <span className="font-semibold text-white">with RabbitMQ</span> 
          </p>
        </div>

        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 transition"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <StatusPill status={status} />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassCard title="Create task" subtitle="Triggers RabbitMQ → notification-service">
          <div className="grid gap-3">
            <Input value={title} onChange={setTitle} placeholder="Title (required)" />
            <Textarea value={description} onChange={setDescription} placeholder="Description (optional)" />
            <Input value={userId} onChange={setUserId} placeholder="User ID (required) e.g. 1" />
            <PrimaryButton onClick={createTask} icon={<PlusCircle className="h-4 w-4" />}>
              Create Task
            </PrimaryButton>
          </div>
        </GlassCard>

        <GlassCard title="Task list" subtitle="Newest tasks appear first">
          {loading ? (
            <ShimmerList />
          ) : sorted.length === 0 ? (
            <EmptyState text="No tasks yet. Create one on the left." />
          ) : (
            <div className="max-h-[380px] space-y-3 overflow-auto pr-2">
              <AnimatePresence>
                {sorted.map((t) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{t.title}</p>
                        <p className="mt-1 text-sm text-white/70 line-clamp-2">
                          {t.description || "—"}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                        userId: {t.userId}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-white/50">ID: {t._id}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
}

/* ---------------- UI bits ---------------- */

function GlassCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_0_0_1px_rgba(255,255,255,.04)]">
      <div className="mb-4">
        <h3 className="font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/20"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-h-[110px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/20"
    />
  );
}

function PrimaryButton({
  children,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-slate-900 shadow-lg shadow-white/10 transition hover:opacity-95"
    >
      {icon}
      {children}
    </motion.button>
  );
}

function StatusPill({
  status,
}: {
  status: { type: "ok" | "err" | null; msg?: string };
}) {
  if (!status.type) return null;

  const isOk = status.type === "ok";
  return (
    <div
      className={cx(
        "mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
        isOk
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
          : "border-red-400/20 bg-red-400/10 text-red-200"
      )}
    >
      {isOk ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
      {status.msg}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
      {text}
    </div>
  );
}

function ShimmerList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-20 rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
        >
          <div className="h-full w-full animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
        </div>
      ))}
    </div>
  );
}
