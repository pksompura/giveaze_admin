// // import { DeleteOutlined, EditTwoTone } from "@ant-design/icons";
// // import {
// //   Button,
// //   Flex,
// //   Pagination,
// //   Popconfirm,
// //   Row,
// //   Space,
// //   Table,
// //   Typography,
// // } from "antd";
// // import { useNavigate, useSearchParams } from "react-router-dom";

// // import PrimaryWrapper from "../../components/PrimaryWrapper";
// // import { useGetAllUserQuery } from "../../redux/services/campaignApi";

// // const Users = () => {
// //   const navigate = useNavigate();
// //   const [searchParams, setSearchParams] = useSearchParams();
// //   const page = searchParams.get("page") || 1;

// //   const { data, isLoading: loadingUsers } = useGetAllUserQuery({ page });

// //   const columns = [
// //     {
// //       title: "ID",
// //       dataIndex: "id",
// //       render: (record, item, index) => index + 1,
// //     },
// //     {
// //       title: "Phone Number",
// //       dataIndex: "mobile_number",
// //     },
// //     //
// //     // {
// //     //   title: "Action",
// //     //   dataIndex: "id",
// //     //   fixed: "right",
// //     //   width: 100,
// //     //   render: (record) => (
// //     //     <Space>
// //     //       <Popconfirm
// //     //         title="Are you sure to delete this?"
// //     //         onConfirm={() => deleteRecord(record)}
// //     //         okText="Yes"
// //     //         okButtonProps={{ loading: deleting }}
// //     //         placement="topLeft"
// //     //         cancelText="No"
// //     //       >
// //     //         <Button icon={<DeleteOutlined />} danger />
// //     //       </Popconfirm>
// //     //     </Space>
// //     //   ),
// //     // },
// //   ];

// //   const onChange = (page) => {
// //     setSearchParams(
// //       (prev) => {
// //         prev.set("page", page);
// //         return prev;
// //       },
// //       { replace: true }
// //     );
// //   };

// //   return (
// //     <PrimaryWrapper>
// //       <Row justify={"space-between"} gutter={[0, 0]} align="middle">
// //         <Typography.Title level={2}>Users</Typography.Title>
// //       </Row>
// //       <Table
// //         columns={columns}
// //         dataSource={data || []}
// //         loading={loadingUsers}
// //         onChange={onChange}
// //         pagination={false}
// //       />
// //       <Flex justify="center">
// //         <Pagination
// //           defaultCurrent={1}
// //           total={data?.count}
// //           pageSize={50}
// //           showSizeChanger={false}
// //           onChange={onChange}
// //           current={+page}
// //           hideOnSinglePage={true}
// //         />
// //       </Flex>
// //     </PrimaryWrapper>
// //   );
// // };
// // export default Users;
// import {
//   DeleteOutlined,
//   EyeOutlined,
//   SearchOutlined,
//   StopOutlined,
//   CheckCircleOutlined,
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
//   message,
// } from "antd";
// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import debounce from "lodash.debounce";
// import PrimaryWrapper from "../../components/PrimaryWrapper";
// import {
//   useGetAllUserQuery,
//   useDeleteUserMutation,
//   useLazyGetUserWithLoginHistoryQuery,
//   useToggleBlockUserMutation,
// } from "../../redux/services/campaignApi";

// const Users = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const page = Number(searchParams.get("page")) || 1;
//   const search = searchParams.get("search") || "";

//   const [searchValue, setSearchValue] = useState(search);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loginHistory, setLoginHistory] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const { data, isLoading, refetch } = useGetAllUserQuery({ page, search });
//   const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
//   const [fetchLoginHistory, { isLoading: loginLoading }] =
//     useLazyGetUserWithLoginHistoryQuery();
//   const [toggleBlockUser, { isLoading: toggling }] =
//     useToggleBlockUserMutation();

//   const handleSearch = debounce((val) => {
//     setSearchParams({ page: 1, search: val });
//   }, 500);

//   const handleInputChange = (e) => {
//     setSearchValue(e.target.value);
//     handleSearch(e.target.value);
//   };

//   const showLoginHistory = async (user) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//     try {
//       const result = await fetchLoginHistory(user._id).unwrap();
//       console.log(result);
//       setLoginHistory(result || []);
//     } catch (err) {
//       console.error("Failed to fetch login history", err);
//       message.error("Failed to load login history.");
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setLoginHistory([]);
//     setSelectedUser(null);
//   };

//   const onChangePage = (newPage) => {
//     setSearchParams({ page: newPage, search });
//   };

