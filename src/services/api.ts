import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aauApi = createApi({
    reducerPath: "aauApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Training", "Rental", "User"],
    endpoints: (builder) => ({
        getTrainings: builder.query({
            query: () => "/trainings",
            providesTags: ["Training"],
        }),
        approveTraining: builder.mutation({
            query: (id) => ({
                url: `/trainings/${id}/approve`,
                method: "POST",
            }),
            invalidatesTags: ["Training"],
        }),
        getRentals: builder.query({
            query: () => "/rentals",
            providesTags: ["Rental"],
        }),
    }),
});

export const {
    useGetTrainingsQuery,
    useApproveTrainingMutation,
    useGetRentalsQuery
} = aauApi;
