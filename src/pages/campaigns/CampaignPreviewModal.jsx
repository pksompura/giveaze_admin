import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
// For Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // for autoplay

// Import Pagination module properly (this is the fix)
import { Pagination, Autoplay } from "swiper/modules";
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box pt={2}>{children}</Box>}
    </div>
  );
}

const CampaignPreviewModal = ({ open, onClose, data, onSubmit }) => {
  const [tab, setTab] = useState(0);
  if (!data) return null;

  const handleTabChange = (e, newValue) => setTab(newValue);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Preview Campaign
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Campaign Info" />
        <Tab label="Images" />
        <Tab label="Story" />
      </Tabs>

      <DialogContent dividers>
        {/* Campaign Info Tab */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Title</Typography>
              <Typography>{data.campaign_title}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Target Amount</Typography>
              <Typography>₹{data.target_amount}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Minimum Amount</Typography>
              <Typography>₹{data.minimum_amount}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Donation Amounts</Typography>
              <Typography>{data.donation_amounts?.join(", ")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Updates</Typography>
              <Typography>{data.campaign_description}</Typography>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Images Tab */}
        <TabPanel value={tab} index={1}>
          <Grid container spacing={2}>
            {data.main_picture && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Main Picture</Typography>
                <img
                  src={
                    typeof data.main_picture === "string"
                      ? data.main_picture
                      : URL.createObjectURL(data.main_picture)
                  }
                  alt="Main"
                  style={{
                    maxHeight: 200,
                    maxWidth: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </Grid>
            )}

            {data.other_pictures?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Other Pictures</Typography>
                <Swiper
                  modules={[Pagination, Autoplay]}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  spaceBetween={10}
                  slidesPerView={2}
                >
                  {data.other_pictures.map((pic, index) => {
                    const src =
                      typeof pic === "string" ? pic : URL.createObjectURL(pic);
                    return (
                      <SwiperSlide key={index}>
                        <img
                          src={src}
                          alt={`Other ${index}`}
                          style={{
                            height: 200,
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Story Tab */}
        <TabPanel value={tab} index={2}>
          <Typography variant="subtitle2">Story</Typography>
          <Typography sx={{ whiteSpace: "pre-line" }}>{data.story}</Typography>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Preview and Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignPreviewModal;
