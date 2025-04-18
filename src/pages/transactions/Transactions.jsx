import React, { useState } from "react";
import { Table, Input, DatePicker, Select, Button, Space, InputNumber, Popconfirm, message } from "antd";
import moment from "moment";
import { useDeleteDonationMutation, useGetAllDonationsQuery } from "../../redux/services/campaignApi";
import { DeleteColumnOutlined, DeleteFilled } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Transactions = () => {
  const [filters, setFilters] = useState({
    search: "",
    min_amount: null,
    max_amount: null,
    payment_status: "",
    start_date: null,
    end_date: null,
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetAllDonationsQuery(filters);

  const handleSearch = () => {
    setFilters({ ...filters, page: 1 });  
  };

  const handleReset = () => {
    setFilters({
      search: "",
      min_amount: null,
      max_amount: null,
      payment_status: "",
      start_date: null,
      end_date: null,
      page: 1,
      limit: 10,
    });
  };
  
  const [deleteDonation, { isLoading: isDeleting }] = useDeleteDonationMutation();

  const handleDelete = async (id) => {
    try {
      await deleteDonation(id).unwrap();
      message.success("Donation deleted successfully");
    } catch (err) {
      message.error(err?.data?.error || "Failed to delete donation");
    }
  };
  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
    },
    {
      title: "Donated Date",
      dataIndex: "donated_date",
      key: "donated_date",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Amount (INR)",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (val) => parseFloat(val.$numberDecimal).toFixed(2),
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status) => status.toUpperCase(),
    },
    {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Popconfirm
            title="Are you sure to delete this donation?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteFilled
              style={{ color: "red", cursor: "pointer", fontSize: "18px" }}
            />
          </Popconfirm>
        ),
      },
  ];

  return (
    <div style={{padding:'5px'}}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space wrap>
          <Input
            placeholder="Search by Transaction ID or Notes"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ width: 220 }}
          />
          <InputNumber
            placeholder="Min Amount"
            value={filters.min_amount}
            onChange={(value) => setFilters({ ...filters, min_amount: value })}
          />
          <InputNumber
            placeholder="Max Amount"
            value={filters.max_amount}
            onChange={(value) => setFilters({ ...filters, max_amount: value })}
          />
          <RangePicker
            onChange={(dates) => {
              if (dates) {
                setFilters({
                  ...filters,
                  start_date: dates[0].startOf("day").toISOString(),
                  end_date: dates[1].endOf("day").toISOString(),
                });
              } else {
                setFilters({ ...filters, start_date: null, end_date: null });
              }
            }}
          />
          <Select
            placeholder="Payment Status"
            allowClear
            style={{ width: 160 }}
            value={filters.payment_status || undefined}
            onChange={(value) => setFilters({ ...filters, payment_status: value })}
          >
            <Option value="successful">Successful</Option>
            <Option value="failed">Failed</Option>
            <Option value="pending">Pending</Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Space>

        <Table
          columns={columns}
          loading={isLoading}
          dataSource={data?.data || []}
          rowKey="_id"
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.meta?.total || 0,
            showSizeChanger: true,
            onChange: (page, pageSize) =>
              setFilters({ ...filters, page, limit: pageSize }),
          }}
        />
      </Space>
    </div>
  );
};

export default Transactions;