//   const handleToggleBlock = async (user) => {
//     try {
//       await toggleBlockUser(user._id).unwrap();
//       message.success(
//         `User ${user.isBlocked ? "unblocked" : "blocked"} successfully`
//       );
//       refetch();
//     } catch (error) {
//       message.error("Something went wrong while toggling block status.");
//       console.error("Block/Unblock failed", error);
//     }
//   };

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "_id",
//       render: (_, __, index) => (page - 1) * 20 + index + 1,
//     },
//     {
//       title: "Full Name",
//       dataIndex: "full_name",
//       render: (text, record) => (
//         <span style={{ color: record.isBlocked ? "#ff4d4f" : "inherit" }}>
//           {text}
//         </span>
//       ),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//     },
//     {
//       title: "Phone Number",
//       dataIndex: "mobile_number",
//     },
//     {
//       title: "Login History",
//       render: (_, record) => (
//         <Button
//           icon={<EyeOutlined />}
//           type="link"
//           onClick={() => showLoginHistory(record)}
//         >
//           View
//         </Button>
//       ),
//     },
//     {
//       title: "Actions",
//       render: (_, record) => (
//         <Space wrap>
//           <Popconfirm
//             title={`Are you sure you want to ${
//               record.isBlocked ? "unblock" : "block"
//             } this user?`}
//             onConfirm={() => handleToggleBlock(record)}
//             okText="Yes"
//             cancelText="No"
//             okButtonProps={{ loading: toggling }}
//           >
//             <Button
//               icon={
//                 record.isBlocked ? <CheckCircleOutlined /> : <StopOutlined />
//               }
//               danger={!record.isBlocked}
//               type={record.isBlocked ? "primary" : "default"}
//               title={record.isBlocked ? "Unblock User" : "Block User"}
//             />
//           </Popconfirm>

//           <Popconfirm
//             title="Are you sure you want to delete this user?"
//             onConfirm={async () => {
//               try {
//                 await deleteUser(record._id).unwrap();
//                 message.success("User deleted successfully");
//                 refetch();
//               } catch (error) {
//                 console.error("Delete failed", error);
//                 message.error("Delete failed");
//               }
//             }}
//             okText="Yes"
//             cancelText="No"
//             okButtonProps={{ loading: deleting }}
//           >
//             <Button icon={<DeleteOutlined />} danger title="Delete User" />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <PrimaryWrapper>
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

//       <Table
//         columns={columns}
//         dataSource={data?.results || []}
//         rowKey="_id"
//         loading={isLoading}
//         pagination={false}
//         style={{ marginTop: 16 }}
//         rowClassName={(record) => (record.isBlocked ? "blocked-user-row" : "")}
//       />

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

//       <Modal
//         title={`Login History - ${selectedUser?.full_name || ""}`}
//         open={isModalOpen}
//         onCancel={closeModal}
//         footer={null}
//         width={700}
//       >
//         {loginLoading ? (
//           <Typography.Text>Loading...</Typography.Text>
//         ) : loginHistory.length > 0 ? (
//           <ul>
//             {loginHistory.map((log, idx) => (
//               <li key={idx} style={{ marginBottom: 8 }}>
//                 <strong>LoginAt:</strong>{" "}
//                 {new Date(log.loginAt).toLocaleString()}
//                 <br />
//                 <strong>LogoutAt:</strong>{" "}
//                 {log.logoutAt !== "Not logged out yet"
//                   ? new Date(log.logoutAt).toLocaleString()
//                   : "Not logged out yet"}
//                 <br />
//                 <strong>IP:</strong> {log.ipAddress}
//                 <br />
//                 <strong>Location:</strong> {log.location || "Not available"}
//                 <br />
//                 <strong>Device:</strong> {log.deviceInfo || "Not available"}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <Typography.Text>No login history available.</Typography.Text>
//         )}
//       </Modal>
//       <style>{`
//         .blocked-user-row {
//           background-color: #fff1f0 !important;
//         }
//       `}</style>
//     </PrimaryWrapper>
//   );
// };

