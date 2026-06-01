import React, { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  AlertTriangle, Database, RefreshCw, ShieldCheck,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Filter, Search
} from "lucide-react";
import apiClient, { unwrapAdminResponse } from "../api/apiClient";
import { ConfirmModal, SuccessOverlay, PrimaryActionModal } from "../components/ui/AdminModals";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return <span className="text-zinc-600 italic">—</span>;
  if (typeof value === "boolean") return value
    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-400">Yes</span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-zinc-700/60 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-400">No</span>;
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") {
    // Status badges
    const statusColors = {
      ACTIVE: "bg-emerald-500/15 text-emerald-400", active: "bg-emerald-500/15 text-emerald-400",
      PENDING: "bg-amber-500/15 text-amber-400", pending: "bg-amber-500/15 text-amber-400",
      RESOLVED: "bg-sky-500/15 text-sky-400", resolved: "bg-sky-500/15 text-sky-400",
      REJECTED: "bg-red-500/15 text-red-400", rejected: "bg-red-500/15 text-red-400",
      CANCELLED: "bg-zinc-500/15 text-zinc-400", cancelled: "bg-zinc-500/15 text-zinc-400",
      COMPLETED: "bg-emerald-500/15 text-emerald-400", completed: "bg-emerald-500/15 text-emerald-400",
      FLAGGED: "bg-red-500/15 text-red-400", flagged: "bg-red-500/15 text-red-400",
      BLACKLISTED: "bg-red-600/20 text-red-300", blacklisted: "bg-red-600/20 text-red-300",
      open: "bg-amber-500/15 text-amber-400", OPEN: "bg-amber-500/15 text-amber-400",
      ENABLED: "bg-emerald-500/15 text-emerald-400", DISABLED: "bg-zinc-500/15 text-zinc-400",
    };
    if (statusColors[value]) {
      return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusColors[value]}`}>{value}</span>;
    }
    // Long strings truncate
    if (value.length > 40) return <span title={value}>{value.slice(0, 40)}…</span>;
    return value;
  }
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? "" : "s"}`;
  if (typeof value === "object") {
    // Nested objects like { amount, currency }
    if (value.amount !== undefined) return `${value.currency || ""} ${Number(value.amount / 100).toLocaleString()}`;
    if (value.name !== undefined) return value.name;
    return JSON.stringify(value).slice(0, 50);
  }
  return String(value);
};

const getRows = (data) => {
  if (Array.isArray(data)) return data;
  const keys = [
    "items", "results", "records", "data",
    "transactions", "users", "jobs", "gigs", "proposals",
    "disputes", "deposits", "refunds", "subscriptions", "payouts",
    "wallets", "withdrawals", "entries", "rules", "conversations",
    "messages", "logs", "contracts", "categories", "rankings",
    "reports", "anomalies", "accounts",
  ];
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  if (data && typeof data === "object") return [data];
  return [];
};

const getColumns = (rows, columns) => {
  if (columns?.length) return columns;
  const firstRow = rows.find((row) => row && typeof row === "object");
  if (!firstRow) return [];
  return Object.keys(firstRow)
    .filter((key) => !["__v", "password", "token", "refreshToken", "hash", "salt", "secret"].includes(key))
    .slice(0, 7)
    .map((key) => ({
      key,
      label: key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/^./, (c) => c.toUpperCase()),
    }));
};

const getRowId = (row) =>
  row?.id || row?._id || row?.jobId || row?.gigId || row?.proposalId ||
  row?.contentId || row?.caseId || row?.disputeId || row?.wdId ||
  row?.walletId || row?.escrowId || row?.messageId || row?.ruleId;

const buildEndpoint = (action, row) => {
  if (typeof action.endpoint === "function") return action.endpoint(row);
  const id = getRowId(row);
  return action.endpoint?.replace(":id", encodeURIComponent(id || ""));
};

