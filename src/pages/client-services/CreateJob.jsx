import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, FilePlus2, MapPin, ShieldCheck } from "lucide-react";
import { clientWorkspaceAPI } from "../../Services/clientWorkspaceAPI";

const initialState = {
  title: "",
  category: "",
  subcategory: "",
  serviceMode: "Fully online",
  location: "Remote",
  budgetMin: "",
  budgetMax: "",
  deadline: "",
  description: "",
  tags: "",
  isUrgent: false,
  currency: "USD",
};

export default function CreateJob() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => ({
    ...initialState,
    title: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    serviceMode: searchParams.get("serviceMode") || initialState.serviceMode,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isValid = useMemo(() => {
    return (
      form.title.trim() &&
      form.category.trim() &&
      form.description.trim() &&
      Number(form.budgetMin) > 0 &&
      Number(form.budgetMax) >= Number(form.budgetMin)
    );
  }, [form]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid || saving) return;

    setSaving(true);
    setError("");

    try {
      await clientWorkspaceAPI.createJob({
        title: form.title.trim(),
        category: form.category.trim(),
        subcategory: form.subcategory.trim(),
        serviceMode: form.serviceMode,
        location: form.location.trim() || "Remote",
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        deadline: form.deadline || undefined,
        description: form.description.trim(),
        tags: form.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        isUrgent: form.isUrgent,
        currency: form.currency,
      });
      navigate("/client-services/my-jobs");
    } catch (err) {
      setError(err.message || "Could not create job.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-[#E5D9D0] bg-white p-6 shadow-[0_20px_50px_rgba(33,24,21,0.06)] lg:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#7A665E]">Create Job</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#2B211F]">Post a service request clients can actually manage</h1>
            <p className="mt-3 text-sm text-[#6F5B53]">
              This creates a buyer request in the shared backend, so freelancers can submit proposals and admins can still monitor the flow.
            </p>
          </div>
          <div className="rounded-2xl bg-[#FDECE7] p-3 text-[#B53A27]">
            <FilePlus2 size={20} />
          </div>
        </div>

        {error && <div className="mt-5 rounded-2xl border border-[#F3C0B7] bg-[#FFF2EF] px-4 py-3 text-sm text-[#9E3B2B]">{error}</div>}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Job title</span>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Need a React developer for dashboard rebuild" className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Category</span>
            <input name="category" value={form.category} onChange={handleChange} placeholder="Web Development" className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Subcategory</span>
            <input name="subcategory" value={form.subcategory} onChange={handleChange} placeholder="Frontend Engineering" className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Service mode</span>
            <select name="serviceMode" value={form.serviceMode} onChange={handleChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F]">
              <option>Fully online</option>
              <option>Physical on-site</option>
              <option>Hybrid (online + on-site)</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Location</span>
            <input name="location" value={form.location} onChange={handleChange} placeholder="Nairobi or Remote" className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Minimum budget</span>
            <input name="budgetMin" type="number" min="0" value={form.budgetMin} onChange={handleChange} placeholder="300" className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Maximum budget</span>
            <input name="budgetMax" type="number" min="0" value={form.budgetMax} onChange={handleChange} placeholder="1500" className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Currency</span>
            <select name="currency" value={form.currency} onChange={handleChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F]">
              <option>USD</option>
              <option>KES</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Deadline</span>
            <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Skills or tags</span>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="React, dashboard, API integration" className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">Project description</span>
            <textarea name="description" rows={6} value={form.description} onChange={handleChange} placeholder="Describe the work, deliverables, team context, and what success looks like." className="w-full rounded-2xl border border-[#E5D9D0] bg-[#FCFAF8] px-4 py-3 text-sm outline-none focus:border-[#C9452F] focus:ring-2 focus:ring-[#FADDD4]" />
          </label>
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-2xl bg-[#FCFAF8] px-4 py-3 text-sm text-[#5A4640]">
          <input type="checkbox" name="isUrgent" checked={form.isUrgent} onChange={handleChange} />
          Mark as urgent if you want faster attention from freelancers and support.
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!isValid || saving}
            className="rounded-full bg-[#C9452F] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#B53A27] disabled:opacity-60"
          >
            {saving ? "Creating job..." : "Create Job"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/client-services/my-jobs")}
            className="rounded-full border border-[#D7CBC4] bg-white px-5 py-3 text-sm font-medium text-[#2B211F]"
          >
            View My Jobs
          </button>
        </div>
      </form>

      <div className="space-y-5">
        <div className="rounded-[30px] border border-[#E5D9D0] bg-[linear-gradient(160deg,#2B211F,#44312C)] p-6 text-white shadow-[0_20px_50px_rgba(33,24,21,0.18)]">
          <h2 className="text-xl font-semibold">What happens after you create it?</h2>
          <div className="mt-4 space-y-3 text-sm text-white/80">
            <div className="rounded-2xl bg-white/10 px-4 py-3">Freelancers discover the request through the open buyer-requests system.</div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">Proposals connect back to your request through the shared proposals feature.</div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">Admins can still review platform activity through the existing admin system.</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#E5D9D0] bg-white p-6 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
          <div className="flex items-center gap-3 text-[#B53A27]">
            <CalendarDays size={18} />
            <p className="font-semibold text-[#2B211F]">Good client requests usually include</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-[#5F4B45]">
            <div className="rounded-2xl bg-[#FCFAF8] px-4 py-3">A clear outcome and deliverables.</div>
            <div className="rounded-2xl bg-[#FCFAF8] px-4 py-3">A budget range instead of a vague estimate.</div>
            <div className="rounded-2xl bg-[#FCFAF8] px-4 py-3">Location and service mode when the work is physical.</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#E5D9D0] bg-white p-6 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
          <div className="flex items-center gap-3 text-[#B53A27]">
            <MapPin size={18} />
            <ShieldCheck size={18} />
          </div>
          <p className="mt-3 text-sm text-[#6F5B53]">
            This client form is separate from the freelancer workspace, but it uses the same platform systems underneath so
            requests, proposals, contracts, payments, and admin tools stay connected.
          </p>
        </div>
      </div>
    </div>
  );
}
