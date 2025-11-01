// import { ConfigProvider, Menu } from "antd";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   BarChartOutlined,
//   CheckCircleOutlined,
//   FileDoneOutlined,
//   HomeOutlined,
//   ProfileOutlined,
//   SettingOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from "@ant-design/icons";

// const menuItems = [
//   // {
//   //   label: "Category",
//   //   key: "/category",
//   //   icon: <HomeOutlined />,
//   // },

//   {
//     label: "Campaigns",
//     key: "/campaigns",
//     icon: <TeamOutlined />,
//   },
//   {
//     label: "Users",
//     key: "/users",
//     icon: <UserOutlined />,
//   },
//   {
//     label: "Transactions",
//     key: "/transactions",
//     icon: <UserOutlined />,
//   },
//   {
//     label: "Settings",
//     key: "/settings",
//     icon: <SettingOutlined />,
//   },
//   {
//     label: "Donars",
//     key: "/donars",
//     icon: <SettingOutlined />,
//   },
//   // {
//   //   label: "80G Submissions",
//   //   key: "/80g-submissions",
//   //   icon: <FileDoneOutlined />,
//   // },
//   // {
//   //   label: "Approved 80G Forms",
//   //   key: "/approved-80g",
//   //   icon: <CheckCircleOutlined />,
//   // },
//   // {
//   //   label: "Manage 80G Forms",
//   //   key: "/manage-80g",
//   //   icon: <ProfileOutlined />,
//   // },
//   {
//     label: "80G Reports",
//     key: "/80g-reports",
//     icon: <BarChartOutlined />,
//   },
// ];

// const SideBar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const onClick = (e) => {
//     e.key !== null && navigate(e.key);
//   };

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           // Seed Token
//           iconSize: 30,
//         },
//         components: {
//           Menu: {
//             colorIcon: "green",
//             size: "30px",
//             fontSizeIcon: "50px",
//             colorInfoActive: "red",
//           },
//         },
//       }}
//     >
//       <Menu
//         mode="inline"
//         selectedKeys={[location.pathname]}
//         onClick={onClick}
//         items={menuItems}
//         style={{
//           paddingBottom: "150px",
//         }}
//       />
//     </ConfigProvider>
//   );
// };
// export default SideBar;
import { ConfigProvider, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
// import {
//   BarChartOutlined,
//   FileDoneOutlined,
//   SettingOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
import {
  FundOutlined, // for Campaigns
  UserOutlined, // for Users
  TransactionOutlined, // for Transactions
  SettingOutlined, // for Settings
  TeamOutlined, // for Donors
  FileTextOutlined,
  FundProjectionScreenOutlined,
  BankOutlined,
  DollarOutlined, // for 80G Reports
} from "@ant-design/icons";

const menuItems = [
  {
    label: "Campaigns",
    key: "/campaigns",
    icon: <FundOutlined />,
  },
  {
    label: "Fundraiser Campaigns",
    key: "/fundraiser-campaigns",
    icon: <FundProjectionScreenOutlined />,
  },
  {
    label: "Users",
    key: "/users",
    icon: <UserOutlined />,
  },
  {
    label: "NGOs",
    key: "/ngos",
    icon: <BankOutlined />,
  },

  {
    label: "Transactions",
    key: "/transactions",
    icon: <TransactionOutlined />,
  },
  {
    label: "Settings",
    key: "/settings",
    icon: <SettingOutlined />,
  },
  {
    label: "Donors",
    key: "/donars",
    icon: <TeamOutlined />,
  },
  {
    label: "80G Reports",
    key: "/80g-reports",
    icon: <FileTextOutlined />,
  },
];

const SideBar = ({ onClick, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    navigate(e.key); // Navigate to selected route
    if (isMobile && onClick) {
      onClick(); // Collapse the sidebar on mobile after navigation
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          iconSize: 24,
        },
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={handleClick} // Use updated handler
        items={menuItems}
        style={{ height: "100%", borderRight: 0 }}
      />
    </ConfigProvider>
  );
};

export default SideBar;
