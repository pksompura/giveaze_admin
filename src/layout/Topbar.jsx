// import React, { useContext, useState } from "react";
// import {
//   Avatar,
//   Button,
//   Col,
//   Dropdown,
//   Image,
//   Row,
//   Space,
//   Typography,
// } from "antd";
// import { Link } from "react-router-dom";
// import { capitalize } from "lodash";
// import logo from "/giveaze2.png";

// // import { AuthContext } from "../providers/AuthProvider";
// // import ChangePasswordModal from "../pages/auth/ChangePassword";

// const TopBar = () => {
//   // const { handleLogout } = useContext(AuthContext);
//   const [openModal, setOpenModal] = useState(false);
//   // const { data: loggedInUser } = useGetMeQuery();

//   const items = [
//     {
//       key: "1",
//       label: (
//         <Button
//           block
//           type="ghost"
//           onClick={() => {
//             localStorage.removeItem("authToken");
//             window.location.href = "/login";
//           }}
//         >
//           Logout
//         </Button>
//       ),
//     },
//     // {
//     //   key: "2",
//     //   label: (
//     //     <Button block type="ghost" onClick={() => setOpenModal(true)}>
//     //       Change Password
//     //     </Button>
//     //   ),
//     // },
//   ];

//   return (
//     <>
//       <Row justify={"center"} align={"middle"} style={{ height: "100%" }}>
//         <Col span={22}>
//           <Row
//             align={"stretch"}
//             justify={"space-between"}
//             style={{ height: "100%" }}
//           >
//             <Link to={"/"}>
//               <Image
//                 src={logo}
//                 preview={false}
//                 style={{ objectFit: "contain" }}
//                 height={40}
//                 width={170}
//               />
//             </Link>
//             <Space size={"middle"} align="center" direction="horizontal">
//               <Dropdown
//                 menu={{
//                   items,
//                 }}
//                 placement="bottom"
//               >
//                 <Space size={"middle"} direction="horizontal">
//                   <Avatar
//                     style={{
//                       verticalAlign: "middle",
//                       backgroundColor: "#f56a00",
//                     }}
//                     size="default"
//                   >
//                     {capitalize("A")}
//                   </Avatar>
//                   <Space.Compact size={"small"} direction="vertical" block>
//                     <Typography.Text
//                       strong
//                       style={{
//                         fontSize: "14px",
//                       }}
//                     >
//                       {"Admin"}
//                     </Typography.Text>
//                   </Space.Compact>
//                 </Space>
//               </Dropdown>
//             </Space>
//           </Row>
//         </Col>
//       </Row>
//       {/* <ChangePasswordModal openModal={openModal} setOpenModal={setOpenModal} /> */}
//     </>
//   );
// };

// export default TopBar;
import { Avatar, Button, Dropdown, Image, Row, Space, Typography } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import logo from "/giveaze2.png";

const TopBar = ({ collapsed, setCollapsed, isMobile }) => {
  const items = [
    {
      key: "1",
      label: (
        <Button
          block
          type="text"
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}
        >
          Logout
        </Button>
      ),
    },
  ];

  return (
    <Row
      justify="space-between"
      align="middle"
      style={{
        padding: "0 20px",
        height: "72px",
        width: "100%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      {/* Left Side: Menu Button + Logo */}
      <Row align="middle" gutter={16}>
        {isMobile && (
          <Button
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            type="text"
          />
        )}
        <Link to="/">
          <Image
            src={logo}
            preview={false}
            height={40}
            style={{
              objectFit: "contain",
              maxHeight: "40px",
              width: "auto",
            }}
          />
        </Link>
      </Row>

      {/* Right Side: User Dropdown */}
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space align="center">
          <Avatar
            style={{ backgroundColor: "#f56a00" }}
            icon={<UserOutlined />}
          />
          {!isMobile && (
            <Typography.Text strong style={{ fontSize: "14px" }}>
              Admin
            </Typography.Text>
          )}
        </Space>
      </Dropdown>
    </Row>
  );
};

export default TopBar;
