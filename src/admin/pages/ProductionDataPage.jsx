import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AlertTriangle, Database, RefreshCw, ShieldCheck } from "lucide-react";
import apiClient, { unwrapAdminResponse } from "../api/apiClient";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? "" : "s"}`;
  return JSON.stringify(value);
};

const getRows = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.records)) return data.records;
  if (Array.isArray(data?.transactions)) return data.transactions;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(data?.gigs)) return data.gigs;
  if (Array.isArray(data?.proposals)) return data.proposals;
  if (Array.isArray(data?.disputes)) return data.disputes;
  if (data && typeof data === "object") return [data];
  return [];
};

const getColumns = (rows, columns) => {
  if (columns?.length) return columns;
  const firstRow = rows.find((row) => row && typeof row === "object");
  if (!firstRow) return [];

  return Object.keys(firstRow)
    .filter((key) => !["__v", "password", "token", "refreshToken"].includes(key))
    .slice(0, 6)
    .map((key) => ({
      key,
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .replace(/^./, (char) => char.toUpperCase()),
    }));
};

const getRowId = (row) =>
  row?.id || row?._id || row?.jobId || row?.gigId || row?.proposalId || row?.contentId || row?.caseId || row?.disputeId || row?.wdId || row?.walletId || row?.escrowId;

const buildEndpoint = (action, row) => {
  if (typeof action.endpoint === "function") return action.endpoint(row);
  const id = getRowId(row);
  return action.endpoint?.replace(":id", encodeURIComponent(id || ""));
};

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
}) {
  const hasEndpoint = Boolean(endpoint);
  const query = useQuery({
    queryKey: ["admin-production-page", endpoint],
    enabled: hasEndpoint,
    queryFn: async () => {
      const response = await apiClient.get(endpoint);
      const { data, meta } = unwrapAdminResponse(response);
      return { rows: getRows(data), meta, raw: data };
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ action, row }) => {
      const actionEndpoint = buildEndpoint(action, row);
      const method = action.method || "patch";
      const reason = action.requireReason ? window.prompt(action.reasonPrompt || "Reason for this admin action") : null;

      if (action.requireReason && !reason) {
        throw new Error("A reason is required for this admin action.");
      }

      const payload = typeof action.body === "function" ? action.body(row, reason) : { ...(action.body || {}), ...(reason ? { reason } : {}) };
      const response = await apiClient.request({
        url: actionEndpoint,
        method,
        data: ["get", "delete"].includes(method.toLowerCase()) ? undefined : payload,
      });
      return unwrapAdminResponse(response).data;
    },
    onSuccess: (_data, variables) => {
      toast.success(variables.action.successMessage || "Admin action completed.");
      query.refetch();
    },
    onError: (error) => {
      toast.error(error?.message || error?.error || "Admin action failed.");
    },
  });

  const primaryMutation = useMutation({
    mutationFn: async () => {
      const values = {};
      for (const field of primaryAction.fields || []) {
        const value = window.prompt(field.prompt || field.label);
        if (field.required && !value) throw new Error(`${field.label || field.name} is required.`);
        values[field.name] = value;
      }

      const payload = primaryAction.body ? primaryAction.body(values) : values;
      const response = await apiClient.request({
        url: primaryAction.endpoint,
        method: primaryAction.method || "post",
        data: payload,
      });
      return unwrapAdminResponse(response).data;
    },
    onSuccess: () => {
      toast.success(primaryAction.successMessage || "Admin action completed.");
      query.refetch();
    },
    onError: (error) => {
      toast.error(error?.message || error?.error || "Admin action failed.");
    },
  });

  const rows = query.data?.rows || [];
  const tableColumns = getColumns(rows, columns);
  const total = query.data?.meta?.total ?? query.data?.meta?.count ?? rows.length;
  const visibleActions = actions.filter((action) => action?.endpoint);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <section className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-surface-dark p-6 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-300" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              {hasEndpoint ? <Database size={22} /> : <ShieldCheck size={22} />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300/80">
                Production Admin Surface
              </p>
              <h1 className="mt-2 text-2xl font-black text-white md:text-3xl">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                {description ||
                  "This page is wired for production behavior: authenticated admin requests, real loading states, empty states, and backend error visibility."}
              </p>
            </div>
          </div>

          {hasEndpoint && (
            <div className="flex flex-wrap gap-3">
              {primaryAction && (
                <button
                  type="button"
                  onClick={() => primaryMutation.mutate()}
                  disabled={primaryMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {primaryAction.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => query.refetch()}
                disabled={query.isFetching}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm font-bold text-white transition hover:border-emerald-400/50 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={16} className={query.isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          )}
        </div>
      </section>

      {!hasEndpoint && (
        <section className="rounded-[28px] border border-amber-400/20 bg-amber-400/5 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="mt-1 shrink-0 text-amber-300" size={24} />
            <div>
              <h2 className="text-lg font-black text-white">Backend integration required</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-100/80">
                {integrationNote ||
                  "This admin area has no confirmed production endpoint in the current admin backend module. It is intentionally blocked from displaying mock data until the backend route is available."}
              </p>
            </div>
          </div>
        </section>
      )}

      {hasEndpoint && (
        <section className="rounded-[32px] border border-zinc-800 bg-zinc-950/60 shadow-xl">
          <div className="flex flex-col gap-3 border-b border-zinc-800 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Live Backend Data</h2>
              <p className="mt-1 text-xs text-zinc-500">Endpoint: {endpoint}</p>
            </div>
            <span className="w-fit rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-300">
              {query.isLoading ? "Loading" : `${total} record${total === 1 ? "" : "s"}`}
            </span>
          </div>

          {query.isLoading && (
            <div className="grid gap-3 p-5">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-2xl bg-zinc-800/70" />
              ))}
            </div>
          )}

          {query.isError && (
            <div className="p-5">
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-100">
                <div className="font-black text-white">Unable to load this production endpoint.</div>
                <div className="mt-2 text-red-100/80">
                  {query.error?.message || query.error?.error || "The backend rejected or did not expose this route."}
                </div>
              </div>
            </div>
          )}

          {!query.isLoading && !query.isError && rows.length === 0 && (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400">
                <Database size={22} />
              </div>
              <h3 className="mt-4 text-lg font-black text-white">{emptyTitle}</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-500">{emptyDescription}</p>
            </div>
          )}

          {!query.isLoading && !query.isError && rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-900/60">
                  <tr>
                    {tableColumns.map((column) => (
                      <th
                        key={column.key}
                        className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-zinc-400"
                      >
                        {column.label}
                      </th>
                    ))}
                    {visibleActions.length > 0 && (
                      <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-zinc-400">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {rows.map((row, index) => (
                    <tr key={row.id || row._id || index} className="transition hover:bg-zinc-900/60">
                      {tableColumns.map((column) => (
                        <td key={column.key} className="max-w-xs truncate px-5 py-4 text-sm text-zinc-200">
                          {formatValue(row?.[column.key])}
                        </td>
                      ))}
                      {visibleActions.length > 0 && (
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap justify-end gap-2">
                            {visibleActions
                              .filter((action) => !action.showWhen || action.showWhen(row))
                              .map((action) => (
                                <button
                                  key={action.label}
                                  type="button"
                                  disabled={actionMutation.isPending}
                                  onClick={() => {
                                    const message = action.confirmMessage?.(row) || action.confirmMessage;
                                    if (message && !window.confirm(message)) return;
                                    actionMutation.mutate({ action, row });
                                  }}
                                  className={`rounded-xl border px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    action.variant === "danger"
                                      ? "border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                                      : action.variant === "warning"
                                        ? "border-amber-400/30 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20"
                                        : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
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
            </div>
          )}
        </section>
      )}
    </div>
  );
}
