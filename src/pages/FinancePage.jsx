import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CreditCard,
  Landmark,
  Loader2,
  Phone,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { getUser, paymentAPI, walletAPI } from "../Services/api";
import WorkspaceToolLayout from "./WorkspaceToolLayout";

const tabs = [
  { id: "wallet", label: "Wallet" },
  { id: "payments", label: "Payments" },
];

const payoutOptions = [
  {
    id: "paypal",
    title: "PayPal",
    description: "Best for international payouts and account-based withdrawals.",
    accent: "from-[#0A4EA4] to-[#1396D3]",
    fields: [
      { id: "email", label: "PayPal email", placeholder: "payments@example.com" },
    ],
  },
  {
    id: "mpesa",
    title: "M-Pesa",
    description: "Fast mobile-money payouts for freelancers in East Africa.",
    accent: "from-[#17A04B] to-[#4CC76A]",
    fields: [
      { id: "phoneNumber", label: "M-Pesa number", placeholder: "+2547..." },
      { id: "accountName", label: "Registered name", placeholder: "Account holder name" },
    ],
  },
  {
    id: "airtel_money",
    title: "Airtel Money",
    description: "Simple mobile-wallet payouts with a direct phone-based setup.",
    accent: "from-[#B71C1C] to-[#E53935]",
    fields: [
      { id: "phoneNumber", label: "Airtel Money number", placeholder: "+2547..." },
      { id: "accountName", label: "Registered name", placeholder: "Account holder name" },
    ],
  },
];

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "0";
  if (typeof value === "string") return value;
  return new Intl.NumberFormat().format(Number(value) || 0);
}

