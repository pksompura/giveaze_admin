// import React from "react";
// import { Table, Button, Space, Popconfirm, message, Tag, Tooltip } from "antd";
// import {
//   DeleteOutlined,
//   CheckCircleOutlined,
//   StopOutlined,
//   EyeOutlined,
// } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";
// import moment from "moment";
// import {
//   useGetFundraiserCampaignsQuery,
//   useDeleteCampaignMutation,
//   useUpdateCampaignMutation,
// } from "../../redux/services/campaignApi";

// const FundraiserCampaigns = () => {
//   const { data, isLoading } = useGetFundraiserCampaignsQuery();
//   const [deleteCampaign] = useDeleteCampaignMutation();
//   const [updateCampaign] = useUpdateCampaignMutation();
//   const navigate = useNavigate();

//   const campaigns = data?.campaigns || [];

//   // ✅ Delete Campaign
//   const handleDelete = async (id) => {
//     try {
//       await deleteCampaign(id).unwrap();
//       message.success("Campaign deleted successfully");
//     } catch (err) {
//       message.error("Failed to delete campaign");
//     }
//   };

//   // ✅ Approve/Reject Campaign with hidden toggle
//   const handleApprovalToggle = async (campaign) => {
//     try {
//       const updatedFields = campaign.is_approved
//         ? { is_approved: false, hidden: true } // Reject → mark hidden
//         : { is_approved: true, hidden: false }; // Approve → unhide

//       await updateCampaign({
//         id: campaign._id,
//         body: updatedFields,
//       }).unwrap();

//       message.success(
//         `Campaign ${
//           campaign.is_approved ? "rejected & hidden" : "approved & unhidden"
//         } successfully`
//       );
//     } catch (err) {
//       message.error("Failed to update approval");
//     }
//   };

//   const columns = [
//     {
//       dataIndex: "_id",
//       title: "Campaign ID",
//       width: 200,
//       render: (text) => (
//         <div style={{ fontSize: "12px", lineHeight: "1.3" }}>
//           {text?.slice(0, text.length / 2)}
//           <br />
//           {text?.slice(text.length / 2)}
//         </div>
//       ),
//     },
//     {
//       dataIndex: "campaign_title",
//       title: "Title",
//       width: 200,
//       render: (text, item) => (
//         <Link to={`/campaigns/${item._id}/edit`}>{text}</Link>
//       ),
//     },
//     {
//       title: "Fundraiser",
//       dataIndex: "created_by",
//       width: 220,
//       render: (user) =>
//         user ? (
//           <div>
//             <strong>{user.full_name || "N/A"}</strong>
//             <br />
//             <span style={{ fontSize: "12px", color: "#666" }}>
//               {user.email} | {user.mobile_number}
//             </span>
//           </div>
//         ) : (
//           "N/A"
//         ),
//     },
//     { dataIndex: "state", title: "Location", width: 120 },
//     {
//       dataIndex: "target_amount",
//       title: "Goal",
//       width: 120,
//       render: (text) =>
//         text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "N/A",
//     },
//     {
//       dataIndex: "raised_amount",
//       title: "Raised",
//       width: 120,
//       render: (text) =>
//         text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "0",
//     },
//     {
//       dataIndex: "is_approved",
//       title: "Approval",
//       width: 120,
//       render: (approved) => (
//         <Tag color={approved ? "green" : "volcano"}>
//           {approved ? "Approved" : "Pending"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Created",
//       dataIndex: "createdAt",
//       width: 140,
//       render: (text) => moment(text).format("DD MMM, YYYY"),
//     },
//     {
//       title: "Updated",
//       dataIndex: "updatedAt",
//       width: 140,
//       render: (text) => moment(text).format("DD MMM, YYYY"),
//     },
//     {
//       title: "Action",
//       dataIndex: "_id",
//       width: 200,
//       render: (_, record) => (
//         <Space>
//           {/* ✅ Approve/Reject Toggle */}
//           <Button
//             type={record.is_approved ? "default" : "primary"}
//             icon={
//               record.is_approved ? <StopOutlined /> : <CheckCircleOutlined />
//             }
//             onClick={() => handleApprovalToggle(record)}
//           >
//             {record.is_approved ? "Reject" : "Approve"}
//           </Button>

//           {/* ✅ View Campaign Details */}
//           <Tooltip title="View Campaign Details">
//             <Button
//               icon={<EyeOutlined />}
//               onClick={() => navigate(`/fundraiser-campaigns/${record._id}`)}
//             />
//           </Tooltip>

