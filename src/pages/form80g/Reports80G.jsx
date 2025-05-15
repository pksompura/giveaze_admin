import React, { useState } from "react";
import { Table, Input, Button, DatePicker, Space, notification } from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useGetAll80GDonationsQuery } from "../../redux/services/campaignApi";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;

const Donations80GReport = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState([null, null]);

  const { data, error, isLoading } = useGetAll80GDonationsQuery({
    page,
    limit: 10,
    search,
    start_date: dateRange?.[0],
    end_date: dateRange?.[1],
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setDateRange([
        dayjs(dates[0]).format("YYYY-MM-DD"),
        dayjs(dates[1]).format("YYYY-MM-DD"),
      ]);
      setPage(1);
    } else {
      setDateRange([]);
    }
  };

  const handleDownloadExcel = () => {
    if (!dateRange.length) {
      notification.warning({
        message: "Please select a date range to export the report.",
      });
      return;
    }

    // Add your Excel export logic here
    notification.success({
      message: "Export initiated (not implemented yet)",
    });
  };

  const handleExport = () => {
    
    const formattedData = (data?.data || []).map((item) => ({
      Name: item?.user_id?.full_name || "",
      Email: item?.user_id?.email || "",
      Mobile: item?.user_id?.mobile_number || "",
      PAN: item.pan_number,
      Amount:
        typeof item.total_amount === "object" &&
        item.total_amount?.$numberDecimal
          ? parseFloat(item.total_amount.$numberDecimal)
          : item.total_amount,
      Date: new Date(item.donated_date).toLocaleDateString("en-IN"),
      TransactionID: item.transaction_id,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "80G Donations");

    XLSX.writeFile(workbook, "80G_Donations.xlsx");
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "serial",
      render: (_, __, index) => (page - 1) * 10 + index + 1,
    },
    { title: "Unique ID", dataIndex: "pan_number" },
    { title: "Donor Name", dataIndex: "full_name" },
    { title: "Address", dataIndex: "full_address" },
    {
      title: "Amount (INR)",
      dataIndex: "total_amount",
      render: (amount) => `₹${amount?.toLocaleString("en-IN")}`,
    },

    { title: "Phone", dataIndex: "mobile_number" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Date",
      dataIndex: "donated_date",
      render: (date) => dayjs(date).format("DD-MM-YYYY HH:mm"),
    },
    { title: "Transaction ID", dataIndex: "transaction_id" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>80G Donations Report</h2>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by ID, Donor Name, Email, Phone"
          value={search}
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
        />
        <RangePicker onChange={handleDateChange} />
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          disabled={!dateRange.length}
        >
          Download Excel
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={(data?.data || []).map((item) => ({
          ...item,
          full_name: item?.user_id?.full_name,
          email: item?.user_id?.email,
          mobile_number: item?.user_id?.mobile_number,
          total_amount:
            typeof item.total_amount === "object" &&
            item.total_amount?.$numberDecimal
              ? parseFloat(item.total_amount.$numberDecimal)
              : item.total_amount,
        }))}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default Donations80GReport;