function FinanceMetric({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-[28px] border border-[#E7DDD8] bg-white p-5 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6F5B53]">{label}</p>
        <div className="rounded-2xl bg-[#F8EDE8] p-2 text-[#B53A27]">
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 text-2xl font-semibold text-[#2B211F]">{value}</div>
      {note && <p className="mt-2 text-sm text-[#8C766D]">{note}</p>}
    </div>
  );
}

function MethodCard({ option, selected, values, saving, onSelect, onChange, onSave }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#E7DDD8] bg-white shadow-[0_20px_45px_rgba(33,24,21,0.06)]">
      <div className={`bg-gradient-to-r ${option.accent} px-5 py-5 text-white`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">{option.title}</p>
            <p className="mt-1 max-w-md text-sm text-white/85">{option.description}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(option.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              selected ? "border-white bg-white text-[#2B211F]" : "border-white/50 bg-white/10 text-white"
            }`}
          >
            {selected ? "Selected" : "Choose"}
          </button>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {option.fields.map((field) => (
          <label key={field.id} className="block">
            <span className="mb-1 block text-sm font-medium text-[#5A4640]">{field.label}</span>
            <input
              type="text"
              value={values[field.id] || ""}
              onChange={(event) => onChange(option.id, field.id, event.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-2xl border border-[#E7DDD8] bg-[#FCFAF8] px-4 py-3 text-sm text-[#2B211F] outline-none transition focus:border-[#C9452F] focus:ring-2 focus:ring-[#F9D7CD]"
            />
          </label>
        ))}

        <button
          type="button"
          onClick={() => onSave(option.id)}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[#2B211F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D1615] disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <BadgeCheck size={16} />}
          Save {option.title}
        </button>
      </div>
    </div>
  );
}

export default function FinancePage({ initialTab = "wallet" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [walletState, setWalletState] = useState({ loading: true, error: "", data: null });
  const [paymentState, setPaymentState] = useState({ loading: true, error: "", data: null });
  const [escrowState, setEscrowState] = useState({ loading: true, error: "", data: null });
  const [transactionsState, setTransactionsState] = useState({ loading: true, error: "", data: [] });
  const [withdrawValues, setWithdrawValues] = useState({
    paypal: { email: "" },
    mpesa: { phoneNumber: "", accountName: "" },
    airtel_money: { phoneNumber: "", accountName: "" },
  });
  const [savingMethod, setSavingMethod] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [connectingStripe, setConnectingStripe] = useState(false);
  const user = getUser();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    let mounted = true;

    walletAPI
      .getWallet()
      .then((data) => {
        if (!mounted) return;
        setWalletState({ loading: false, error: "", data });
        setSelectedMethod(data?.wallet?.withdrawalMethod || data?.withdrawalMethod || "");
      })
      .catch((err) =>
        mounted && setWalletState({ loading: false, error: err.message || "Wallet unavailable", data: null })
      );

    walletAPI
      .getTransactions({ limit: 6 })
      .then((data) =>
        mounted &&
        setTransactionsState({
          loading: false,
          error: "",
          data: data?.transactions || data?.items || data || [],
        })
      )
      .catch((err) =>
        mounted &&
        setTransactionsState({ loading: false, error: err.message || "Transactions unavailable", data: [] })
      );

    paymentAPI
      .getStripeConnectStatus()
      .then((data) => mounted && setPaymentState({ loading: false, error: "", data }))
      .catch((err) =>
        mounted &&
        setPaymentState({ loading: false, error: err.message || "Payment status unavailable", data: null })
      );

    paymentAPI
      .getEscrowBalance()
      .then((data) => mounted && setEscrowState({ loading: false, error: "", data }))
      .catch((err) =>
        mounted &&
        setEscrowState({ loading: false, error: err.message || "Escrow unavailable", data: null })
      );

    return () => {
      mounted = false;
    };
  }, []);

  const walletBalance =
    walletState.data?.wallet?.balance ?? walletState.data?.balance ?? walletState.data?.availableBalance ?? 0;
  const heldBalance =
    escrowState.data?.heldForFreelancer ?? escrowState.data?.heldAsClient ?? escrowState.data?.balance ?? 0;
  const totalTransactions = Array.isArray(transactionsState.data) ? transactionsState.data.length : 0;

  const paymentSummary = useMemo(
    () => ({
      connected: Boolean(paymentState.data?.connected),
      chargesEnabled: Boolean(paymentState.data?.chargesEnabled),
      payoutsEnabled: Boolean(paymentState.data?.payoutsEnabled),
    }),
    [paymentState.data]
  );

  const updateMethodField = (method, field, value) => {
    setWithdrawValues((prev) => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value,
      },
    }));
  };

  const saveWithdrawalMethod = async (method) => {
    setSavingMethod(method);
    setNotice("");
    setError("");
    try {
      await walletAPI.updateWithdrawalMethod(method, withdrawValues[method]);
      setSelectedMethod(method);
      setNotice(`${method.replace("_", " ")} account saved successfully.`);
      setActiveTab("wallet");
    } catch (err) {
      setError(err.message || "Could not save withdrawal account.");
    } finally {
      setSavingMethod("");
    }
  };

  const connectStripe = async () => {
    setConnectingStripe(true);
    setError("");
    setNotice("");
    try {
      const refreshUrl = `${window.location.origin}/payments`;
      const returnUrl = `${window.location.origin}/payments`;
      const data = await paymentAPI.connectStripe(refreshUrl, returnUrl);
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setNotice("Stripe connection request submitted.");
    } catch (err) {
      setError(err.message || "Could not start Stripe connection.");
    } finally {
      setConnectingStripe(false);
    }
  };

  const title = activeTab === "payments" ? "Payments" : "Wallet";
  const description =
    activeTab === "payments"
      ? "A modern payments hub for payout readiness, account linking, and transfer setup."
      : "Track balance, escrow, transaction flow, and linked payout accounts in one clean wallet view.";

  return (
    <WorkspaceToolLayout title={title} description={description}>
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-[#E7DDD8] bg-[radial-gradient(circle_at_top_left,_#FFF4EF,_#F7F0EC_42%,_#FFFFFF_100%)] shadow-[0_22px_60px_rgba(33,24,21,0.08)]">
          <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#8C766D]">Finance hub</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#2B211F]">Built for payouts that feel trustworthy</h2>
              <p className="mt-3 max-w-2xl text-sm text-[#6F5B53]">
                Link your preferred payout channels, watch your balance, and keep your payment readiness visible without
                digging through the profile workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-[#2B211F] text-white"
                      : "border border-[#D9CBC4] bg-white text-[#2B211F] hover:bg-[#F8F2EE]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(notice || error) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              error ? "border-[#F3C0B7] bg-[#FFF2EF] text-[#9E3B2B]" : "border-[#D6E8D7] bg-[#F2FBF2] text-[#21643A]"
            }`}
          >
            {error || notice}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FinanceMetric
            icon={Wallet}
            label="Available balance"
            value={walletState.loading ? "Loading..." : walletState.error ? walletState.error : formatMoney(walletBalance)}
            note="Ready for withdrawals and transfers"
          />
          <FinanceMetric
            icon={ShieldCheck}
            label="Held in escrow"
            value={escrowState.loading ? "Loading..." : escrowState.error ? escrowState.error : formatMoney(heldBalance)}
            note="Protected until milestones are cleared"
          />
          <FinanceMetric
            icon={Landmark}
            label="Payment status"
            value={paymentState.loading ? "Loading..." : paymentState.error ? paymentState.error : paymentSummary.connected ? "Connected" : "Not connected"}
            note={paymentSummary.payoutsEnabled ? "Payouts are enabled" : "Complete setup to enable payouts"}
          />
          <FinanceMetric
            icon={CreditCard}
            label="Recent transactions"
            value={transactionsState.loading ? "Loading..." : transactionsState.error ? transactionsState.error : totalTransactions}
            note="Latest movement across your wallet"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#E7DDD8] bg-white p-6 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-[#2B211F]">Connected payout accounts</p>
                  <p className="mt-1 text-sm text-[#6F5B53]">
                    Choose the payout rails your clients and your region actually use.
                  </p>
                </div>
                <div className="rounded-full bg-[#F7F0EC] px-3 py-1 text-xs font-medium text-[#8C766D]">
                  {user?.paymentVerified ? "Payment verified" : "Setup in progress"}
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="rounded-[24px] border border-[#E7DDD8] bg-[#FCFAF8] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-[#2B211F]">Stripe</p>
                      <p className="mt-1 text-sm text-[#6F5B53]">
                        Card payouts, invoicing support, and broader international coverage.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#EEE8FF] p-2 text-[#5A4FCF]">
                      <Building2 size={18} />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white px-3 py-1 text-[#5F4B45]">Charges {paymentSummary.chargesEnabled ? "enabled" : "pending"}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-[#5F4B45]">Payouts {paymentSummary.payoutsEnabled ? "enabled" : "pending"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={connectStripe}
                    disabled={connectingStripe}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2B211F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D1615] disabled:opacity-60"
                  >
                    {connectingStripe ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
                    {paymentSummary.connected ? "Refresh Stripe connection" : "Connect Stripe"}
                  </button>
                </div>

                <div className="rounded-[24px] border border-[#E7DDD8] bg-[#FCFAF8] p-5">
                  <p className="text-lg font-semibold text-[#2B211F]">Finance signals</p>
                  <div className="mt-4 space-y-3 text-sm text-[#5F4B45]">
                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                      <span>Default payout readiness</span>
                      <span className="font-medium">{user?.paymentVerified ? "Ready" : "Needs setup"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                      <span>Wallet owner</span>
                      <span className="font-medium">{user?.name || user?.companyName || "Account"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                      <span>Mobile payout channels</span>
                      <span className="font-medium">M-Pesa, Airtel Money</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {payoutOptions.map((option) => (
                <MethodCard
                  key={option.id}
                  option={option}
                  selected={selectedMethod === option.id}
                  values={withdrawValues[option.id]}
                  saving={savingMethod === option.id}
                  onSelect={setSelectedMethod}
                  onChange={updateMethodField}
                  onSave={saveWithdrawalMethod}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#E7DDD8] bg-white p-6 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
              <p className="text-lg font-semibold text-[#2B211F]">Recent transactions</p>
              <div className="mt-4 space-y-3">
                {transactionsState.loading && <p className="text-sm text-[#6F5B53]">Loading transactions...</p>}
                {!transactionsState.loading && transactionsState.error && (
                  <p className="text-sm text-[#9E3B2B]">{transactionsState.error}</p>
                )}
                {!transactionsState.loading &&
                  !transactionsState.error &&
                  (transactionsState.data.length > 0 ? (
                    transactionsState.data.slice(0, 6).map((item, index) => (
                      <div
                        key={item.id || item._id || `${item.type || "txn"}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-[#F0E7E1] bg-[#FCFAF8] px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#2B211F]">{item.type || item.description || "Transaction"}</p>
                          <p className="mt-1 text-xs text-[#8C766D]">{item.status || "Processed"}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#2B211F]">
                          {formatMoney(item.amount ?? item.value ?? 0)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#6F5B53]">No recent transactions yet.</p>
                  ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#E7DDD8] bg-[#2B211F] p-6 text-white shadow-[0_20px_50px_rgba(33,24,21,0.18)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2">
                  <Phone size={18} />
                </div>
                <p className="text-lg font-semibold">Mobile money first</p>
              </div>
              <p className="mt-3 text-sm text-white/80">
                We designed this area around how payouts really happen for many freelancers: mobile wallets first, then
                account rails like PayPal and Stripe.
              </p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-2xl bg-white/10 px-4 py-3">M-Pesa for fast local payouts</div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">Airtel Money for mobile-wallet flexibility</div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">PayPal for cross-border transfers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceToolLayout>
  );
}