// ─── Pagination Controls ──────────────────────────────────────────────────────
function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-t border-zinc-800">
      <p className="text-xs text-zinc-500 font-medium">
        Showing <span className="font-bold text-zinc-300">{((page - 1) * limit) + 1}–{Math.min(page * limit, total)}</span> of <span className="font-bold text-zinc-300">{total.toLocaleString()}</span> records
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>

        {pages[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 text-xs font-bold text-zinc-400 hover:text-white transition-colors">1</button>
            {pages[0] > 2 && <span className="text-zinc-600 px-1">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-black transition-colors ${
              p === page
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="text-zinc-600 px-1">…</span>}
            <button onClick={() => onPageChange(totalPages)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 text-xs font-bold text-zinc-400 hover:text-white transition-colors">{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

export default function ProductionDataPage({
  title,
  description,
  endpoint,
  columns,
  actions = [],
  primaryAction,
  emptyTitle = "No records returned yet",
  emptyDescription = "The backend responded successfully, but there is no data for this view.",
  integrationNote,
  searchable = true,
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Modal states
  const [confirmModal, setConfirmModal] = useState(null); // { action, row }
  const [primaryModal, setPrimaryModal] = useState(false);
  const [successOverlay, setSuccessOverlay] = useState(null); // { message }

  const hasEndpoint = Boolean(endpoint);

  // Build query URL with pagination + search
  const buildUrl = useCallback(() => {
    if (!endpoint) return null;
    const base = endpoint.includes("?") ? `${endpoint}&` : `${endpoint}?`;
    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (search.trim()) params.set("search", search.trim());
    return `${base}${params.toString()}`;
  }, [endpoint, page, search]);

  const query = useQuery({
    queryKey: ["admin-production-page", endpoint, page, search],
    enabled: hasEndpoint,
    queryFn: async () => {
      const response = await apiClient.get(buildUrl());
      const { data, meta } = unwrapAdminResponse(response);
      return { rows: getRows(data), meta, raw: data };
    },
    keepPreviousData: true,
  });

  const rows = query.data?.rows || [];
  const meta = query.data?.meta || {};
  const total = meta.total ?? meta.count ?? rows.length;
  const totalPages = (meta.totalPages ?? meta.pages ?? Math.ceil(total / PAGE_SIZE)) || 1;
  const tableColumns = getColumns(rows, columns);
  const visibleActions = actions.filter((a) => a?.endpoint);

  // ─── Action Mutation ─────────────────────────────────────────────────────────
  const actionMutation = useMutation({
    mutationFn: async ({ action, row, reason }) => {
      const actionEndpoint = buildEndpoint(action, row);
      const method = (action.method || "patch").toLowerCase();
      const payload = typeof action.body === "function"
        ? action.body(row, reason)
        : { ...(action.body || {}), ...(reason ? { reason } : {}) };
      const response = await apiClient.request({
        url: actionEndpoint,
        method,
        data: ["get", "delete"].includes(method) ? undefined : payload,
      });
      return unwrapAdminResponse(response).data;
    },
    onSuccess: (_data, variables) => {
      const msg = variables.action.successMessage || "Admin action completed.";
      setSuccessOverlay({ message: msg });
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["admin-production-page", endpoint] });
      setConfirmModal(null);
    },
    onError: (error) => {
      const msg = error?.message || error?.error || "Admin action failed. Check server logs.";
      toast.error(msg);
      setConfirmModal(null);
    },
  });

  // ─── Primary Mutation ─────────────────────────────────────────────────────────
  const primaryMutation = useMutation({
    mutationFn: async (values) => {
      const payload = primaryAction.body ? primaryAction.body(values) : values;
      const response = await apiClient.request({
        url: primaryAction.endpoint,
        method: primaryAction.method || "post",
        data: payload,
      });
      return unwrapAdminResponse(response).data;
    },
    onSuccess: () => {
      const msg = primaryAction.successMessage || "Record created successfully.";
      setSuccessOverlay({ message: msg });
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["admin-production-page", endpoint] });
      setPrimaryModal(false);
    },
    onError: (error) => {
      toast.error(error?.message || error?.error || "Action failed.");
    },
  });

  // ─── Trigger action click ─────────────────────────────────────────────────────
  const handleActionClick = (action, row) => {
    if (action.requireReason || action.confirmMessage) {
      setConfirmModal({ action, row });
    } else {
      // No confirm needed — fire immediately
      actionMutation.mutate({ action, row, reason: undefined });
    }
  };

  // ─── Search with debounce ─────────────────────────────────────────────────────
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <>
      {/* Modals */}
      {confirmModal && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setConfirmModal(null)}
          onConfirm={(reason) => actionMutation.mutate({ action: confirmModal.action, row: confirmModal.row, reason })}
          title={confirmModal.action.confirmTitle || `Confirm: ${confirmModal.action.label}`}
          message={
            typeof confirmModal.action.confirmMessage === "function"
              ? confirmModal.action.confirmMessage(confirmModal.row)
              : confirmModal.action.confirmMessage
          }
          requireReason={confirmModal.action.requireReason}
          reasonLabel={confirmModal.action.reasonPrompt}
          variant={confirmModal.action.variant || "default"}
          isPending={actionMutation.isPending}
        />
      )}

      {primaryAction && (
        <PrimaryActionModal
          isOpen={primaryModal}
          onClose={() => setPrimaryModal(false)}
          onSubmit={(values) => primaryMutation.mutate(values)}
          action={primaryAction}
          isPending={primaryMutation.isPending}
        />
      )}

      {successOverlay && (
        <SuccessOverlay
          isOpen={true}
          message={successOverlay.message}
          onClose={() => setSuccessOverlay(null)}
        />
      )}

      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
        {/* Header Card */}
        <section className="relative overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                {hasEndpoint ? <Database size={20} /> : <ShieldCheck size={20} />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300/70">Live Admin Module</p>
                <h1 className="mt-0.5 text-xl font-black text-white">{title}</h1>
                {description && <p className="mt-0.5 text-xs text-zinc-500 max-w-2xl">{description}</p>}
              </div>
            </div>

            {hasEndpoint && (
              <div className="flex flex-wrap items-center gap-2">
                {primaryAction && (
                  <button
                    type="button"
                    onClick={() => setPrimaryModal(true)}
                    disabled={primaryMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-black text-emerald-100 transition hover:bg-emerald-500/20 disabled:opacity-50"
                  >
                    {primaryAction.label}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setPage(1); query.refetch(); }}
                  disabled={query.isFetching}
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white transition hover:border-zinc-500 hover:text-emerald-200 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={query.isFetching ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>
            )}
          </div>
        </section>

        {/* No Endpoint Warning */}
        {!hasEndpoint && (
          <section className="rounded-[24px] border border-amber-400/20 bg-amber-400/5 p-5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="mt-0.5 shrink-0 text-amber-300" size={22} />
              <div>
                <h2 className="text-base font-black text-white">Backend integration pending</h2>
                <p className="mt-1.5 text-sm text-amber-100/70 leading-relaxed max-w-2xl">
                  {integrationNote || "This admin area has no confirmed production endpoint. No mock data will be shown."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Data Table */}
        {hasEndpoint && (
          <section className="rounded-[28px] border border-zinc-800 bg-zinc-950/70 shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="flex flex-col gap-3 border-b border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-black text-white">Records</h2>
                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-xs font-bold text-zinc-300">
                  {query.isLoading ? "…" : total.toLocaleString()}
                </span>
              </div>
              {searchable && (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search records…"
                    className="w-full sm:w-56 rounded-2xl border border-zinc-700 bg-zinc-900 pl-9 pr-4 py-2 text-sm text-zinc-200 outline-none placeholder-zinc-600 focus:border-zinc-500 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Loading Skeleton */}
            {query.isLoading && (
              <div className="grid gap-2 p-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-2xl bg-zinc-800/60" />
                ))}
              </div>
            )}

            {/* Error State */}
            {query.isError && (
              <div className="p-5">
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
                  <div className="text-sm font-black text-white mb-1">Unable to load data from this endpoint</div>
                  <div className="text-sm text-red-200/70">
                    {query.error?.message || query.error?.error || "The backend rejected or did not expose this route. Ensure the server is running and the route is registered."}
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 font-mono">Endpoint: {endpoint}</div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!query.isLoading && !query.isError && rows.length === 0 && (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-500 mb-4">
                  <Database size={22} />
                </div>
                <h3 className="text-base font-black text-white">{emptyTitle}</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500 leading-relaxed">{emptyDescription}</p>
                {search && (
                  <button onClick={() => { setSearch(""); setPage(1); }} className="mt-4 text-xs font-bold text-emerald-400 hover:underline">
                    Clear search filters
                  </button>
                )}
              </div>
            )}

            {/* Table */}
            {!query.isLoading && !query.isError && rows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40">
                      {tableColumns.map((col) => (
                        <th key={col.key} className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          {col.label}
                        </th>
                      ))}
                      {visibleActions.length > 0 && (
                        <th className="px-5 py-3.5 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {rows.map((row, index) => (
                      <tr
                        key={getRowId(row) || index}
                        className="group transition-colors hover:bg-zinc-900/50"
                      >
                        {tableColumns.map((col) => (
                          <td key={col.key} className="px-5 py-3.5 text-sm text-zinc-300 max-w-[200px]">
                            <div className="truncate">{formatValue(row?.[col.key])}</div>
                          </td>
                        ))}
                        {visibleActions.length > 0 && (
                          <td className="px-5 py-3.5">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              {visibleActions
                                .filter((a) => !a.showWhen || a.showWhen(row))
                                .map((action) => (
                                  <button
                                    key={action.label}
                                    type="button"
                                    disabled={actionMutation.isPending}
                                    onClick={() => handleActionClick(action, row)}
                                    className={`rounded-xl border px-3 py-1.5 text-[11px] font-black tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                                      action.variant === "danger"
                                        ? "border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-400/50"
                                        : action.variant === "warning"
                                          ? "border-amber-400/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400/50"
                                          : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-400/50"
                                    }`}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  limit={PAGE_SIZE}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
