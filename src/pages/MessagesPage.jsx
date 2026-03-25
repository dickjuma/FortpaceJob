import React from "react";
import Messages from "../Components/Findwork/Messages";
import { SocketProvider } from "../Context/SocketContext";
import { getToken } from "../Services/api";
import WorkspaceToolLayout from "./WorkspaceToolLayout";

export default function MessagesPage() {
  return (
    <SocketProvider token={getToken()}>
      <WorkspaceToolLayout
        title="Messages"
        description="Client conversations now open as their own page instead of inside Find Work."
      >
        <Messages />
      </WorkspaceToolLayout>
    </SocketProvider>
  );
}