// export default Users;
import {
  DeleteOutlined,
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
  message,
  Card,
} from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import PrimaryWrapper from "../../components/PrimaryWrapper";
import {
  useGetAllUserQuery,
  useDeleteUserMutation,
  useLazyGetUserWithLoginHistoryQuery,
  useToggleBlockUserMutation,
} from "../../redux/services/campaignApi";

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const [searchValue, setSearchValue] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const { data, isLoading, refetch } = useGetAllUserQuery({ page, search });
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [fetchLoginHistory, { isLoading: loginLoading }] =
    useLazyGetUserWithLoginHistoryQuery();
  const [toggleBlockUser, { isLoading: toggling }] =
    useToggleBlockUserMutation();

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = debounce((val) => {
    setSearchParams({ page: 1, search: val });
  }, 500);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    handleSearch(e.target.value);
  };

  const showLoginHistory = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    try {
      const result = await fetchLoginHistory(user._id).unwrap();
      setLoginHistory(result || []);
    } catch (err) {
      console.error("Failed to fetch login history", err);
      message.error("Failed to load login history.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLoginHistory([]);
    setSelectedUser(null);
  };

  const onChangePage = (newPage) => {
    setSearchParams({ page: newPage, search });
  };

  const handleToggleBlock = async (user) => {
    try {
      await toggleBlockUser(user._id).unwrap();
      message.success(
        `User ${user.isBlocked ? "unblocked" : "blocked"} successfully`
      );
      refetch();
    } catch (error) {
      message.error("Something went wrong while toggling block status.");
      console.error("Block/Unblock failed", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (_, __, index) => (page - 1) * 20 + index + 1,
      width: 80,
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      render: (text, record) => (
        <span style={{ color: record.isBlocked ? "#ff4d4f" : "inherit" }}>
          {text}
        </span>
      ),
      width: 180,
    },
    { title: "Email", dataIndex: "email", width: 200 },
    { title: "Phone Number", dataIndex: "mobile_number", width: 150 },
    {
      title: "Login History",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          type="link"
          onClick={() => showLoginHistory(record)}
        >
          View
        </Button>
      ),
      width: 120,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space wrap>
          <Popconfirm
            title={`Are you sure you want to ${
              record.isBlocked ? "unblock" : "block"
            } this user?`}
            onConfirm={() => handleToggleBlock(record)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: toggling }}
          >
            <Button
              icon={
                record.isBlocked ? <CheckCircleOutlined /> : <StopOutlined />
              }
              danger={!record.isBlocked}
              type={record.isBlocked ? "primary" : "default"}
              title={record.isBlocked ? "Unblock User" : "Block User"}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={async () => {
              try {
                await deleteUser(record._id).unwrap();
                message.success("User deleted successfully");
                refetch();
              } catch (error) {
                console.error("Delete failed", error);
                message.error("Delete failed");
              }
            }}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: deleting }}
          >
            <Button icon={<DeleteOutlined />} danger title="Delete User" />
          </Popconfirm>
        </Space>
      ),
      width: 160,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row justify="center">
        <div style={{ width: "100%", maxWidth: 1200 }}>
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
                Users
              </Typography.Title>
              <Input
                placeholder="Search by name, email, or phone"
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={handleInputChange}
                style={{ maxWidth: 300 }}
                allowClear
              />
            </Row>

            {!isMobile && (
              <Table
                columns={columns}
                dataSource={data?.results || []}
                rowKey="_id"
                loading={isLoading}
                pagination={false}
                rowClassName={(record) =>
                  record.isBlocked ? "blocked-user-row" : ""
                }
              />
            )}

            {isMobile &&
              (data?.results || []).map((user) => (
                <Card
                  key={user._id}
                  style={{
                    marginBottom: 16,
                    borderRadius: 8,
                    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
                    padding: 12,
                  }}
                >
                  <p>
                    <strong>ID:</strong> {user._id}
                  </p>
                  <p>
                    <strong>Name:</strong>{" "}
                    <span
                      style={{ color: user.isBlocked ? "#ff4d4f" : "inherit" }}
                    >
                      {user.full_name}
                    </span>
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.mobile_number}
                  </p>
                  <Button
                    icon={<EyeOutlined />}
                    type="link"
                    onClick={() => showLoginHistory(user)}
                    style={{ padding: 0 }}
                  >
                    View Login History
                  </Button>
                  <Space
                    direction="vertical"
                    style={{ width: "100%", marginTop: 8 }}
                  >
                    <Popconfirm
                      title={`Are you sure to ${
                        user.isBlocked ? "unblock" : "block"
                      } this user?`}
                      onConfirm={() => handleToggleBlock(user)}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ loading: toggling }}
                    >
                      <Button
                        icon={
                          user.isBlocked ? (
                            <CheckCircleOutlined />
                          ) : (
                            <StopOutlined />
                          )
                        }
                        danger={!user.isBlocked}
                        type={user.isBlocked ? "primary" : "default"}
                        block
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title="Are you sure to delete this user?"
                      onConfirm={async () => {
                        try {
                          await deleteUser(user._id).unwrap();
                          message.success("User deleted successfully");
                          refetch();
                        } catch {
                          message.error("Delete failed");
                        }
                      }}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ loading: deleting }}
                    >
                      <Button icon={<DeleteOutlined />} danger block>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                </Card>
              ))}

            <Row justify="end" style={{ marginTop: 16 }}>
              <Pagination
                current={page}
                total={data?.count || 0}
                pageSize={20}
                onChange={onChangePage}
                showSizeChanger={false}
                hideOnSinglePage
              />
            </Row>
          </div>
        </div>
      </Row>

      <Modal
        title={`Login History - ${selectedUser?.full_name || ""}`}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={700}
      >
        {loginLoading ? (
          <Typography.Text>Loading...</Typography.Text>
        ) : loginHistory.length > 0 ? (
          <ul>
            {loginHistory.map((log, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <strong>LoginAt:</strong>{" "}
                {new Date(log.loginAt).toLocaleString()}
                <br />
                <strong>LogoutAt:</strong>{" "}
                {log.logoutAt !== "Not logged out yet"
                  ? new Date(log.logoutAt).toLocaleString()
                  : "Not logged out yet"}
                <br />
                <strong>IP:</strong> {log.ipAddress}
                <br />
                <strong>Location:</strong> {log.location || "Not available"}
                <br />
                <strong>Device:</strong> {log.deviceInfo || "Not available"}
              </li>
            ))}
          </ul>
        ) : (
          <Typography.Text>No login history available.</Typography.Text>
        )}
      </Modal>

      <style>{`
        .blocked-user-row {
          background-color: #fff1f0 !important;
        }
      `}</style>
    </div>
  );
};

export default Users;
