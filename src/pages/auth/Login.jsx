import React, { useState } from "react";
import { Button, Input, Typography, Row, Col, Form, message } from "antd";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  useSentOtpMutation,
  useVerifyOtpMutation,
} from "../../redux/services/campaignApi";

const Login = () => {
  const navigate = useNavigate();
  const [stepCount, setStepCount] = useState(0);
  const [loginUser, { isLoading: isSendingOtp }] = useSentOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const phoneForm = useFormik({
    initialValues: { mobile_number: "" },
    onSubmit: async (values) => {
      try {
        const response = await loginUser({
          mobile_number: values.mobile_number,
        }).unwrap();
        if (response?.message?.includes("OTP")) {
          message.success(response.message);
          setStepCount(1);
        } else {
          message.error("Failed to send OTP");
        }
      } catch (err) {
        message.error("Error sending OTP");
      }
    },
  });

  const otpForm = useFormik({
    initialValues: { otp: "" },
    onSubmit: async (values) => {
      try {
        const response = await verifyOtp({
          mobile_number: phoneForm.values.mobile_number,
          otp: values.otp,
        }).unwrap();
        if (response.user.role != "admin") {
          message.error("you don't have access");
          return;
        }
        if (
          response.message === "OTP verified successfully" &&
          response.token
        ) {
          localStorage.setItem("authToken", response.token);
          message.success("OTP Verified Successfully");
          navigate("/");
        } else {
          message.error(response.message || "OTP Verification Failed");
        }
      } catch (err) {
        message.error("Error verifying OTP");
      }
    },
  });

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f0f4ff, #d6c4ff)",
      }}
    >
      <Col xs={22} sm={16} md={10} lg={8} xl={6}>
        <div
          style={{
            width: "100%",
            background: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "1.5rem",
            padding: "2rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <Typography.Title
            level={3}
            style={{
              textAlign: "center",
              color: "#333",
              marginBottom: "1.5rem",
            }}
          >
            Admin Login
          </Typography.Title>
          <Form style={{ width: "100%" }}>
            {stepCount ? (
              <>
                <Form.Item>
                  <Input
                    placeholder="Enter OTP"
                    size="large"
                    value={otpForm.values.otp}
                    onChange={(e) =>
                      otpForm.setFieldValue("otp", e.target.value)
                    }
                    maxLength={6}
                    prefix={<LockOutlined />}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    loading={isVerifyingOtp}
                    onClick={() => otpForm.handleSubmit()}
                    style={{
                      width: "100%",
                      background: "linear-gradient(90deg, #d8573e, #c24b35)",
                      border: "none",
                    }}
                  >
                    Verify OTP
                  </Button>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item>
                  <Input
                    placeholder="Phone Number"
                    size="large"
                    value={phoneForm.values.mobile_number}
                    onChange={(e) =>
                      phoneForm.setFieldValue("mobile_number", e.target.value)
                    }
                    prefix={<PhoneOutlined />}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    loading={isSendingOtp}
                    onClick={() => phoneForm.handleSubmit()}
                    style={{
                      width: "100%",
                      background: "linear-gradient(90deg, #d8573e, #c24b35)",
                      border: "none",
                    }}
                  >
                    Send OTP
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login;

// import React, { useContext, useEffect, useState } from "react";
// import { Alert, Button, Col, Form, Image, Input, Row, Typography } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// // import { AuthContext } from "../../providers/AuthProvider";

// const Login = () => {
//   const navigate = useNavigate();

//   const [error, setError] = useState(false);

//   const onFinish = async (values) => {
//     const validUser =
//       values?.email === "admin@admin.com" && values?.password === "admin123";

//     if (validUser) {
//       sessionStorage.setItem("auth", true);
//       navigate("/campaigns");
//     } else {
//       setError(true);
//     }
//   };

//   return (
//     <Row justify={"center"} align="stretch" style={{ height: "100vh" }}>
//       <Col span={9}>
//         <div
//           style={{
//             width: "100%",
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-around",
//             alignItems: "center",
//           }}
//         >
//           <Row
//             justify={"center"}
//             align={"center"}
//             gutter={[0, 30]}
//             style={{ width: "100%" }}
//           >
//             <Col span={20}>
//               <Form
//                 style={{ width: "100%" }}
//                 initialValues={{ remember: true }}
//                 onFinish={onFinish}
//               >
//                 <Row
//                   justify={"center"}
//                   gutter={[0, 25]}
//                   style={{ width: "100%" }}
//                 >
//                   <Col span={24}>
//                     <Typography.Title style={{ textAlign: "center" }} level={2}>
//                       Login
//                     </Typography.Title>
//                   </Col>
//                   <Col span={22}>
//                     <Form.Item
//                       name="email"
//                       rules={[
//                         {
//                           required: true,
//                         },
//                       ]}
//                     >
//                       <Input placeholder="Email" size="large" />
//                     </Form.Item>
//                     <Form.Item
//                       name="password"
//                       rules={[
//                         {
//                           required: true,
//                         },
//                       ]}
//                     >
//                       <Input.Password
//                         type="password"
//                         size="large"
//                         placeholder="Password"
//                       />
//                     </Form.Item>

//                     {error && (
//                       <Form.Item style={{ color: "red", marginTop: "-15px" }}>
//                         <Alert
//                           message="Invalid Credentials"
//                           type="error"
//                           style={{ color: "red" }}
//                         />
//                       </Form.Item>
//                     )}

//                     <Form.Item>
//                       <Button
//                         size="large"
//                         block
//                         type="primary"
//                         htmlType="submit"
//                         // loading={isLoading}
//                       >
//                         Log in
//                       </Button>

//                       {/* <Link className="login-form-forgot" to="/forgot-password">
//                         <Typography.Paragraph
//                           style={{ textAlign: "center", marginTop: "10px" }}
//                           type="secondary"
//                         >
//                           Forgot your password ?
//                         </Typography.Paragraph>
//                       </Link> */}
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </Form>
//             </Col>
//           </Row>
//         </div>
//       </Col>
//     </Row>
//   );
// };

// export default Login;
