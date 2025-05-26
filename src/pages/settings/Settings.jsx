import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import React Quill styles
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUpdatebannerMutation,
  useGetBannerImagesQuery,
} from "../../redux/services/campaignApi";

const Settings = () => {
  const { data, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();
  const [updateBanner] = useUpdatebannerMutation();
  const { data: images, isSuccess, refetch } = useGetBannerImagesQuery();
  const [form] = Form.useForm();

  // State for React Quill fields
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [terms, setTerms] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [existBannerUrls, setExistBannerUrls] = useState("");

  // Load existing banner on mount
  useEffect(() => {
    if (isSuccess && images?.banners?.length > 0) {
      setExistBannerUrls(images.banners[0]);
      setPreviewImage(images.banners[0]);
    }
  }, [images, isSuccess]);

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue(data.data);
      setPrivacyPolicy(data.data.privacypolicy || "");
      setTerms(data.data.terms || "");
      setAboutUs(data.data.about_us || "");
      // setBannerUrl(data.data.banner_link || "");
      setPreviewImage(existBannerUrls || ""); // Set initial preview image
    }
  }, [data, existBannerUrls, form]);

  // Handle image change
  // Handle image upload
  const handleImageChange = ({ file }) => {
    if (file && file instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerImage(reader.result); // base64 string
        setPreviewImage(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } else {
      console.warn("Invalid file selected");
    }
  };

  const onFinish = async (values) => {
    try {
      let updatedBannerUrl = existBannerUrls;

      if (bannerImage) {
        const response = await updateBanner({
          imageUrl: existBannerUrls || null,
          newImage: bannerImage,
        }).unwrap();

        if (response?.newImageUrl) {
          updatedBannerUrl = response.newImageUrl;
          setExistBannerUrls(updatedBannerUrl);
          setPreviewImage(updatedBannerUrl);
          await refetch(); // refresh banner list
        }
      }

      const updatedValues = {
        ...values,
        privacypolicy: privacyPolicy,
        terms: terms,
        about_us: aboutUs,
      };

      await updateSettings(updatedValues).unwrap();
      message.success("Settings updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Failed to update settings");
    }
  };

  return (
    <Card title="Settings">
      {isLoading ? (
        <Spin />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* React Quill Fields */}
          <Form.Item label="Privacy Policy" name="privacypolicy">
            <ReactQuill value={privacyPolicy} onChange={setPrivacyPolicy} />
          </Form.Item>
          <Form.Item label="Terms & Conditions" name="terms">
            <ReactQuill value={terms} onChange={setTerms} />
          </Form.Item>
          <Form.Item label="About Us" name="about_us">
            <ReactQuill value={aboutUs} onChange={setAboutUs} />
          </Form.Item>

          {/* Other Fields */}
          <Form.Item label="Banner Title" name="banner_title">
            <Input />
          </Form.Item>
          <Form.Item label="Banner Description" name="banner_description">
            <Input />
          </Form.Item>
          <Form.Item label="Banner Link" name="banner_link">
            <Input />
          </Form.Item>
          {/* Banner Upload */}
          <Form.Item label="Banner Image">
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false} // Prevent auto-upload
              onChange={handleImageChange}
            >
              <Button icon={<UploadOutlined />}>Upload Banner</Button>
            </Upload>
            {previewImage && (
              <img
                src={previewImage}
                alt="Banner Preview"
                style={{
                  marginTop: 10,
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default Settings;
