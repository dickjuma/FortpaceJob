import React from "react";
import MyProfile from "../MyProfile";

export default function ClientProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[#E5D9D0] bg-[radial-gradient(circle_at_top_left,_#FFF7F2,_#F6EFEA_42%,_#FFFFFF_100%)] p-6 shadow-[0_18px_45px_rgba(33,24,21,0.06)]">
        <p className="text-sm uppercase tracking-[0.18em] text-[#7A665E]">Client Profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#2B211F]">Manage your client identity and company details</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#6F5B53]">
          Keep your company details, phone verification, hiring preferences, and trust signals up to date so freelancers can respond with confidence.
        </p>
      </div>

      <div className="-mx-4 md:-mx-6">
        <MyProfile />
      </div>
    </div>
  );
}