//           {/* ✅ Delete */}
//           <Popconfirm
//             title="Are you sure to delete this campaign?"
//             onConfirm={() => handleDelete(record._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button icon={<DeleteOutlined />} danger />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <Table
//       columns={columns}
//       dataSource={campaigns}
//       loading={isLoading}
//       rowKey="_id"
//       scroll={{ x: true }}
//     />
//   );
// };

// export default FundraiserCampaigns;
import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  useGetFundraiserCampaignsQuery,
  useDeleteCampaignMutation,
  useUpdateCampaignMutation,
} from "../../redux/services/campaignApi";

const FundraiserCampaigns = () => {
  const { data, isLoading, refetch } = useGetFundraiserCampaignsQuery();
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [updateCampaign] = useUpdateCampaignMutation();
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const campaigns = data?.campaigns || [];

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCampaign(id).unwrap();
      message.success("Campaign deleted successfully");
      refetch();
    } catch (err) {
      message.error("Failed to delete campaign");
    }
  };

  const handleApprovalToggle = async (campaign) => {
    try {
      const updatedFields = campaign.is_approved
        ? { is_approved: false, hidden: true }
        : { is_approved: true, hidden: false };

      await updateCampaign({ id: campaign._id, body: updatedFields }).unwrap();
      message.success(
        `Campaign ${
          campaign.is_approved ? "rejected & hidden" : "approved & unhidden"
        } successfully`
      );
      refetch();
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
      render: (text, item) => (
        <Link to={`/campaigns/${item._id}/edit`}>{text}</Link>
      ),
    },
    {
      dataIndex: "created_by",
      title: "Fundraiser",
      render: (user) =>
        user ? (
          <div>
            <strong>{user.full_name}</strong>
            <br />
            <span style={{ fontSize: 12, color: "#666" }}>
              {user.email} | {user.mobile_number}
            </span>
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      dataIndex: "target_amount",
      title: "Goal",
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "N/A",
    },
    {
      dataIndex: "raised_amount",
      title: "Raised",
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "0",
    },
    {
      dataIndex: "is_approved",
      title: "Approval",
      render: (approved) => (
        <Tag color={approved ? "green" : "volcano"}>
          {approved ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      dataIndex: "createdAt",
      title: "Created",
      render: (text) => moment(text).format("DD MMM, YYYY"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type={record.is_approved ? "default" : "primary"}
            icon={
              record.is_approved ? <StopOutlined /> : <CheckCircleOutlined />
            }
            onClick={() => handleApprovalToggle(record)}
          >
            {record.is_approved ? "Reject" : "Approve"}
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/fundraiser-campaigns/${record._id}`)}
          ></Button>
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
    <div style={{ padding: 20 }}>
      <Row justify="center">
        <div style={{ width: "100%", maxWidth: 1200 }}>
          <Typography.Title level={2}>Fundraiser Campaigns</Typography.Title>

          {/* Desktop Table */}
          {!isMobile && (
            <Table
              columns={columns}
              dataSource={campaigns}
              loading={isLoading}
              rowKey="_id"
              pagination={false}
              bordered
            />
          )}

          {/* Mobile Cards */}
          {isMobile &&
            campaigns.map((c) => (
              <Card
                key={c._id}
                style={{
                  marginBottom: 16,
                  borderRadius: 8,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <p>
                  <strong>Campaign_Id:</strong> {c._id}
                </p>
                <p>
                  <strong>Title:</strong> {c.campaign_title}
                </p>
                <p>
                  <strong>Fundraiser:</strong>{" "}
                  {c.created_by?.full_name || "N/A"}
                </p>
                <p>
                  <strong>Goal:</strong>{" "}
                  {c.target_amount
                    ? `₹${parseFloat(c.target_amount.$numberDecimal).toFixed(
                        2
                      )}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Raised:</strong>{" "}
                  {c.raised_amount
                    ? `₹${parseFloat(c.raised_amount.$numberDecimal).toFixed(
                        2
                      )}`
                    : "0"}
                </p>
                <Tag color={c.is_approved ? "green" : "volcano"}>
                  {c.is_approved ? "Approved" : "Pending"}
                </Tag>

                <Space wrap style={{ marginTop: 8 }}>
                  <Button
                    type={c.is_approved ? "default" : "primary"}
                    icon={
                      c.is_approved ? <StopOutlined /> : <CheckCircleOutlined />
                    }
                    onClick={() => handleApprovalToggle(c)}
                  >
                    {c.is_approved ? "Reject" : "Approve"}
                  </Button>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/fundraiser-campaigns/${c._id}`)}
                  ></Button>
                  <Popconfirm
                    title="Delete this campaign?"
                    onConfirm={() => handleDelete(c._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                </Space>
              </Card>
            ))}
        </div>
      </Row>
    </div>
  );
};

export default FundraiserCampaigns;
