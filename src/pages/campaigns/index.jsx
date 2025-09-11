// import React, { useEffect } from "react";
// import PrimaryWrapper from "../../components/PrimaryWrapper";
// import {
//   Button,
//   Flex,
//   message,
//   Pagination,
//   Popconfirm,
//   Row,
//   Space,
//   Table,
//   Typography,
// } from "antd";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import {
//   useDeleteCampaignMutation,
//   useGetAllCampaignQuery,
// } from "../../redux/services/campaignApi";
// import moment from "moment";
// import { DeleteOutlined } from "@ant-design/icons";

// const DeviceLinkRequest = () => {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const page = searchParams.get("page") || 1;

//   const { data, isLoading } = useGetAllCampaignQuery();
//   const [deleteRecord, { isLoading: deleting, isSuccess, isError }] =
//     useDeleteCampaignMutation();
//   console.log(data);
//   useEffect(() => {
//     if (isSuccess) {
//       message.success("Record deleted successfully");
//     }

//     if (isError) {
//       message.error("Something went wrong");
//     }

//     return () => {};
//   }, [isSuccess, isError]);

//   const columns = [
//     {
//       dataIndex: "_id", // Ensure to map the correct field for the ID
//       title: "ID",
//       width: 120,
//       render: (text) => (
//         <div style={{ fontSize: "12px", lineHeight: "1.3" }}>
//           {text?.slice(0, text.length / 2)}
//           <br />
//           {text?.slice(text.length / 2)}
//         </div>
//       ),
//     },
//     {
//       dataIndex: "campaign_title", // Correct mapping based on your new schema
//       title: "Campaign Title",
//       width: 200,
//       sortable: false,
//       render: (text, item) => {
//         return <Link to={`/campaigns/${item?._id}/edit`}>{text}</Link>;
//       },
//     },
//     {
//       dataIndex: "state", // Correct mapping
//       title: "Location",
//       width: 150,
//       sortable: false,
//     },
//     {
//       dataIndex: "target_amount", // Correct mapping based on your schema
//       title: "Goal Amount",
//       width: 110,
//       render: (text) =>
//         text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "N/A",
//       sortable: false,
//     },
//     {
//       dataIndex: "minimum_amount", // Correct mapping based on your schema
//       title: "Min Amount",
//       width: 110,
//       render: (text) =>
//         text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "N/A",
//       sortable: false,
//     },
//     {
//       dataIndex: "raised_amount", // Correct mapping based on your schema
//       title: "Raised Amount",
//       width: 110,
//       render: (text) =>
//         text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "0",
//       sortable: false,
//     },
//     {
//       dataIndex: "successfulDonations", // Correct mapping based on your new schema
//       title: "Donors",
//       width: 100,
//       sortable: false,
//     },

//     // {
//     //   dataIndex: "start_date", // Assuming you want to show the event start date
//     //   title: "Start Date",
//     //   width: 160,
//     //   render: (text) => moment(text).format("YYYY-MM-DD"), // Formatting the date
//     //   sortable: false,
//     // },
//     // {
//     //   dataIndex: "end_date", // Show end date of the campaign
//     //   title: "End Date",
//     //   width: 160,
//     //   render: (text) => moment(text).format("YYYY-MM-DD"), // Formatting the date
//     //   sortable: false,
//     // },
//     {
//       dataIndex: "createdAt", // Assuming created_at is being tracked in your schema
//       title: "Created At",
//       width: 150,
//       render: (record) => moment(record).calendar(),
//       sortable: false,
//     },
//     {
//       dataIndex: "updatedAt", // Assuming created_at is being tracked in your schema
//       title: "Updated At",
//       width: 150,
//       render: (record) => moment(record).calendar(),
//       sortable: false,
//     },
//     {
//       title: "Action",
//       dataIndex: "_id",
//       fixed: "right",
//       width: 100,
//       render: (record) => (
//         <Space>
//           <Popconfirm
//             title="Are you sure to delete this?"
//             onConfirm={() => deleteRecord(record)}
//             okText="Yes"
//             okButtonProps={{ loading: deleting }}
//             placement="topLeft"
//             cancelText="No"
//           >
//             <Button icon={<DeleteOutlined />} danger />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const onChange = (page) => {
//     setSearchParams(
//       (prev) => {
//         prev.set("page", page);
//         return prev;
//       },
//       { replace: true }
//     );
//   };

//   return (
//     <PrimaryWrapper>
//       <Row justify={"space-between"} gutter={[0, 0]} align="middle">
//         <Typography.Title level={2}>Campaigns</Typography.Title>
//         <Button
//           size="middle"
//           type="primary"
//           onClick={() => navigate(`/campaigns/create`)}
//         >
//           Create
//         </Button>
//       </Row>
//       <Table
//         columns={columns}
//         dataSource={data?.campaigns || []}
//         loading={isLoading}
//         onChange={onChange}
//         pagination={false}
//         rowKey="_id" // Ensure unique row key is used
//       />
//       <Flex justify="right" style={{ marginTop: "20px" }}>
//         <Pagination
//           defaultCurrent={1}
//           total={data?.count}
//           pageSize={10}
//           showSizeChanger={false}
//           onChange={onChange}
//           current={+page}
//           hideOnSinglePage={true}
//         />
//       </Flex>
//     </PrimaryWrapper>
//   );
// };

