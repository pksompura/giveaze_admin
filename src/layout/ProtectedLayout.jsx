// import { Col, Layout, Row, theme } from "antd";
// import React, { useContext, useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import TopBar from "./Topbar";
// import SideBar from "./Sidebar";
// import { useLazyGetUserProfileQuery } from "../redux/services/campaignApi";
// // import { AuthContext } from "../providers/AuthProvider";

// // import { assets } from "../../assets";

// const { Header, Content, Sider } = Layout;

// const ProtectedLayout = () => {
//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();

//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);

//   useEffect(() => {
//     if (!localStorage.getItem("authToken")) {
//       navigate("/login", { replace: true });
//     }
//   }, [navigate]);

//   const [fetchData, { data, error }] = useLazyGetUserProfileQuery();

//   useEffect(() => {
//     if (localStorage.getItem("authToken")) {
//       const call = async () => {
//         try {
//           const res = await fetchData();

//           if (error) {
//             localStorage.removeItem("authToken");
//             window.location.reload();
//           }
//           //   if(res?.data?.status){
//           //  dispatch(setUserData({...res?.data?.data,donations:res?.data?.donations}))
//           //   }else{
//           //     localStorage.removeItem('authToken')
//           //     window.location.reload()
//           //   }
//         } catch (error) {
//           localStorage.removeItem("authToken");
//           window.location.reload();
//         }
//       };
//       call();
//     }
//   }, []);

//   return (
//     <Layout>
//       <Header
//         style={{
//           padding: 0,
//           background: colorBgContainer,
//           position: "fixed",
//           top: 0,
//           left: 0,
//           zIndex: 100,
//           width: "100%",
//           borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
//           height: "72px",
//         }}
//       >
//         <TopBar />
//       </Header>
//       <Layout
//         style={{
//           paddingTop: "72px",
//           zIndex: 0,
//           background: "#fff",
//           backgroundRepeat: "no-repeat",
//           backgroundSize: "cover",
//           minHeight: "100vh",
//         }}
//       >
//         {/* <Sider
//           width={250}
//           theme="light"
//           style={{
//             height: `calc(100vh - 72px)`,
//             boxShadow:
//               "0px 12px 24px 0px rgba(0, 0, 0, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
//             boxSizing: "border-box",
//             overflow: "auto",
//             position: "fixed",
//             left: 0,
//             top: "72px",
//             bottom: 0,
//           }}
//         >
//           <SideBar />
//         </Sider> */}
//         <Sider
//           width={250}
//           theme="light"
//           breakpoint="lg"
//           collapsedWidth="0"
//           onCollapse={(collapsed) => setCollapsed(collapsed)}
//           onBreakpoint={(broken) => setCollapsed(broken)}
//         >
//           <SideBar />
//         </Sider>

//         <Content
//           style={{
//             marginLeft: collapsed ? 0 : 250,
//             transition: "margin-left 0.2s",
//           }}
//         >
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };
// export default ProtectedLayout;
import { Layout, Grid } from "antd";
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "./Topbar";
import SideBar from "./Sidebar";
import { useLazyGetUserProfileQuery } from "../redux/services/campaignApi";

const { Header, Content, Sider } = Layout;

const ProtectedLayout = () => {
  const screens = Grid.useBreakpoint(); // Detect screen size
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(!screens.lg); // Collapse on mobile
  const [fetchData, { error }] = useLazyGetUserProfileQuery();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // Collapse on screen change
    setCollapsed(!screens.lg);
  }, [screens.lg]);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      const call = async () => {
        try {
          await fetchData();
          if (error) {
            localStorage.removeItem("authToken");
            window.location.reload();
          }
        } catch {
          localStorage.removeItem("authToken");
          window.location.reload();
        }
      };
      call();
    }
  }, []);

  return (
    <Layout>
      <Header
        style={{
          padding: 0,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <TopBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={!screens.lg}
        />
      </Header>
      <Layout style={{ paddingTop: "72px", minHeight: "100vh" }}>
        <Sider
          width={250}
          theme="light"
          collapsible={!screens.lg}
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={screens.lg ? 250 : 0}
          onCollapse={(newCollapsed) => setCollapsed(newCollapsed)}
          style={{
            position: "fixed",
            left: 0,
            top: "72px",
            bottom: 0,
            height: "calc(100vh - 72px)",
            overflow: "auto",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            zIndex: screens.lg ? 1 : 999,
          }}
        >
          <SideBar onClick={() => setCollapsed(true)} isMobile={!screens.lg} />
        </Sider>
        <Content
          style={{
            marginLeft: screens.lg && !collapsed ? 250 : 0,
            transition: "all 0.3s",
            padding: "20px",
            minHeight: "calc(100vh - 72px)",
            background: "#f0f2f5",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProtectedLayout;
