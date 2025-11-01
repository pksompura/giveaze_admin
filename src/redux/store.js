// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";

// import authReducer from "./slices/authSlice";
// import { campaignApi } from "./services/campaignApi";
// import { subCampaignApi } from "./services/subCampaignApi";

// const setUpStore = () => {
//   const store = configureStore({
//     reducer: {
//       [campaignApi.reducerPath]: campaignApi.reducer,
//       [subCampaignApi.reducerPath]: subCampaignApi.reducer,

//       //Frontend

//       auth: authReducer,
//     },
//     middleware: (getDM) => [
//       ...getDM(),
//       campaignApi.middleware,
//       subCampaignApi.middleware,
//     ],
//   });
//   setupListeners(store.dispatch);
//   return store;
// };

// export const store = setUpStore();
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "./slices/authSlice";
import { campaignApi } from "./services/campaignApi";
import { subCampaignApi } from "./services/subCampaignApi";
import { ngoApi } from "./services/ngoApi"; // ✅ Import NGO API

const setUpStore = () => {
  const store = configureStore({
    reducer: {
      // APIs
      [campaignApi.reducerPath]: campaignApi.reducer,
      [subCampaignApi.reducerPath]: subCampaignApi.reducer,
      [ngoApi.reducerPath]: ngoApi.reducer, // ✅ Add NGO API reducer

      // Frontend Slices
      auth: authReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        campaignApi.middleware,
        subCampaignApi.middleware,
        ngoApi.middleware // ✅ Add NGO API middleware
      ),
  });

  setupListeners(store.dispatch);
  return store;
};

export const store = setUpStore();
