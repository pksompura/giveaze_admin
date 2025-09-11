// import React, { useState } from "react";
// import { Table, Input, DatePicker, Button, Space, notification } from "antd";
// import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
// import {
//   useGetAllTransactionsQuery,
//   useLazyGetTransactionsByDateQuery,
// } from "../../redux/services/campaignApi";
// import dayjs from "dayjs";
// import * as XLSX from "xlsx";

// const { RangePicker } = DatePicker;

// const TransactionsList = () => {
//   const [search, setSearch] = useState("");
//   const [dateRange, setDateRange] = useState([]);

//   // Fetch transactions with optional search filter
//   const { data: transactionsData, isLoading } =
//     useGetAllTransactionsQuery(search);
//   const [
//     fetchTransactionsByDate,
//     { data: filteredTransactionsData, isLoading: isFetchingFilteredData },
//   ] = useLazyGetTransactionsByDateQuery();
//   // Handle date selection
//   const handleDateChange = (dates) => {
//     if (dates) {
//       setDateRange([
//         dayjs(dates[0]).format("YYYY-MM-DD"),
//         dayjs(dates[1]).format("YYYY-MM-DD"),
//       ]);
//     } else {
//       setDateRange([]);
//     }
//   };

//   const handleDownloadExcel = async () => {
//     if (!dateRange.length) {
//       notification.warn({
//         message: "No Date Range Selected",
//         description:
//           "Please select a date range before downloading the Excel file.",
//       });
//       return;
//     }

//     if (!transactions || transactions.length === 0) return;

//     const formattedData = transactions.map((tx) => ({
//       "Transaction ID": tx.transaction_id,
//       "User Name": tx.user_name,
//       "Mobile Number": tx.mobile_number,
//       Email: tx.email,
//       "Amount (₹)": tx.total_amount,
//       Status: tx.payment_status,
//       Date: tx.donated_date,
//       "Campaign Title": tx.campaign_title,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(formattedData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

//     XLSX.writeFile(workbook, `transactions${dateRange}.xlsx`);

//     // try {
//     //   // Trigger the API call using RTK Query
//     //   const { data: blob, error } = await fetchTransactionsByDate({
//     //     start_date: dateRange[0],
//     //     end_date: dateRange[1],
//     //   });

//     //   // Check if there's an error
//     //   if (error) {
//     //     console.error("Error during fetching:", error); // Log the error
//     //     throw new Error("Failed to fetch Excel file: " + error.message);
//     //   }

//     //   // Check if the response is a valid Blob
//     //   if (!blob || !(blob instanceof Blob)) {
//     //     throw new Error("Invalid response received, expected Blob.");
//     //   }

//     //   // Create a download link for the Blob
//     //   const url = window.URL.createObjectURL(blob);
//     //   const fileName = `transactions_${dateRange[0]}_to_${dateRange[1]}.xlsx`;

//     //   const link = document.createElement("a");
//     //   link.href = url;
//     //   link.setAttribute("download", fileName);
//     //   document.body.appendChild(link);
//     //   link.click();
//     //   document.body.removeChild(link);

//     //   window.URL.revokeObjectURL(url); // Clean up the URL object
//     // } catch (error) {
//     //   notification.error({
//     //     message: "Download Error",
//     //     description: "Failed to download the Excel file.",
//     //   });
//     //   console.error("Excel download failed:", error);
//     // }
//   };

//   // Map transactions data properly
//   const transactions = transactionsData?.data?.map((transaction) => ({
//     key: transaction._id,
//     transaction_id: transaction.transaction_id,
//     user_name: transaction.user_data?.full_name || "N/A",
//     mobile_number: transaction.user_data?.mobile_number || "N/A",
//     email: transaction.user_data?.email || "N/A",
//     total_amount: parseFloat(transaction.total_amount.$numberDecimal),
//     payment_status: transaction.payment_status,
//     donated_date: dayjs(transaction.donated_date).format("DD-MM-YYYY HH:mm"),
//     campaign_title: transaction.campaign_data?.campaign_title || "N/A",
//   }));

//   const columns = [
//     {
//       title: "Transaction ID",
//       dataIndex: "transaction_id",
//       key: "transaction_id",
//     },
//     { title: "User Name", dataIndex: "user_name", key: "user_name" },
//     {
//       title: "Mobile Number",
//       dataIndex: "mobile_number",
//       key: "mobile_number",
//     },
//     { title: "Email", dataIndex: "email", key: "email" },
//     {
//       title: "Amount",
//       dataIndex: "total_amount",
//       key: "total_amount",
//       render: (amount) => `₹${amount}`,
//     },
//     { title: "Status", dataIndex: "payment_status", key: "payment_status" },
//     { title: "Date", dataIndex: "donated_date", key: "donated_date" },
//     {
//       title: "Campaign Title",
//       dataIndex: "campaign_title",
//       key: "campaign_title",
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Transactions List</h2>

