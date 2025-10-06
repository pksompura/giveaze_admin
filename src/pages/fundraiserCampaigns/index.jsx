import React from "react";
import { Table, Button, Space, Popconfirm, message, Tag } from "antd";
import {
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  useGetFundraiserCampaignsQuery,
  useDeleteCampaignMutation,
  useUpdateCampaignMutation,
} from "../../redux/services/campaignApi";

const FundraiserCampaigns = () => {
  const { data, isLoading } = useGetFundraiserCampaignsQuery();
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [updateCampaign] = useUpdateCampaignMutation();

  const campaigns = data?.campaigns || [];

  // ✅ Delete Campaign
  const handleDelete = async (id) => {
    try {
      await deleteCampaign(id).unwrap();
      message.success("Campaign deleted successfully");
    } catch (err) {
      message.error("Failed to delete campaign");
    }
  };

  // ✅ Approve/Reject Campaign with hidden toggle
  const handleApprovalToggle = async (campaign) => {
    try {
      const updatedFields = campaign.is_approved
        ? { is_approved: false, hidden: true } // Reject → mark hidden
        : { is_approved: true, hidden: false }; // Approve → unhide

      await updateCampaign({
        id: campaign._id,
        body: updatedFields,
      }).unwrap();

      message.success(
        `Campaign ${
          campaign.is_approved ? "rejected & hidden" : "approved & unhidden"
        } successfully`
      );
    } catch (err) {
      message.error("Failed to update approval");
    }
  };

  const columns = [
    {
      dataIndex: "_id",
      title: "Campaign ID",
      width: 200,
      render: (text) => (
        <div style={{ fontSize: "12px", lineHeight: "1.3" }}>
          {text?.slice(0, text.length / 2)}
          <br />
          {text?.slice(text.length / 2)}
        </div>
      ),
    },
    {
      dataIndex: "campaign_title",
      title: "Title",
      width: 200,
      render: (text, item) => (
        <Link to={`/campaigns/${item._id}/edit`}>{text}</Link>
      ),
    },
    {
      title: "Fundraiser",
      dataIndex: "created_by",
      width: 220,
      render: (user) =>
        user ? (
          <div>
            <strong>{user.full_name || "N/A"}</strong>
            <br />
            <span style={{ fontSize: "12px", color: "#666" }}>
              {user.email} | {user.mobile_number}
            </span>
          </div>
        ) : (
          "N/A"
        ),
    },
    { dataIndex: "state", title: "Location", width: 120 },
    {
      dataIndex: "target_amount",
      title: "Goal",
      width: 120,
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "N/A",
    },
    {
      dataIndex: "raised_amount",
      title: "Raised",
      width: 120,
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "0",
    },
    {
      dataIndex: "is_approved",
      title: "Approval",
      width: 120,
      render: (approved) => (
        <Tag color={approved ? "green" : "volcano"}>
          {approved ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 140,
      render: (text) => moment(text).format("DD MMM, YYYY"),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      width: 140,
      render: (text) => moment(text).format("DD MMM, YYYY"),
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 200,
      render: (_, record) => (
        <Space>
          {/* ✅ Approve/Reject Toggle */}
          <Button
            type={record.is_approved ? "default" : "primary"}
            icon={
              record.is_approved ? <StopOutlined /> : <CheckCircleOutlined />
            }
            onClick={() => handleApprovalToggle(record)}
          >
            {record.is_approved ? "Reject" : "Approve"}
          </Button>

          {/* ✅ Delete */}
          <Popconfirm
            title="Are you sure to delete this campaign?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={campaigns}
      loading={isLoading}
      rowKey="_id"
      scroll={{ x: true }}
    />
  );
};

export default FundraiserCampaigns;
