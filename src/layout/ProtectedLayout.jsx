import { Col, Layout, Row, theme } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "./Topbar";
import SideBar from "./Sidebar";
import { useLazyGetUserProfileQuery } from "../redux/services/campaignApi";
// import { AuthContext } from "../providers/AuthProvider";

// import { assets } from "../../assets";

const { Header, Content, Sider } = Layout;

const ProtectedLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);


    const [fetchData,{data,error}]=useLazyGetUserProfileQuery()
 
    useEffect(() => {
      if(localStorage.getItem("authToken")){
        const call=async()=>{
          try {
            
            const res=await fetchData()
           
            if(error){
              localStorage.removeItem('authToken')
              window.location.reload()
            }
          //   if(res?.data?.status){
          //  dispatch(setUserData({...res?.data?.data,donations:res?.data?.donations}))  
          //   }else{
          //     localStorage.removeItem('authToken')
          //     window.location.reload()
          //   }
          } catch (error) {
            localStorage.removeItem('authToken')
            window.location.reload()
          }
  
        }
        call()
      }
    
    }, []);
  
  return (
    <Layout>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          width: "100%",
          borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
          height: "72px",
        }}
      >
        <TopBar />
      </Header>
      <Layout
        style={{
          paddingTop: "72px",
          zIndex: 0,
          background: "#fff",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          minHeight: "100vh",
        }}
      >
        <Sider
          width={250}
          theme="light"
          style={{
            height: `calc(100vh - 72px)`,
            boxShadow:
              "0px 12px 24px 0px rgba(0, 0, 0, 0.16), 0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
            boxSizing: "border-box",
            overflow: "auto",
            position: "fixed",
            left: 0,
            top: "72px",
            bottom: 0,
          }}
        >
          <SideBar />
        </Sider>

        <Content
          style={{
            zIndex: 0,
            marginLeft: 250,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default ProtectedLayout;