// export default DeviceLinkRequest;
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Space,
  Typography,
  Popconfirm,
  message,
  Pagination,
  Card,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useDeleteCampaignMutation,
  useGetAllCampaignQuery,
} from "../../redux/services/campaignApi";
import moment from "moment";

const DeviceLinkRequest = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const [isMobile, setIsMobile] = useState(false);

  const { data, isLoading } = useGetAllCampaignQuery();
  const [deleteRecord, { isLoading: deleting, isSuccess, isError }] =
    useDeleteCampaignMutation();

  useEffect(() => {
    if (isSuccess) message.success("Record deleted successfully");
    if (isError) message.error("Something went wrong");
  }, [isSuccess, isError]);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = [
    {
      dataIndex: "_id",
      title: "ID",
      width: 150,
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
      title: "Campaign Title",
      width: 250,
      render: (text, item) => (
        <Link to={`/campaigns/${item?._id}/edit`}>{text}</Link>
      ),
    },
    { dataIndex: "state", title: "Location", width: 180 },
    {
      dataIndex: "target_amount",
      title: "Goal Amount",
      width: 140,
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "N/A",
    },
    {
      dataIndex: "minimum_amount",
      title: "Min Amount",
      width: 140,
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "N/A",
    },
    {
      dataIndex: "raised_amount",
      title: "Raised Amount",
      width: 140,
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "0",
    },
    { dataIndex: "successfulDonations", title: "Donors", width: 120 },
    {
      dataIndex: "createdAt",
      title: "Created At",
      width: 180,
      render: (text) => moment(text).calendar(),
    },
    {
      dataIndex: "updatedAt",
      title: "Updated At",
      width: 180,
      render: (text) => moment(text).calendar(),
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 120,
      render: (record) => (
        <Space>
          <Popconfirm
            title="Are you sure to delete this?"
            onConfirm={() => deleteRecord(record)}
            okText="Yes"
            okButtonProps={{ loading: deleting }}
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onChange = (page) => {
    setSearchParams(
      (prev) => {
        prev.set("page", page);
        return prev;
      },
      { replace: true }
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <Row justify="center">
        <Col style={{ width: "100%", maxWidth: 1200 }}>
          <div
            style={{
              padding: 20,
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 16 }}
            >
              <Typography.Title level={2} style={{ margin: 0 }}>
                Campaigns
              </Typography.Title>
              <Button
                type="primary"
                onClick={() => navigate("/campaigns/create")}
              >
                Create
              </Button>
            </Row>

            {/* Desktop Table without horizontal scroll */}
            {!isMobile && (
              <Table
                columns={columns}
                dataSource={data?.campaigns || []}
                loading={isLoading}
                pagination={false}
                rowKey="_id"
              />
            )}

            {/* Mobile Cards */}
            {isMobile && (
              <>
                {(data?.campaigns || []).map((item) => (
                  <Card
                    key={item._id}
                    style={{
                      marginBottom: 16,
                      borderRadius: 8,
                      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
                      padding: 12,
                    }}
                  >
                    <p>
                      <strong>ID:</strong> {item._id}
                    </p>
                    <p>
                      <strong>Title:</strong>{" "}
                      <Link to={`/campaigns/${item?._id}/edit`}>
                        {item.campaign_title}
                      </Link>
                    </p>
                    <p>
                      <strong>Location:</strong> {item.state}
                    </p>
                    <p>
                      <strong>Goal Amount:</strong> ₹
                      {item.target_amount?.$numberDecimal || "N/A"}
                    </p>
                    <p>
                      <strong>Min Amount:</strong> ₹
                      {item.minimum_amount?.$numberDecimal || "N/A"}
                    </p>
                    <p>
                      <strong>Raised Amount:</strong> ₹
                      {item.raised_amount?.$numberDecimal || "0"}
                    </p>
                    <p>
                      <strong>Donors:</strong> {item.successfulDonations}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {moment(item.createdAt).calendar()}
                    </p>
                    <p>
                      <strong>Updated:</strong>{" "}
                      {moment(item.updatedAt).calendar()}
                    </p>
                    <Popconfirm
                      title="Are you sure to delete this?"
                      onConfirm={() => deleteRecord(item._id)}
                      okText="Yes"
                      okButtonProps={{ loading: deleting }}
                      cancelText="No"
                    >
                      <Button icon={<DeleteOutlined />} danger block>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Card>
                ))}

                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Pagination
                    current={+page}
                    pageSize={10}
                    total={data?.count || 0}
                    onChange={onChange}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DeviceLinkRequest;
