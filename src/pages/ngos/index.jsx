import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  message,
  ConfigProvider,
  Card,
  Pagination,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  useAdminListOrgsQuery,
  useAdminDecideOrgMutation,
} from "../../redux/services/ngoApi";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export default function NGOList() {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // fixed page size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { data, isLoading, refetch } = useAdminListOrgsQuery(statusFilter);
  const [decideOrg] = useAdminDecideOrgMutation();
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  // ✅ Handle responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ngos = data?.data || [];

  // ✅ Filter search
  const filteredData = useMemo(() => {
    if (!searchTerm) return ngos;
    return ngos.filter((org) =>
      org.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ngos, searchTerm]);

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  // ✅ Handle approve/reject/info
  const handleDecision = async (orgId, decision) => {
    try {
      setLoadingId(orgId);
      await decideOrg({ orgId, decision }).unwrap();
      message.success(`Organization ${decision.toLowerCase()} successfully!`);
      refetch();
    } catch (err) {
      message.error(err?.data?.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ Summary Stats
  const stats = useMemo(() => {
    const total = ngos.length;
    const approved = ngos.filter((n) => n.status === "APPROVED").length;
    const rejected = ngos.filter((n) => n.status === "REJECTED").length;
    const info = ngos.filter((n) => n.status === "INFO_REQUESTED").length;
    const pending = ngos.filter(
      (n) => !n.status || n.status === "PENDING"
    ).length;
    return { total, approved, rejected, info, pending };
  }, [ngos]);

  const columns = [
    {
      title: "Organization Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div>
          <div className="font-medium text-[#d8573e] text-sm sm:text-base">
            {name}
          </div>
          <div className="text-xs text-gray-500">
            {record.profile?.website || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Primary Contact",
      key: "primaryContact",
      render: (r) => (
        <div>
          <div className="font-medium">{r.primaryContact?.name || "—"}</div>
          <div className="text-xs text-gray-500">
            {r.primaryContact?.email || r.primaryContact?.phone || ""}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const color =
          status === "APPROVED"
            ? "green"
            : status === "REJECTED"
            ? "red"
            : status === "INFO_REQUESTED"
            ? "orange"
            : "blue";
        return <Tag color={color}>{status || "PENDING"}</Tag>;
      },
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => (d ? new Date(d).toLocaleDateString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space wrap className="justify-center gap-2">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/ngo/dashboard/${record._id}`)}
          >
            View
          </Button>
          <Button
            icon={<CheckCircleOutlined />}
            type="primary"
            size="small"
            loading={loadingId === record._id}
            onClick={() => handleDecision(record._id, "APPROVED")}
          >
            Approve
          </Button>
          <Button
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => handleDecision(record._id, "INFO_REQUESTED")}
          >
            Info
          </Button>
          <Button
            icon={<CloseCircleOutlined />}
            danger
            size="small"
            onClick={() => handleDecision(record._id, "REJECTED")}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d8573e",
          colorPrimaryHover: "#c34932",
          colorPrimaryActive: "#b3412d",
          colorTextLightSolid: "#ffffff",
        },
        components: {
          Button: { borderRadius: 6 },
          Table: { headerBg: "#fafafa", headerColor: "#333" },
        },
      }}
    >
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold text-[#d8573e] mb-5">
          NGO Applications
        </h2>

        {/* ===== Summary Stats ===== */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6} md={4}>
            <Card bordered={false} className="shadow-sm text-center">
              <Statistic title="Total NGOs" value={stats.total} />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card bordered={false} className="shadow-sm text-center">
              <Statistic
                title="Approved"
                value={stats.approved}
                valueStyle={{ color: "green" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card bordered={false} className="shadow-sm text-center">
              <Statistic
                title="Pending"
                value={stats.pending}
                valueStyle={{ color: "#1677ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card bordered={false} className="shadow-sm text-center">
              <Statistic
                title="Info Requested"
                value={stats.info}
                valueStyle={{ color: "orange" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card bordered={false} className="shadow-sm text-center">
              <Statistic
                title="Rejected"
                value={stats.rejected}
                valueStyle={{ color: "red" }}
              />
            </Card>
          </Col>
        </Row>

        {/* ===== Filters ===== */}
        <Space style={{ marginBottom: 16, marginTop: 16 }} wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by NGO name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: isMobile ? "100%" : 250 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: isMobile ? "100%" : 180 }}
            placeholder="Filter by status"
            allowClear
          >
            <Option value="">All</Option>
            <Option value="APPROVED">Approved</Option>
            <Option value="REJECTED">Rejected</Option>
            <Option value="INFO_REQUESTED">Info Requested</Option>
            <Option value="PENDING">Pending</Option>
          </Select>
        </Space>

        {/* ===== Desktop Table ===== */}
        {!isMobile && (
          <Card bordered={false} className="shadow-sm rounded-xl">
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={columns}
                dataSource={paginatedData}
                rowKey="_id"
                loading={isLoading}
                pagination={false}
                bordered
                scroll={{ x: "max-content" }}
              />
            </div>

            {/* Right-aligned Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <Pagination
                current={page}
                pageSize={limit}
                total={filteredData.length}
                onChange={(p) => setPage(p)}
              />
            </div>
          </Card>
        )}

        {/* ===== Mobile Cards ===== */}
        {isMobile &&
          paginatedData.map((item) => (
            <Card
              key={item._id}
              bordered
              style={{
                marginBottom: 16,
                padding: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                borderRadius: 8,
              }}
            >
              <p>
                <strong>Organization:</strong> {item.name}
              </p>
              <p>
                <strong>Website:</strong> {item.profile?.website || "N/A"}
              </p>
              <p>
                <strong>Contact:</strong> {item.primaryContact?.name || "—"}
              </p>
              <p>
                <strong>Email:</strong> {item.primaryContact?.email || "—"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Tag
                  color={
                    item.status === "APPROVED"
                      ? "green"
                      : item.status === "REJECTED"
                      ? "red"
                      : item.status === "INFO_REQUESTED"
                      ? "orange"
                      : "blue"
                  }
                >
                  {item.status || "PENDING"}
                </Tag>
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => navigate(`/ngo/dashboard/${item._id}`)}
                >
                  View
                </Button>
                <Button
                  icon={<CheckCircleOutlined />}
                  type="primary"
                  size="small"
                  onClick={() => handleDecision(item._id, "APPROVED")}
                >
                  Approve
                </Button>
                <Button
                  icon={<InfoCircleOutlined />}
                  size="small"
                  onClick={() => handleDecision(item._id, "INFO_REQUESTED")}
                >
                  Info
                </Button>
                <Button
                  icon={<CloseCircleOutlined />}
                  danger
                  size="small"
                  onClick={() => handleDecision(item._id, "REJECTED")}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}

        {/* ===== Mobile Pagination (Right Aligned) ===== */}
        {isMobile && filteredData.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            <Pagination
              current={page}
              pageSize={limit}
              total={filteredData.length}
              onChange={(p) => setPage(p)}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm pt-6">
          © {new Date().getFullYear()} NGO Management Panel
        </div>
      </div>
    </ConfigProvider>
  );
}