//       {/* Search and Filters */}
//       <Space style={{ marginBottom: 16 }}>
//         <Input
//           placeholder="Search Transactions"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           prefix={<SearchOutlined />}
//         />
//         <RangePicker onChange={handleDateChange} />
//         <Button
//           type="primary"
//           icon={<DownloadOutlined />}
//           onClick={handleDownloadExcel}
//           disabled={!dateRange.length}
//         >
//           Download Excel
//         </Button>
//       </Space>

//       {/* Transactions Table */}
//       <Table
//         columns={columns}
//         dataSource={transactions}
//         loading={isLoading}
//         pagination={{ pageSize: 10 }}
//         bordered
//       />
//     </div>
//   );
// };

// export default TransactionsList;

// // import React, { useState } from "react";
// // import { Table, Input, DatePicker, Button, Space, notification } from "antd";
// // import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
// // import {
// //   useGetAllTransactionsQuery,
// //   useLazyGetTransactionsByDateQuery,
// // } from "../../redux/services/campaignApi";
// // import dayjs from "dayjs";

// // const { RangePicker } = DatePicker;

// // const TransactionsList = () => {
// //   const [search, setSearch] = useState("");
// //   const [dateRange, setDateRange] = useState([]);

// //   // Fetch transactions with optional search filter
// //   const { data: transactionsData, isLoading } =
// //     useGetAllTransactionsQuery(search);
// //   const [
// //     fetchTransactionsByDate,
// //     { data: filteredTransactionsData, isLoading: isFetchingFilteredData },
// //   ] = useLazyGetTransactionsByDateQuery();

// //   // Handle date selection
// //   const handleDateChange = (dates) => {
// //     if (dates) {
// //       setDateRange([
// //         dayjs(dates[0]).format("YYYY-MM-DD"),
// //         dayjs(dates[1]).format("YYYY-MM-DD"),
// //       ]);
// //     } else {
// //       setDateRange([]);
// //     }
// //   };

// //   const handleDownloadCSV = async () => {
// //     if (!dateRange.length) {
// //       notification.warn({
// //         message: "No Date Range Selected",
// //         description: "Please select a date range before downloading the CSV.",
// //       });
// //       return;
// //     }
// //     try {
// //       // Trigger the lazy query with the selected date range
// //       let transactionsData = await fetchTransactionsByDate({
// //         start_date: dateRange[0],
// //         end_date: dateRange[1],
// //       });
// //       const csvData = transactionsData.data; // The CSV string from the RTK query response

// //       // Create a Blob from the CSV data
// //       const blob = new Blob([csvData], { type: "text/csv" });

// //       // Create a URL for the Blob
// //       const url = window.URL.createObjectURL(blob);

// //       // Generate the filename (you can customize this)
// //       const fileName = `transactions_${dateRange[0]}_to_${dateRange[1]}.csv`;

// //       // Create an anchor element and trigger the download
// //       const link = document.createElement("a");
// //       link.href = url;
// //       link.setAttribute("download", fileName);
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);

// //       // Cleanup
// //       window.URL.revokeObjectURL(url);
// //     } catch (error) {
// //       notification.error({
// //         message: "Error",
// //         description: "Failed to download the CSV. Please try again.",
// //       });
// //       console.error("Error downloading CSV:", error);
// //     }
// //   };

// //   // Map transactions data properly
// //   const transactions = transactionsData?.data?.map((transaction) => ({
// //     key: transaction._id,
// //     transaction_id: transaction.transaction_id,
// //     user_name: transaction.user_data?.full_name || "N/A",
// //     mobile_number: transaction.user_data?.mobile_number || "N/A",
// //     email: transaction.user_data?.email || "N/A",
// //     total_amount: parseFloat(transaction.total_amount.$numberDecimal),
// //     payment_status: transaction.payment_status,
// //     donated_date: dayjs(transaction.donated_date).format("YYYY-MM-DD HH:mm"),
// //     campaign_title: transaction.campaign_data?.campaign_title || "N/A",
// //   }));

// //   const columns = [
// //     {
// //       title: "Transaction ID",
// //       dataIndex: "transaction_id",
// //       key: "transaction_id",
// //     },
// //     { title: "User Name", dataIndex: "user_name", key: "user_name" },
// //     {
// //       title: "Mobile Number",
// //       dataIndex: "mobile_number",
// //       key: "mobile_number",
// //     },
// //     { title: "Email", dataIndex: "email", key: "email" },
// //     {
// //       title: "Amount",
// //       dataIndex: "total_amount",
// //       key: "total_amount",
// //       render: (amount) => `₹${amount}`,
// //     },
// //     { title: "Status", dataIndex: "payment_status", key: "payment_status" },
// //     { title: "Date", dataIndex: "donated_date", key: "donated_date" },
// //     {
// //       title: "Campaign Title",
// //       dataIndex: "campaign_title",
// //       key: "campaign_title",
// //     },
// //   ];

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h2>Transactions List</h2>

// //       {/* Search and Filters */}
// //       <Space style={{ marginBottom: 16 }}>
// //         <Input
// //           placeholder="Search Transactions"
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           prefix={<SearchOutlined />}
// //         />
// //         <RangePicker onChange={handleDateChange} />
// //         <Button
// //           type="primary"
// //           icon={<DownloadOutlined />}
// //           onClick={handleDownloadCSV}
// //           disabled={!dateRange.length}
// //         >
// //           Download CSV
// //         </Button>
// //       </Space>

