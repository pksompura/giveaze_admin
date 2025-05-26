import React, { useState } from "react";
import { Table, Input, DatePicker, Button, Space, notification } from "antd";
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

  // Fetch transactions with optional search filter
  const { data: transactionsData, isLoading } =
    useGetAllTransactionsQuery(search);
  const [
    fetchTransactionsByDate,
    { data: filteredTransactionsData, isLoading: isFetchingFilteredData },
  ] = useLazyGetTransactionsByDateQuery();
  console.log(transactionsData);
  // Handle date selection
  const handleDateChange = (dates) => {
    if (dates) {
      setDateRange([
        dayjs(dates[0]).format("YYYY-MM-DD"),
        dayjs(dates[1]).format("YYYY-MM-DD"),
      ]);
    } else {
      setDateRange([]);
    }
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

    XLSX.writeFile(workbook, `transactions${dateRange}.xlsx`);

    // try {
    //   // Trigger the API call using RTK Query
    //   const { data: blob, error } = await fetchTransactionsByDate({
    //     start_date: dateRange[0],
    //     end_date: dateRange[1],
    //   });

    //   // Check if there's an error
    //   if (error) {
    //     console.error("Error during fetching:", error); // Log the error
    //     throw new Error("Failed to fetch Excel file: " + error.message);
    //   }

    //   // Check if the response is a valid Blob
    //   if (!blob || !(blob instanceof Blob)) {
    //     throw new Error("Invalid response received, expected Blob.");
    //   }

    //   // Create a download link for the Blob
    //   const url = window.URL.createObjectURL(blob);
    //   const fileName = `transactions_${dateRange[0]}_to_${dateRange[1]}.xlsx`;

    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", fileName);
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);

    //   window.URL.revokeObjectURL(url); // Clean up the URL object
    // } catch (error) {
    //   notification.error({
    //     message: "Download Error",
    //     description: "Failed to download the Excel file.",
    //   });
    //   console.error("Excel download failed:", error);
    // }
  };

  // Map transactions data properly
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

      {/* Search and Filters */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Transactions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<SearchOutlined />}
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

      {/* Transactions Table */}
      <Table
        columns={columns}
        dataSource={transactions}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default TransactionsList;

// import React, { useState } from "react";
// import { Table, Input, DatePicker, Button, Space, notification } from "antd";
// import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
// import {
//   useGetAllTransactionsQuery,
//   useLazyGetTransactionsByDateQuery,
// } from "../../redux/services/campaignApi";
// import dayjs from "dayjs";

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

//   const handleDownloadCSV = async () => {
//     if (!dateRange.length) {
//       notification.warn({
//         message: "No Date Range Selected",
//         description: "Please select a date range before downloading the CSV.",
//       });
//       return;
//     }
//     try {
//       // Trigger the lazy query with the selected date range
//       let transactionsData = await fetchTransactionsByDate({
//         start_date: dateRange[0],
//         end_date: dateRange[1],
//       });
//       const csvData = transactionsData.data; // The CSV string from the RTK query response

//       // Create a Blob from the CSV data
//       const blob = new Blob([csvData], { type: "text/csv" });

//       // Create a URL for the Blob
//       const url = window.URL.createObjectURL(blob);

//       // Generate the filename (you can customize this)
//       const fileName = `transactions_${dateRange[0]}_to_${dateRange[1]}.csv`;

//       // Create an anchor element and trigger the download
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", fileName);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Cleanup
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       notification.error({
//         message: "Error",
//         description: "Failed to download the CSV. Please try again.",
//       });
//       console.error("Error downloading CSV:", error);
//     }
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
//     donated_date: dayjs(transaction.donated_date).format("YYYY-MM-DD HH:mm"),
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
//           onClick={handleDownloadCSV}
//           disabled={!dateRange.length}
//         >
//           Download CSV
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
