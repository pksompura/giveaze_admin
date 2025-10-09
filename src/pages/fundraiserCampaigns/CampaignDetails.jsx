import React, { useEffect, useState } from "react";
import {
  Card,
  Tabs,
  Typography,
  Descriptions,
  Tag,
  Table,
  Button,
  Space,
  message,
  Row,
  Col,
} from "antd";
import { useParams } from "react-router-dom";
import {
  useGetCampaignQuery,
  useGetBankQuery,
  useUpdateBankStatusMutation,
  useGetWithdrawalsQuery,
  useUpdateWithdrawalStatusMutation,
} from "../../redux/services/campaignApi";
import moment from "moment";

const { Title } = Typography;

const CampaignDetails = () => {
  const { id } = useParams();

  const { data: campaignData, isLoading } = useGetCampaignQuery(id);
  const { data: bankData } = useGetBankQuery(id);
  const { data: withdrawals } = useGetWithdrawalsQuery(id);

  const banks = bankData?.bank ? [bankData.bank] : [];

  console.log(banks);

  const [updateBankStatus] = useUpdateBankStatusMutation();
  const [updateWithdrawalStatus] = useUpdateWithdrawalStatusMutation();

  const [isMobile, setIsMobile] = useState(false);

  const campaign = campaignData?.data?.campaign;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBankStatus = async (bankId, status) => {
    try {
      await updateBankStatus({ bankId, status }).unwrap();
      message.success(`Bank status updated: ${status}`);
    } catch {
      message.error("Failed to update bank status");
    }
  };

  const handleWithdrawalStatus = async (withdrawalId, status) => {
    try {
      await updateWithdrawalStatus({ withdrawalId, status }).unwrap();
      message.success(`Withdrawal status updated: ${status}`);
    } catch {
      message.error("Failed to update withdrawal status");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Campaign Details</Title>

      <Card style={{ marginBottom: 20 }}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">
              {campaign?.campaign_title}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {campaign?.category}
            </Descriptions.Item>
            <Descriptions.Item label="Goal">
              ₹{campaign?.target_amount?.$numberDecimal}
            </Descriptions.Item>
            <Descriptions.Item label="Raised">
              ₹{campaign?.raised_amount?.$numberDecimal || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Approval Status">
              <Tag color={campaign?.is_approved ? "green" : "volcano"}>
                {campaign?.is_approved ? "Approved" : "Pending"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {moment(campaign?.createdAt).format("DD MMM, YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {moment(campaign?.updatedAt).format("DD MMM, YYYY")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Tabs
        items={[
          {
            key: "1",
            label: "Beneficiary",
            children: (
              <Card>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Beneficiary">
                    {campaign?.beneficiary}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type">
                    {campaign?.beneficiary_type}
                  </Descriptions.Item>
                  {/* <Descriptions.Item label="Description">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: campaign?.campaign_description || "N/A",
                      }}
                    />
                  </Descriptions.Item> */}
                  <Descriptions.Item label="Story">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: campaign?.campaign_description || "N/A",
                      }}
                    />
                  </Descriptions.Item>
                  {campaign?.dynamic_fields &&
                    Object.entries(campaign.dynamic_fields).map(([k, v]) => (
                      <Descriptions.Item label={k} key={k}>
                        {v}
                      </Descriptions.Item>
                    ))}
                </Descriptions>
              </Card>
            ),
          },
          {
            key: "2",
            label: "Bank Accounts",
            children: !isMobile ? (
              <Table
                rowKey="_id"
                dataSource={banks}
                columns={[
                  { title: "Bank", dataIndex: "bank_name" },
                  { title: "Account Holder", dataIndex: "account_holder_name" },
                  { title: "Account No", dataIndex: "account_number" },
                  {
                    title: "Status",
                    dataIndex: "verified",
                    render: (v) => (
                      <Tag color={v ? "green" : "orange"}>
                        {v ? "Approved" : "Pending"}
                      </Tag>
                    ),
                  },
                  {
                    title: "Action",
                    render: (_, record) => (
                      <Space>
                        <Button
                          type="primary"
                          onClick={() =>
                            handleBankStatus(record._id, "Approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          danger
                          onClick={() =>
                            handleBankStatus(record._id, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            ) : (
              <Row gutter={[16, 16]}>
                {banks.map((bank) => (
                  <Col xs={24} key={bank._id}>
                    <Card>
                      <p>
                        <strong>Bank:</strong> {bank.bank_name}
                      </p>
                      <p>
                        <strong>Account Holder:</strong>{" "}
                        {bank.account_holder_name}
                      </p>
                      <p>
                        <strong>Account No:</strong> {bank.account_number}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <Tag color={bank.verified ? "green" : "orange"}>
                          {bank.verified ? "Approved" : "Pending"}
                        </Tag>
                      </p>
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleBankStatus(bank._id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          danger
                          size="small"
                          onClick={() => handleBankStatus(bank._id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
          {
            key: "3",
            label: "Withdrawals",
            children: !isMobile ? (
              <Table
                rowKey="_id"
                dataSource={withdrawals || []}
                columns={[
                  { title: "Amount", dataIndex: "amount" },
                  {
                    title: "Status",
                    dataIndex: "status",
                    render: (s) => (
                      <Tag
                        color={
                          s === "Completed"
                            ? "green"
                            : s === "Pending"
                            ? "orange"
                            : "red"
                        }
                      >
                        {s}
                      </Tag>
                    ),
                  },
                  {
                    title: "Action",
                    render: (_, record) => (
                      <Space>
                        <Button
                          type="primary"
                          onClick={() =>
                            handleWithdrawalStatus(record._id, "Completed")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          danger
                          onClick={() =>
                            handleWithdrawalStatus(record._id, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            ) : (
              <Row gutter={[16, 16]}>
                {(withdrawals || []).map((w) => (
                  <Col xs={24} key={w._id}>
                    <Card>
                      <p>
                        <strong>Amount:</strong> ₹{w.amount}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <Tag
                          color={
                            w.status === "Completed"
                              ? "green"
                              : w.status === "Pending"
                              ? "orange"
                              : "red"
                          }
                        >
                          {w.status}
                        </Tag>
                      </p>
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() =>
                            handleWithdrawalStatus(w._id, "Completed")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          danger
                          size="small"
                          onClick={() =>
                            handleWithdrawalStatus(w._id, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CampaignDetails;
