import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  Tag,
  List,
  Button,
  ConfigProvider,
  Descriptions,
  Input,
  message,
  Row,
  Col,
  Divider,
  Progress,
  Image,
  Modal,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SendOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetOrgApplicationQuery,
  useAdminDecideOrgMutation,
  useTicketMessageMutation,
  useVerifyDocumentMutation,
} from "../../redux/services/ngoApi";
import { IMAGE_BASE_URL } from "../../utils/baseUrl";

const ViewNGO = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();

  // API hooks
  const { data, isLoading, refetch } = useGetOrgApplicationQuery(orgId);
  const [decideOrg, { isLoading: deciding }] = useAdminDecideOrgMutation();
  const [sendMessage] = useTicketMessageMutation();
  const [verifyDocument, { isLoading: verifying }] =
    useVerifyDocumentMutation();

  // Local states
  const [msgText, setMsgText] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingItem, setRejectingItem] = useState(null);

  // Responsive watcher
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const org = data?.data?.org;
  const ticket = data?.data?.ticket;

  // Progress %
  const progressPct = useMemo(() => {
    const list = ticket?.checklist || [];
    if (!list.length) return 0;
    const passed = list.filter((i) => i.passed).length;
    return Math.round((passed / list.length) * 100);
  }, [ticket]);

  // Org status update
  const handleDecision = async (decision) => {
    try {
      await decideOrg({ orgId, decision }).unwrap();
      message.success(`Organization ${decision.toLowerCase()} successfully!`);
      refetch();
    } catch {
      message.error("Failed to update status");
    }
  };

  // Send message to NGO
  const handleSendMessage = async () => {
    if (!msgText.trim()) return;
    try {
      await sendMessage({ orgId, text: msgText, attachments: [] }).unwrap();
      message.success("Message sent");
      setMsgText("");
      refetch();
    } catch {
      message.error("Failed to send message");
    }
  };

  // Verify / Reject document
  const handleVerifyDocument = async (item, passed) => {
    if (!passed) {
      setRejectingItem(item);
      setRejectReason("");
      setIsRejectModalVisible(true);
      return;
    }

    try {
      await verifyDocument({
        orgId,
        key: item.key,
        passed,
        comment: "",
      }).unwrap();
      message.success(`${item.label} approved successfully`);
      refetch();
    } catch {
      message.error("Failed to update document status");
    }
  };

  // Confirm reject from modal
  const handleRejectConfirm = async () => {
    if (!rejectingItem) return;
    try {
      await verifyDocument({
        orgId,
        key: rejectingItem.key,
        passed: false,
        comment: rejectReason.trim() || "Rejected",
      }).unwrap();
      message.success(`${rejectingItem.label} rejected successfully`);
      setIsRejectModalVisible(false);
      setRejectReason("");
      setRejectingItem(null);
      refetch();
    } catch {
      message.error("Failed to reject document");
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        <Spin /> Loading NGO details...
      </div>
    );

  if (!org)
    return (
      <div className="p-8 text-center text-gray-500">
        Organization not found or access denied.
      </div>
    );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d8573e",
          colorPrimaryHover: "#c34932",
          colorPrimaryActive: "#b3412d",
          colorTextLightSolid: "#ffffff",
          borderRadius: 8,
        },
      }}
    >
      <div style={{ padding: 20, background: "#f9fafb", minHeight: "100vh" }}>
        {/* ===== Header ===== */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ borderRadius: 6 }}
            >
              Back
            </Button>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#d8573e",
                margin: 0,
              }}
            >
              NGO Application Overview
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: isMobile ? "flex-start" : "flex-end",
            }}
          >
            <Button
              icon={<CheckCircleOutlined />}
              type="primary"
              loading={deciding}
              onClick={() => handleDecision("APPROVED")}
            >
              Approve
            </Button>
            <Button
              icon={<InfoCircleOutlined />}
              onClick={() => handleDecision("INFO_REQUESTED")}
            >
              Request Info
            </Button>
            <Button
              icon={<CloseCircleOutlined />}
              danger
              onClick={() => handleDecision("REJECTED")}
            >
              Reject
            </Button>
          </div>
        </div>

        {/* ===== Summary Section ===== */}
        <Card
          bordered
          style={{
            marginBottom: 20,
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Row gutter={[16, 16]} justify="space-between" align="middle">
            <Col xs={24} sm={12}>
              <Tag
                color={
                  org.status === "APPROVED"
                    ? "green"
                    : org.status === "REJECTED"
                    ? "red"
                    : org.status === "INFO_REQUESTED"
                    ? "orange"
                    : "blue"
                }
                style={{ fontSize: 14, padding: "4px 10px" }}
              >
                {org.status || "PENDING"}
              </Tag>
              <p style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
                <b>Application ID:</b> {org._id}
              </p>
              <p style={{ fontSize: 13, color: "#555" }}>
                <b>Created On:</b> {new Date(org.createdAt).toLocaleString()}
              </p>
            </Col>
            <Col
              xs={24}
              sm={12}
              style={{ textAlign: isMobile ? "left" : "right" }}
            >
              <p style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
                Progress: <b>{progressPct}%</b>
              </p>
              <Progress
                percent={progressPct}
                showInfo={false}
                strokeColor="#d8573e"
                style={{ maxWidth: 220 }}
              />
            </Col>
          </Row>
        </Card>

        {/* ===== Checklist ===== */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card
              bordered
              title={
                <span style={{ fontWeight: 600, color: "#d8573e" }}>
                  Verification Checklist
                </span>
              }
              style={{
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <List
                dataSource={ticket?.checklist || []}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      item.fileUrl ? (
                        <Button
                          icon={<EyeOutlined />}
                          size="small"
                          type="default"
                          onClick={() => {
                            setPreviewImage(`${IMAGE_BASE_URL}${item.fileUrl}`);
                            setPreviewVisible(true);
                          }}
                        >
                          View
                        </Button>
                      ) : (
                        <Tag color="red">No File</Tag>
                      ),
                      item.passed ? (
                        <Tag color="green">Verified</Tag>
                      ) : item.comment?.toLowerCase().includes("reject") ? (
                        <Tag color="red">Rejected</Tag>
                      ) : (
                        <Tag color="orange">Pending</Tag>
                      ),
                      <div style={{ display: "flex", gap: 6 }}>
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          loading={verifying}
                          onClick={() => handleVerifyDocument(item, true)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          danger
                          loading={verifying}
                          onClick={() => handleVerifyDocument(item, false)}
                        >
                          Reject
                        </Button>
                      </div>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.label}
                      description={
                        item.comment ? (
                          <span style={{ color: "#888", fontSize: 13 }}>
                            {item.comment}
                          </span>
                        ) : null
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* ===== Messages Section ===== */}
          <Col xs={24} md={12}>
            <Card
              bordered
              title={
                <span style={{ fontWeight: 600, color: "#d8573e" }}>
                  Messages with NGO
                </span>
              }
              style={{
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  background: "#fafafa",
                  borderRadius: 8,
                  padding: 10,
                  maxHeight: 250,
                  overflowY: "auto",
                  marginBottom: 12,
                  border: "1px solid #f0f0f0",
                }}
              >
                {(ticket?.messages || []).length ? (
                  ticket.messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: 10,
                        padding: 8,
                        borderRadius: 6,
                        background:
                          m.by === "ORG" ? "#fff" : "rgba(216,87,62,0.08)",
                        border:
                          m.by === "ORG"
                            ? "1px solid #eee"
                            : "1px solid rgba(216,87,62,0.2)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 11,
                          color: "#666",
                          marginBottom: 4,
                        }}
                      >
                        <span>{m.by}</span>
                        <span>{new Date(m.at).toLocaleString()}</span>
                      </div>
                      <div style={{ fontSize: 13 }}>{m.text}</div>
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#888",
                      fontSize: 13,
                      margin: 0,
                    }}
                  >
                    No messages yet.
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 8,
                }}
              >
                <Input.TextArea
                  rows={2}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  placeholder="Write a message to NGO..."
                  style={{ borderRadius: 6 }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  style={{
                    alignSelf: isMobile ? "flex-end" : "center",
                    padding: "0 20px",
                  }}
                >
                  Send
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ===== Reject Reason Modal ===== */}
        <Modal
          title="Reject Document"
          open={isRejectModalVisible}
          onCancel={() => setIsRejectModalVisible(false)}
          onOk={handleRejectConfirm}
          okText="Reject"
          okButtonProps={{ danger: true }}
        >
          <p style={{ marginBottom: 8 }}>
            Please provide a reason for rejecting{" "}
            <b>{rejectingItem?.label || "this document"}</b> (optional):
          </p>
          <Input.TextArea
            rows={3}
            placeholder="Enter reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </Modal>

        {/* ===== Preview Modal ===== */}
        <Modal
          open={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          centered
          width={800}
        >
          <Image
            src={previewImage}
            alt="Document Preview"
            style={{
              maxHeight: "80vh",
              maxWidth: "100%",
              borderRadius: 8,
              objectFit: "contain",
            }}
          />
        </Modal>

        {/* ===== Footer ===== */}
        <Divider />
        <p
          style={{
            textAlign: "center",
            color: "#aaa",
            fontSize: 13,
            marginTop: 10,
          }}
        >
          © {new Date().getFullYear()} NGO Management Panel
        </p>
      </div>
    </ConfigProvider>
  );
};

export default ViewNGO;
