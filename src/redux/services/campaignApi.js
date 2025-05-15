import { createApi } from "@reduxjs/toolkit/query/react";

import apiBaseQuery from "./axiosBaseQuery";

export const CAMPAIGN_API = "campaignApi";

export const campaignApi = createApi({
  reducerPath: CAMPAIGN_API,
  baseQuery: apiBaseQuery,
  tagTypes: ["campaign", "login", "users"],
  endpoints: (builder) => ({
    getAllCampaign: builder.query({
      query: () => ({
        url: "donation_campaign/list",
      }),
      providesTags: ["campaign"],
    }),
    getCampaign: builder.query({
      query: (id) => ({
        url: `donation_campaign/get-by-id/${id}`,
      }),
      providesTags: ["campaign"],
    }),
    createCampaign: builder.mutation({
      query: (body) => ({
        url: "donation_campaign/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    updateCampaign: builder.mutation({
      query: ({ id, body }) => ({
        url: `donation_campaign/update/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `donation_campaign/delete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["campaign"],
    }),
    sentOtp: builder.mutation({
      query: (body) => ({
        url: "/users/sendOtp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["login"],
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/users/verifyOTP",
        method: "POST",
        body,
      }),
      invalidatesTags: ["login"],
    }),
    // getAllUser: builder.query({
    //   query: () => ({
    //     url: "/users/get-all-users",
    //   }),
    //   providesTags: ["users"],
    // }),
    getAllUser: builder.query({
      query: ({ page, search }) => ({
        url: "/users/get-all-users",
        params: { page, search },
      }),
      providesTags: ["users"],
    }),
    getUserWithLoginHistory: builder.query({
      query: (id) => ({
        url: `/users/get-user-login-history/${id}`,
      }),
      providesTags: ["users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
    toggleBlockUser: builder.mutation({
      query: (id) => ({
        url: `/users/block/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),
    getAllSubCampaign: builder.query({
      query: () => ({
        url: "subDonation/list",
      }),
      providesTags: ["subCampaign"],
    }),
    getSubCampaign: builder.query({
      query: (id) => ({
        url: `get-by-id/${id}`,
      }),
      providesTags: ["subCampaign"],
    }),
    createSubCampaign: builder.mutation({
      query: (body) => ({
        url: "subDonation/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["campaign"],
    }),
    updateSubCampaign: builder.mutation({
      query: ({ id, body }) => ({
        url: `subDonation/update/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    deleteSubCampaign: builder.mutation({
      query: (id) => ({
        url: `/subDonation/delete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["campaign"],
    }),
    deleteEnquiry: builder.mutation({
      query: (id) => ({
        url: `enquiry/delete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["campaign"],
    }),
    getAllEnquiries: builder.query({
      query: () => ({
        url: "enquiry/list",
      }),
      providesTags: ["campaign"],
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: "/users/get-user-profile",
      }),
    }),
    updateSettings: builder.mutation({
      query: (body) => ({
        url: "/users/update-settings",
        method: "POST",
        body,
      }),
    }),
    getSettings: builder.query({
      query: () => ({
        url: "/users/get-settings",
      }),
    }),
    getAllDonations: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        min_amount,
        max_amount,
        start_date,
        end_date,
        payment_status,
      } = {}) => {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", limit);

        if (search) params.append("search", search);
        if (min_amount) params.append("min_amount", min_amount);
        if (max_amount) params.append("max_amount", max_amount);
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);
        if (payment_status) params.append("payment_status", payment_status);

        return {
          url: `donation_campaign/donors/list?${params.toString()}`,
        };
      },
      providesTags: ["donations"],
    }),

    getAll80GDonations: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        start_date = "",
        end_date = "",
      } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (search) params.append("search", search);
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);

        return {
          url: `donation_campaign/donations/80g?${params.toString()}`,
        };
      },
      providesTags: ["donations"],
    }),
    export80GDonations: builder.query({
      query: ({ start_date, end_date }) => {
        return {
          url: `donation_campaign/donations/80g/export?start_date=${start_date}&end_date=${end_date}`,
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    deleteDonation: builder.mutation({
      query: (id) => ({
        url: `donation_campaign/donors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["donations"],
    }),

    updatebanner: builder.mutation({
      query: (body) => ({
        url: "donation_campaign/banners/update",
        method: "POST",
        body,
      }),
    }),
    getBannerImages: builder.query({
      query: () => ({
        url: "donation_campaign/banners/list",
      }),
    }),
    getAllTransactions: builder.query({
      query: (search) => ({
        url: `transactions/transactions`,
        params: { search }, // Search by full_name, mobile_number, or transaction_id
      }),
      providesTags: ["transactions"],
    }),

    // 🔹 Get transactions by date filter & export CSV
    //   getTransactionsByDate: builder.query({
    //     query: ({ start_date, end_date }) => ({
    //       url: `transactions/transactions/export`,
    //       params: { start_date, end_date },
    //     }),
    //     providesTags: ["transactions"],
    //   }),
    getTransactionsByDate: builder.query({
      query: ({ start_date, end_date }) => ({
        url: `transactions/transactions/export`,
        params: { start_date, end_date },
        responseHandler: (response) => response.blob(), // ✅ Important
        headers: {
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      }),
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useLazyGetTransactionsByDateQuery,
  useDeleteDonationMutation,
  useUpdatebannerMutation,
  useGetBannerImagesQuery,
  useGetAllDonationsQuery,
  useGetAll80GDonationsQuery,
  useLazyExport80GDonationsQuery,
  useLazyGetUserProfileQuery,
  useGetAllCampaignQuery,
  useCreateCampaignMutation,
  useGetCampaignQuery,
  useUpdateCampaignMutation,
  useSentOtpMutation,
  useVerifyOtpMutation,
  useGetAllUserQuery,
  useLazyGetUserWithLoginHistoryQuery,
  useDeleteUserMutation,
  useToggleBlockUserMutation,
  useGetAllSubCampaignQuery,
  useGetSubCampaignQuery,
  useCreateSubCampaignMutation,
  useUpdateSubCampaignMutation,
  useGetAllEnquiriesQuery,
  useDeleteCampaignMutation,
  useDeleteSubCampaignMutation,
  useDeleteEnquiryMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = campaignApi;
