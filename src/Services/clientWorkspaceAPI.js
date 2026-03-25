import { buyerRequestAPI, proposalAPI } from "./api";

export const clientWorkspaceAPI = {
  createJob: async (payload) => {
    return buyerRequestAPI.createRequest(payload);
  },

  getMyJobs: async (params = {}) => {
    return buyerRequestAPI.getMyRequests(params);
  },

  getJob: async (jobId) => {
    return buyerRequestAPI.getRequest(jobId);
  },

  getJobProposals: async (jobId) => {
    return proposalAPI.getProposalsForRequest(jobId);
  },

  updateJob: async (jobId, payload) => {
    return buyerRequestAPI.updateRequest(jobId, payload);
  },

  updateProposalStatus: async (proposalId, status) => {
    return proposalAPI.updateProposalStatus(proposalId, status);
  },

  closeJob: async (jobId) => {
    return buyerRequestAPI.closeRequest(jobId);
  },
};

export default clientWorkspaceAPI;
