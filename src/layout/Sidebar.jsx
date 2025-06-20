import { ConfigProvider, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  HomeOutlined,
  ProfileOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const menuItems = [
  // {
  //   label: "Category",
  //   key: "/category",
  //   icon: <HomeOutlined />,
  // },

  {
    label: "Campaigns",
    key: "/campaigns",
    icon: <TeamOutlined />,
  },
  {
    label: "Users",
    key: "/users",
    icon: <UserOutlined />,
  },
  {
    label: "Transactions",
    key: "/transactions",
    icon: <UserOutlined />,
  },
  {
    label: "Settings",
    key: "/settings",
    icon: <SettingOutlined />,
  },
  {
    label: "Donars",
    key: "/donars",
    icon: <SettingOutlined />,
  },
  // {
  //   label: "80G Submissions",
  //   key: "/80g-submissions",
  //   icon: <FileDoneOutlined />,
  // },
  // {
  //   label: "Approved 80G Forms",
  //   key: "/approved-80g",
  //   icon: <CheckCircleOutlined />,
  // },
  // {
  //   label: "Manage 80G Forms",
  //   key: "/manage-80g",
  //   icon: <ProfileOutlined />,
  // },
  {
    label: "80G Reports",
    key: "/80g-reports",
    icon: <BarChartOutlined />,
  },
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = (e) => {
    e.key !== null && navigate(e.key);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          iconSize: 30,
        },
        components: {
          Menu: {
            colorIcon: "green",
            size: "30px",
            fontSizeIcon: "50px",
            colorInfoActive: "red",
          },
        },
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={onClick}
        items={menuItems}
        style={{
          paddingBottom: "150px",
        }}
      />
    </ConfigProvider>
  );
};
export default SideBar;
