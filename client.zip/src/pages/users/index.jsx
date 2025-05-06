import { DeleteOutlined, EditTwoTone } from "@ant-design/icons";
import {
  Button,
  Flex,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

import PrimaryWrapper from "../../components/PrimaryWrapper";
import { useGetAllUserQuery } from "../../redux/services/campaignApi";

const Users = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  const { data, isLoading: loadingUsers } = useGetAllUserQuery({ page });
  console.log(data);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (record, item, index) => index + 1,
    },
    {
      title: "Phone Number",
      dataIndex: "mobile_number",
    },

    // {
    //   title: "Action",
    //   dataIndex: "id",
    //   fixed: "right",
    //   width: 100,
    //   render: (record) => (
    //     <Space>
    //       <Popconfirm
    //         title="Are you sure to delete this?"
    //         onConfirm={() => deleteRecord(record)}
    //         okText="Yes"
    //         okButtonProps={{ loading: deleting }}
    //         placement="topLeft"
    //         cancelText="No"
    //       >
    //         <Button icon={<DeleteOutlined />} danger />
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
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
        <Typography.Title level={2}>Users</Typography.Title>
      </Row>
      <Table
        columns={columns}
        dataSource={data || []}
        loading={loadingUsers}
        onChange={onChange}
        pagination={false}
      />
      <Flex justify="center">
        <Pagination
          defaultCurrent={1}
          total={data?.count}
          pageSize={50}
          showSizeChanger={false}
          onChange={onChange}
          current={+page}
          hideOnSinglePage={true}
        />
      </Flex>
    </PrimaryWrapper>
  );
};
export default Users;
// import {
//   DeleteOutlined,
//   EditTwoTone,
//   EyeOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import {
//   Button,
//   Flex,
//   Input,
//   Modal,
//   Pagination,
//   Popconfirm,
//   Row,
//   Space,
//   Table,
//   Typography,
// } from "antd";
// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import debounce from "lodash.debounce";

// import PrimaryWrapper from "../../components/PrimaryWrapper";
// import {
//   useGetAllUserQuery,
//   useDeleteUserMutation,
//   useLazyGetLoginHistoryQuery,
// } from "../../redux/services/campaignApi";
// console.log(useGetAllUserQuery);

// const Users = () => {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   // Pagination and search values from query params
//   const page = Number(searchParams.get("page")) || 1;
//   const search = searchParams.get("search") || "";

//   const [searchValue, setSearchValue] = useState(search);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loginHistory, setLoginHistory] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Fetch all users
//   const { data, isLoading } = useGetAllUserQuery({ page, search });
//   console.log(data);
//   // Mutation: delete user
//   const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

//   // Lazy query: get login history
//   const [getLoginHistory] = useLazyGetLoginHistoryQuery();

//   // Handle search input with debounc
//   const handleSearch = debounce((val) => {
//     setSearchParams({ page: 1, search: val });
//   }, 500);

//   const handleInputChange = (e) => {
//     setSearchValue(e.target.value);
//     handleSearch(e.target.value);
//   };

//   // Show login history modal
//   const showLoginHistory = async (user) => {
//     setSelectedUser(user);
//     try {
//       const result = await getLoginHistory(user._id).unwrap();
//       setLoginHistory(result || []);
//     } catch (err) {
//       console.error("Failed to fetch login history", err);
//       setLoginHistory([]);
//     }
//     setIsModalOpen(true);
//   };

//   // Modal close
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setLoginHistory([]);
//   };

//   // Handle pagination change
//   const onChangePage = (newPage) => {
//     setSearchParams({ page: newPage, search });
//   };

//   // Table columns
//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "_id",
//       render: (text, record, index) => (page - 1) * 20 + index + 1,
//     },
//     {
//       title: "Full Name",
//       dataIndex: "full_name",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//     },
//     {
//       title: "Phone Number",
//       dataIndex: "mobile_number",
//     },
//     // {
//     //   title: "Created",
//     //   dataIndex: "createdAt",
//     //   render: (value) => new Date(value).toLocaleDateString(),
//     // },
//     // {
//     //   title: "Login History",
//     //   render: (_, record) => (
//     //     <Button
//     //       icon={<EyeOutlined />}
//     //       type="link"
//     //       onClick={() => showLoginHistory(record)}
//     //     >
//     //       View
//     //     </Button>
//     //   ),
//     // },
//     // {
//     //   title: "Actions",
//     //   render: (_, record) => (
//     //     <Space>
//     //       <Button
//     //         icon={<EditTwoTone />}
//     //         onClick={() => navigate(`/edit/${record._id}`)}
//     //       />
//     //       <Popconfirm
//     //         title="Are you sure to delete this user?"
//     //         onConfirm={() => deleteUser(record._id)}
//     //         okText="Yes"
//     //         okButtonProps={{ loading: deleting }}
//     //         cancelText="No"
//     //       >
//     //         <Button icon={<DeleteOutlined />} danger />
//     //       </Popconfirm>
//     //     </Space>
//     //   ),
//     // },
//   ];

//   return (
//     <PrimaryWrapper>
//       {/* Header with search */}
//       <Row justify="space-between" align="middle" gutter={[0, 12]}>
//         <Typography.Title level={2}>Users</Typography.Title>
//         <Input
//           placeholder="Search by name, email, or phone"
//           prefix={<SearchOutlined />}
//           value={searchValue}
//           onChange={handleInputChange}
//           style={{ maxWidth: 300 }}
//           allowClear
//         />
//       </Row>

//       {/* User Table */}
//       <Table
//         columns={columns}
//         dataSource={data?.results || []}
//         rowKey="_id"
//         loading={isLoading}
//         pagination={false}
//       />

//       {/* Pagination */}
//       <Flex justify="center" style={{ marginTop: 16 }}>
//         <Pagination
//           current={page}
//           total={data?.count || 0}
//           pageSize={20}
//           onChange={onChangePage}
//           showSizeChanger={false}
//           hideOnSinglePage
//         />
//       </Flex>

//       {/* Login History Modal */}
//       <Modal
//         title={`Login History - ${selectedUser?.full_name}`}
//         open={isModalOpen}
//         onCancel={closeModal}
//         footer={null}
//         width={700}
//       >
//         {loginHistory.length > 0 ? (
//           <ul>
//             {loginHistory.map((log, idx) => (
//               <li key={idx} style={{ marginBottom: 8 }}>
//                 <strong>Date:</strong> {new Date(log.time).toLocaleString()}{" "}
//                 <br />
//                 <strong>IP:</strong> {log.ip} <br />
//                 <strong>Device:</strong> {log.device}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <Typography.Text>No login data for the last month.</Typography.Text>
//         )}
//       </Modal>
//     </PrimaryWrapper>
//   );
// };
