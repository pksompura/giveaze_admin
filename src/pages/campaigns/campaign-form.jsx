import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useGetCampaignQuery,
} from "../../redux/services/campaignApi";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Image, message, Upload, Typography } from "antd";
import PrimaryWrapper from "../../components/PrimaryWrapper";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import CampaignPreviewModal from "./CampaignPreviewModal";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"], // this includes the image button
  ["clean"], // remove formatting
];
const CampaignForm = () => {
  const { campaignId } = useParams();
  const router = useNavigate();
  const [categories, setCategories] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");
  // const [donationAmounts, setDonationAmounts] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://devaseva.onrender.com/api/category/list"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const base64Image = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const { data: singleCampaign, isLoading } = useGetCampaignQuery(campaignId, {
    skip: !campaignId,
  });
  const [
    createCampaign,
    { isLoading: creating, isSuccess, isError: createError },
  ] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: updating, isError, isSuccess: updated }] =
    useUpdateCampaignMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success("Campaign created successfully");
      router("/campaigns");
    }
    if (updated) {
      message.success("Campaign updated successfully");
      router("/campaigns");
    }
    if (isError || createError) {
      message.error("Something went wrong");
    }
  }, [router, isSuccess, isError, createError, updated]);

  const form = useFormik({
    initialValues: singleCampaign
      ? {
          campaign_title: singleCampaign?.data?.campaign?.campaign_title || "",
          campaign_description:
            singleCampaign?.data?.campaign?.campaign_description || "",
          target_amount:
            singleCampaign?.data?.campaign?.target_amount?.$numberDecimal || 0,
          minimum_amount:
            singleCampaign?.data?.campaign?.minimum_amount?.$numberDecimal || 0,
          donation_amounts:
            singleCampaign?.data?.campaign?.donation_amounts.map((item) =>
              parseFloat(item["$numberDecimal"])
            ) || [],
          // start_date: singleCampaign?.data?.campaign?.start_date ? singleCampaign?.data?.campaign?.start_date.split("T")[0] : "",
          // end_date: singleCampaign?.data?.campaign?.end_date ? singleCampaign?.data?.campaign?.end_date.split("T")[0] : "",
          // ngo_name: singleCampaign?.data?.campaign?.ngo_name || "",
          story: singleCampaign?.data?.campaign?.story || "",

          // establishment_year:
          //   singleCampaign?.data?.campaign?.establishment_year || "",
          state: singleCampaign?.data?.campaign?.state || "",
          beneficiary: singleCampaign?.data?.campaign?.beneficiary || "",
          video_link: singleCampaign?.data?.campaign?.video_link || "",
          main_picture: singleCampaign?.data?.campaign?.main_picture || null,
          other_pictures: singleCampaign?.data?.campaign?.other_pictures || [],
          is_approved: singleCampaign?.data?.campaign?.is_approved || false,
          hidden: singleCampaign?.data?.campaign?.hidden || false,
          is_tax: singleCampaign?.data?.campaign?.is_tax || false,
          is_validated: singleCampaign?.data?.campaign?.is_validated || false,
          // category: singleCampaign?.data?.campaign?.category?._id || "",
        }
      : {
          campaign_title: "",
          campaign_description: "",
          target_amount: 0,
          minimum_amount: 0,
          // start_date: "",
          // end_date: "",
          story: "",
          // ngo_name: "",
          // establishment_year: "",
          state: "",
          beneficiary: "",
          video_link: "",
          donationAmount: "",
          donation_amounts: [],
          main_picture: null,
          other_pictures: [],
          is_approved: false,
          hidden: false,
          is_tax: false,
          is_validated: false,
          // category: "",
        },
    enableReinitialize: true,

    validationSchema: Yup.object().shape({
      campaign_title: Yup.string().required("Required"),
      campaign_description: Yup.string().required("Required"),
      target_amount: Yup.number().required("Required"),
      minimum_amount: Yup.number().required("Required"),
      donation_amounts: Yup.array()
        .of(
          Yup.number()
            .positive("Amount must be positive")
            .required("Donation amount is required")
        )
        .min(1, "At least one donation amount is required"),

      // start_date: Yup.string().required("Required"),
      // end_date: Yup.string().required("Required"),
      // ngo_name: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      beneficiary: Yup.string().required("Required"),
      // category: Yup.string().required("Category is required"),
    }),

    onSubmit: async (values) => {
      let images = [];

      // Retain the existing images and append new ones
      const existingImages = values.other_pictures.filter(
        (img) => typeof img === "string"
      );
      const newImages = [];
      for (const file of values.other_pictures) {
        if (typeof file === "object") {
          const image = await base64Image(file);
          newImages.push(image);
        }
      }

      images = [...existingImages, ...newImages]; // Combine existing and new images

      let mainPicture;
      if (typeof values.main_picture === "object") {
        mainPicture = await base64Image(values.main_picture);
      } else if (typeof values.main_picture === "string") {
        // Extract the filename from the existing URL
        mainPicture = values.main_picture;
      }

      if (campaignId) {
        const { ...rest } = values;
        await updateCampaign({
          id: campaignId,
          body: {
            ...rest,
            main_picture: mainPicture,
            other_pictures: images,
            id: campaignId,
          },
        });
      } else {
        await createCampaign({
          ...values,
          main_picture: mainPicture,
          other_pictures: images,
        });
      }
    },
  });

  const handleResetImages = () => {
    form.setFieldValue(
      "other_pictures",
      singleCampaign?.data?.campaign?.other_pictures || []
    );
  };

  const handleRemoveImage = (imageIndex) => {
    const updatedImages = form.values.other_pictures.filter(
      (_, index) => index !== imageIndex
    );
    form.setFieldValue("other_pictures", updatedImages);
  };

  const handleAddDonationAmount = () => {
    const donationAmount = form.values.donationAmount;
    if (
      donationAmount &&
      !isNaN(donationAmount) &&
      parseFloat(donationAmount) > 0
    ) {
      const updatedAmounts = [
        ...form.values.donation_amounts,
        parseFloat(donationAmount),
      ];
      form.setFieldValue("donation_amounts", updatedAmounts); // Update donation_amounts array
      form.setFieldValue("donationAmount", ""); // Reset donation amount input field
    } else {
      message.error("Please enter a valid donation amount");
    }
  };
  const handlePreview = (values) => {
    setPreviewData(values);
    setPreviewOpen(true);
  };
  // Remove donation amount using Formik's setFieldValue
  const handleRemoveDonationAmount = (index) => {
    const updatedAmounts = form.values.donation_amounts.filter(
      (_, i) => i !== index
    );
    form.setFieldValue("donation_amounts", updatedAmounts); // Use Formik's setFieldValue to update the array
  };

  return (
    <>
      <PrimaryWrapper>
        <Typography.Title
          level={3}
          className="flex w-full items-center font-bold text-2xl space-y-4"
        >
          {campaignId ? "Update Campaign" : "Create Campaign"}{" "}
        </Typography.Title>
        <Card
          loading={isLoading}
          className="flex flex-col space-y-7 py-8 px-16"
        >
          <Grid container spacing={2}>
            {/* Main Image Upload */}
            <Grid item xs={6}>
              <Upload
                multiple={false}
                customRequest={(e) =>
                  form.setFieldValue("main_picture", e.file)
                }
                showUploadList={false}
              >
                <Button variant="outlined" icon={<UploadOutlined />}>
                  Click to Upload Main Image
                </Button>
              </Upload>
            </Grid>

            <Grid item xs={6}>
              {typeof form.values?.main_picture === "string" && (
                <Image
                  src={form.values?.main_picture}
                  height={80}
                  width={100}
                  style={{ objectFit: "contain" }}
                />
              )}
              {typeof form.values?.main_picture === "object" && (
                <Image
                  src={
                    form.values?.main_picture &&
                    window.URL.createObjectURL(form.values.main_picture)
                  }
                  height={80}
                  width={100}
                  style={{ objectFit: "contain" }}
                />
              )}
            </Grid>

            {/* Multiple Images Upload */}
            <Grid item xs={12}>
              <Upload
                multiple
                beforeUpload={(file) => false}
                onChange={(info) => {
                  const fileList = info.fileList.map(
                    (file) => file.originFileObj || file
                  );
                  form.setFieldValue("other_pictures", [
                    ...form.values.other_pictures,
                    ...fileList,
                  ]);
                }}
                showUploadList={false}
              >
                <Button variant="outlined" icon={<UploadOutlined />}>
                  Click to Upload Other Pictures
                </Button>
              </Upload>
              <Grid container spacing={2} mt={2}>
                {form.values.other_pictures.map((picture, index) => (
                  <Grid item key={index}>
                    <Image
                      src={
                        typeof picture === "string"
                          ? picture
                          : window.URL.createObjectURL(picture)
                      }
                      height={80}
                      width={100}
                      style={{ objectFit: "contain" }}
                    />
                    <Button
                      type="danger"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Reset Button */}
            <Grid item xs={12}>
              <Button type="default" onClick={handleResetImages}>
                Reset Images
              </Button>
            </Grid>

            {/* Campaign Title */}
            <Grid item xs={12}>
              <TextField
                name="campaign_title"
                label="Campaign Title"
                fullWidth
                value={form.values?.campaign_title}
                error={Boolean(form.errors?.campaign_title)}
                helperText={form.errors?.campaign_title}
                onChange={form.handleChange}
              />
            </Grid>

            {/* Campaign Description */}
            <Grid item xs={12}>
              <label
                style={{ fontSize: "0.875rem", color: "rgba(0, 0, 0, 0.6)" }}
              >
                Story
              </label>
              <ReactQuill
                theme="snow"
                value={form.values?.campaign_description}
                onChange={(value) =>
                  form.setFieldValue("campaign_description", value)
                }
                modules={{
                  toolbar: toolbarOptions,
                }}
              />
              {form.errors?.campaign_description && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {form.errors?.campaign_description}
                </p>
              )}
            </Grid>
            <Grid item xs={12}>
              <label
                style={{ fontSize: "0.875rem", color: "rgba(0, 0, 0, 0.6)" }}
              >
                Updates
              </label>
              <ReactQuill
                theme="snow"
                value={form.values?.story}
                onChange={(value) => form.setFieldValue("story", value)}
                modules={{
                  toolbar: toolbarOptions,
                }}
              />
              {form.errors?.story && (
                <p
                  style={{
                    color: "red",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {form.errors?.story}
                </p>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Add Donation Amount</Typography>
              <TextField
                fullWidth
                label="Donation Amount"
                value={form.values.donationAmount || ""}
                onChange={(e) =>
                  form.setFieldValue("donationAmount", e.target.value)
                } // Bind to Formik state
                type="number"
                error={Boolean(form.errors.donation_amounts)}
                helperText={form.errors.donation_amounts}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddDonationAmount}
                style={{ marginTop: "8px" }}
              >
                Add Amount
              </Button>
            </Grid>

            {/* List of Donation Amounts */}
            <Grid item xs={12}>
              <Typography variant="h6">Donation Amounts</Typography>
              {form.values.donation_amounts.length > 0 ? (
                <ul>
                  {form.values.donation_amounts.map((amount, index) => (
                    <li key={index}>
                      <Typography>{amount}</Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveDonationAmount(index)}
                        style={{ marginLeft: "8px" }}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No donation amounts added</Typography>
              )}
            </Grid>
            {/* Category Select */}
            {/* <Grid item xs={12}>
      <FormControl fullWidth error={Boolean(form.errors?.category)}>
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={form.values?.category}
          onChange={form.handleChange}
          label="Category"
        >
          {categories?.categories?.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid> */}

            {/* Video Link */}
            <Grid item xs={12}>
              <TextField
                name="video_link"
                label="Video Link"
                fullWidth
                value={form.values?.video_link}
                onChange={form.handleChange}
              />
            </Grid>

            {/* Beneficiary */}
            <Grid item xs={6}>
              <TextField
                name="beneficiary"
                label="Beneficiary"
                fullWidth
                value={form.values?.beneficiary}
                error={Boolean(form.errors?.beneficiary)}
                helperText={form.errors?.beneficiary}
                onChange={form.handleChange}
              />
            </Grid>

            {/* NGO Name */}
            {/* <Grid item xs={6}>
              <TextField
                name="ngo_name"
                label="NGO Name"
                fullWidth
                value={form.values?.ngo_name}
                error={Boolean(form.errors?.ngo_name)}
                helperText={form.errors?.ngo_name}
                onChange={form.handleChange}
              />
            </Grid> */}

            {/* Establishment Year */}
            {/* <Grid item xs={6}>
              <TextField
                name="establishment_year"
                label="Establishment Year"
                fullWidth
                value={form.values?.establishment_year}
                onChange={form.handleChange}
              />
            </Grid> */}

            {/* State */}
            <Grid item xs={6}>
              <TextField
                name="state"
                label="Location"
                fullWidth
                value={form.values?.state}
                error={Boolean(form.errors?.state)}
                helperText={form.errors?.state}
                onChange={form.handleChange}
              />
            </Grid>

            {/* Beneficiary */}
            {/* <Grid item xs={6}>
              <TextField
                name="beneficiary"
                label="Beneficiary"
                fullWidth
                value={form.values?.beneficiary}
                error={Boolean(form.errors?.beneficiary)}
                helperText={form.errors?.beneficiary}
                onChange={form.handleChange}
              />
            </Grid> */}

            {/* Minimum Amount */}
            <Grid item xs={6}>
              <TextField
                name="minimum_amount"
                label="Minimum Amount"
                fullWidth
                value={form.values?.minimum_amount}
                error={Boolean(form.errors?.minimum_amount)}
                helperText={form.errors?.minimum_amount}
                onChange={form.handleChange}
              />
            </Grid>

            {/* Target Amount */}
            <Grid item xs={6}>
              <TextField
                name="target_amount"
                label="Target Amount"
                fullWidth
                value={form.values?.target_amount}
                error={Boolean(form.errors?.target_amount)}
                helperText={form.errors?.target_amount}
                onChange={form.handleChange}
              />
            </Grid>
            {/* Campaign Start Date */}
            {/* <Grid item xs={6}>
      <TextField
        name="start_date"
        label="Start Date"
        type="date"
        fullWidth
        value={form.values?.start_date}
        onChange={form.handleChange}
      />
    </Grid> */}

            {/* Campaign End Date */}
            {/* <Grid item xs={6}>
      <TextField
        name="end_date"
        label="End Date"
        type="date"
        fullWidth
        value={form.values?.end_date}
        onChange={form.handleChange}
      />
    </Grid> */}

            {/* Is Active */}
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_approved"
                    checked={Boolean(form.values?.is_approved)}
                    onChange={(e) =>
                      form.setFieldValue("is_approved", e.target.checked)
                    }
                  />
                }
                label="Is Active"
              />
            </Grid>

            {/* Is Expired */}
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="hidden"
                    checked={Boolean(form.values?.hidden)}
                    onChange={(e) =>
                      form.setFieldValue("hidden", e.target.checked)
                    }
                  />
                }
                label="Hide"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_tax"
                    checked={Boolean(form.values?.is_tax)}
                    onChange={(e) =>
                      form.setFieldValue("is_tax", e.target.checked)
                    }
                  />
                }
                label="Tax Exemption"
              />
            </Grid>
            {/* Is Published */}
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_validated"
                    checked={Boolean(form.values?.is_validated)}
                    onChange={(e) =>
                      form.setFieldValue("is_validated", e.target.checked)
                    }
                  />
                }
                label="Validated?"
              />
            </Grid>
          </Grid>
          {/* Submit Button */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            mt={4}
          >
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => router("/campaigns")}
            >
              Cancel
            </Button>
            <Stack direction="row" spacing={2}>
              {/* Preview Button */}
              <Button
                variant="contained"
                color="secondary"
                icon={<EyeOutlined />}
                onClick={() => handlePreview(form.values)}
              >
                Preview
              </Button>
              <Button type="primary" onClick={form.handleSubmit}>
                {creating || updating ? (
                  <CircularProgress size={18} color="inherit" />
                ) : campaignId ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </Stack>
          </Stack>
        </Card>
      </PrimaryWrapper>
      <CampaignPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={previewData}
        campaignId={campaignId} // ← Pass campaignId here
        onSubmit={() => {
          setPreviewOpen(false);
          form.handleSubmit(); // triggers formik submission
        }}
      />
    </>
  );
};

export default CampaignForm;