// //       {/* Transactions Table */}
// //       <Table
// //         columns={columns}
// //         dataSource={transactions}
// //         loading={isLoading}
// //         pagination={{ pageSize: 10 }}
// //         bordered
// //       />
// //     </div>
// //   );
// // };

// // export default TransactionsList;
import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  DatePicker,
  Button,
  Space,
  Card,
  Pagination,
  notification,
} from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import {
  useGetAllTransactionsQuery,
  useLazyGetTransactionsByDateQuery,
} from "../../redux/services/campaignApi";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;

const TransactionsList = () => {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch all transactions (search only)
  const { data: transactionsData, isLoading } = useGetAllTransactionsQuery(
    search,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Lazy fetch by date range (if needed for Excel download)
  const [fetchTransactionsByDate] = useLazyGetTransactionsByDateQuery();

  const handleDateChange = (dates) => {
    if (dates) {
      setDateRange([
        dayjs(dates[0]).format("YYYY-MM-DD"),
        dayjs(dates[1]).format("YYYY-MM-DD"),
      ]);
    } else {
      setDateRange([]);
    }
    setPage(1);
  };

  const handleDownloadExcel = async () => {
    if (!dateRange.length) {
      notification.warn({
        message: "No Date Range Selected",
        description:
          "Please select a date range before downloading the Excel file.",
      });
      return;
    }

    if (!transactions || transactions.length === 0) return;

    const formattedData = transactions.map((tx) => ({
      "Transaction ID": tx.transaction_id,
      "User Name": tx.user_name,
      "Mobile Number": tx.mobile_number,
      Email: tx.email,
      "Amount (₹)": tx.total_amount,
      Status: tx.payment_status,
      Date: tx.donated_date,
      "Campaign Title": tx.campaign_title,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(
      workbook,
      `transactions_${dateRange[0]}_to_${dateRange[1]}.xlsx`
    );
  };

  // Map transactions for table/cards
  const transactions = transactionsData?.data?.map((transaction) => ({
    key: transaction._id,
    transaction_id: transaction.transaction_id,
    user_name: transaction.user_data?.full_name || "N/A",
    mobile_number: transaction.user_data?.mobile_number || "N/A",
    email: transaction.user_data?.email || "N/A",
    total_amount: parseFloat(transaction.total_amount.$numberDecimal),
    payment_status: transaction.payment_status,
    donated_date: dayjs(transaction.donated_date).format("DD-MM-YYYY HH:mm"),
    campaign_title: transaction.campaign_data?.campaign_title || "N/A",
  }));

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
    },
    { title: "User Name", dataIndex: "user_name", key: "user_name" },
    {
      title: "Mobile Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => `₹${amount}`,
    },
    { title: "Status", dataIndex: "payment_status", key: "payment_status" },
    { title: "Date", dataIndex: "donated_date", key: "donated_date" },
    {
      title: "Campaign Title",
      dataIndex: "campaign_title",
      key: "campaign_title",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Transactions List</h2>

      {/* Filters */}
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Transactions"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          prefix={<SearchOutlined />}
          style={{ width: 220 }}
          allowClear
        />
        <RangePicker onChange={handleDateChange} />
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownloadExcel}
          disabled={!dateRange.length}
        >
          Download Excel
        </Button>
      </Space>

      {/* Desktop Table */}
      {!isMobile && (
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={columns}
            dataSource={transactions}
            loading={isLoading}
            pagination={{
              current: page,
              pageSize: limit,
              total: transactionsData?.meta?.total || 0,
              showSizeChanger: true,
              onChange: (p, l) => {
                setPage(p);
                setLimit(l);
              },
            }}
            bordered
            scroll={{ x: "max-content" }}
          />
        </div>
      )}

      {/* Mobile Cards */}
      {isMobile && (
        <>
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            {(transactions || [])
              .slice((page - 1) * limit, page * limit) // <-- slice for pagination
              .map((tx) => (
                <Card
                  key={tx.key}
                  bordered
                  style={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    borderRadius: 8,
                  }}
                >
                  <p>
                    <strong>Transaction ID:</strong> {tx.transaction_id}
                  </p>
                  <p>
                    <strong>User Name:</strong> {tx.user_name}
                  </p>
                  <p>
                    <strong>Mobile Number:</strong> {tx.mobile_number}
                  </p>
                  <p>
                    <strong>Email:</strong> {tx.email}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{tx.total_amount}
                  </p>
                  <p>
                    <strong>Status:</strong> {tx.payment_status}
                  </p>
                  <p>
                    <strong>Date:</strong> {tx.donated_date}
                  </p>
                  <p>
                    <strong>Campaign:</strong> {tx.campaign_title}
                  </p>
                </Card>
              ))}
          </Space>

          {/* Mobile Pagination */}
          {(transactions || []).length > 0 && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Pagination
                current={page}
                pageSize={limit}
                total={transactions?.length || 0} // total items
                showSizeChanger
                onChange={(p, l) => {
                  setPage(p);
                  setLimit(l);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionsList;
