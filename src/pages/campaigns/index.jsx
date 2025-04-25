import React, { useEffect } from "react";
import PrimaryWrapper from "../../components/PrimaryWrapper";
import {
  Button,
  Flex,
  message,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useDeleteCampaignMutation,
  useGetAllCampaignQuery,
} from "../../redux/services/campaignApi";
import moment from "moment";
import { DeleteOutlined } from "@ant-design/icons";

const DeviceLinkRequest = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  const { data, isLoading } = useGetAllCampaignQuery();
  const [deleteRecord, { isLoading: deleting, isSuccess, isError }] =
    useDeleteCampaignMutation();
  console.log(data);
  useEffect(() => {
    if (isSuccess) {
      message.success("Record deleted successfully");
    }

    if (isError) {
      message.error("Something went wrong");
    }

    return () => {};
  }, [isSuccess, isError]);

  const columns = [
    {
      dataIndex: "_id", // Ensure to map the correct field for the ID
      title: "ID",
      width: 120,
      render: (text) => (
        <div style={{ fontSize: "12px", lineHeight: "1.3" }}>
          {text?.slice(0, text.length / 2)}
          <br />
          {text?.slice(text.length / 2)}
        </div>
      ),
    },
    {
      dataIndex: "campaign_title", // Correct mapping based on your new schema
      title: "Campaign Title",
      width: 200,
      sortable: false,
      render: (text, item) => {
        return <Link to={`/campaigns/${item?._id}/edit`}>{text}</Link>;
      },
    },
    {
      dataIndex: "state", // Correct mapping
      title: "Location",
      width: 150,
      sortable: false,
    },
    {
      dataIndex: "target_amount", // Correct mapping based on your schema
      title: "Goal Amount",
      width: 110,
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "N/A",
      sortable: false,
    },
    {
      dataIndex: "minimum_amount", // Correct mapping based on your schema
      title: "Min Amount",
      width: 110,
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "N/A",
      sortable: false,
    },
    {
      dataIndex: "raised_amount", // Correct mapping based on your schema
      title: "Raised Amount",
      width: 110,
      render: (text) =>
        text ? `₹${parseFloat(text.$numberDecimal).toFixed(2)}` : "0",
      sortable: false,
    },
    {
      dataIndex: "successfulDonations", // Correct mapping based on your new schema
      title: "Donors",
      width: 100,
      sortable: false,
    },

    // {
    //   dataIndex: "start_date", // Assuming you want to show the event start date
    //   title: "Start Date",
    //   width: 160,
    //   render: (text) => moment(text).format("YYYY-MM-DD"), // Formatting the date
    //   sortable: false,
    // },
    // {
    //   dataIndex: "end_date", // Show end date of the campaign
    //   title: "End Date",
    //   width: 160,
    //   render: (text) => moment(text).format("YYYY-MM-DD"), // Formatting the date
    //   sortable: false,
    // },
    {
      dataIndex: "createdAt", // Assuming created_at is being tracked in your schema
      title: "Created At",
      width: 150,
      render: (record) => moment(record).calendar(),
      sortable: false,
    },
    {
      dataIndex: "updatedAt", // Assuming created_at is being tracked in your schema
      title: "Updated At",
      width: 150,
      render: (record) => moment(record).calendar(),
      sortable: false,
    },
    {
      title: "Action",
      dataIndex: "_id",
      fixed: "right",
      width: 100,
      render: (record) => (
        <Space>
          <Popconfirm
            title="Are you sure to delete this?"
            onConfirm={() => deleteRecord(record)}
            okText="Yes"
            okButtonProps={{ loading: deleting }}
            placement="topLeft"
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
    <PrimaryWrapper>
      <Row justify={"space-between"} gutter={[0, 0]} align="middle">
        <Typography.Title level={2}>Campaigns</Typography.Title>
        <Button
          size="middle"
          type="primary"
          onClick={() => navigate(`/campaigns/create`)}
        >
          Create
        </Button>
      </Row>
      <Table
        columns={columns}
        dataSource={data?.campaigns || []}
        loading={isLoading}
        onChange={onChange}
        pagination={false}
        rowKey="_id" // Ensure unique row key is used
      />
      <Flex justify="right" style={{ marginTop: "20px" }}>
        <Pagination
          defaultCurrent={1}
          total={data?.count}
          pageSize={10}
          showSizeChanger={false}
          onChange={onChange}
          current={+page}
          hideOnSinglePage={true}
        />
      </Flex>
    </PrimaryWrapper>
  );
};

export default DeviceLinkRequest;
