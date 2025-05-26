import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import { useSentOtpMutation, useVerifyOtpMutation } from "../redux/services/campaignApi";

const LoginModel = ({ open, onClose }) => {
  const [stepCount, setStepCount] = useState(null);
  const [sendOtp, { isLoading: sendOtpLoading, isSuccess, reset }] =
    useSentOtpMutation();

  const [
    verifyOtp,
    {
      data,
      isLoading: verifyOtpLoading,
      isSuccess: verifyOtpSuccess,
      reset: verifyOtpReset,
      error: verifyOtpError,
    },
  ] = useVerifyOtpMutation();

  function removeCountryCode(phoneNumber) {
    const cleanedNumber = phoneNumber.replace(/^\+\d{1,2}/, "");
    return cleanedNumber;
  }

  useEffect(() => {
    if (isSuccess) {
      setStepCount(1);
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (verifyOtpSuccess) {
      if (typeof window !== 'undefined') {
        localStorage?.setItem("authToken", data?.token);
      }
      onClose();
    }
  }, [verifyOtpSuccess, data?.token, onClose]);

  const phoneForm = useFormik({
    initialValues: {
      mobile_number: "",
    },
    onSubmit: async (values) => {
      const { mobile_number } = values;
      await sendOtp({
        mobile_number: removeCountryCode(mobile_number),
      });
    },
  });

  const otpForm = useFormik({
    initialValues: {
      otp: "",
    },
    onSubmit: async (values) => {
      const { otp } = values;
      await verifyOtp({
        otp,
        mobile_number: removeCountryCode(phoneForm.values?.mobile_number),
      });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} >
      <DialogTitle>
        {stepCount ? (
          <>
            Verify OTP
            <br />
            <p className="text-sm font-thin pt-2">
              Sent to {phoneForm.values?.mobile_number}
            </p>
          </>
        ) : (
          "Start to Donate"
        )}
      </DialogTitle>
      <DialogContent>
        <div className="flex w-full justify-center items-center space-x-2">
          {stepCount ? (
            <CaptureOtp form={otpForm} />
          ) : (
            <CapturePhoneNumber form={phoneForm} />
          )}
        </div>

        {!stepCount && (
          <div className="w-full text-xs text-center text-gray-400">
            Enter 10 digit number to login your account
          </div>
        )}

        {verifyOtpError && (
          <div className="w-full text-xs text-center text-red-500">
            {verifyOtpError?.data?.error}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        {stepCount ? (
          <Button
            type="button"
            onClick={() => otpForm.handleSubmit()}
            variant="contained"
            color="secondary"
          >
            {verifyOtpLoading ? <CircularProgress size={16} /> : "Verify"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => phoneForm.handleSubmit()}
            variant="contained"
            color="secondary"
            className="w-full"
          >
            {sendOtpLoading ? <CircularProgress size={16} /> : "Submit"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LoginModel;

const CapturePhoneNumber = ({ form }) => {
  return (
    <PhoneInput
      defaultCountry="IN"
      value={form.values?.mobile_number}
      onChange={(value) => form.setFieldValue("mobile_number", value)}
      className="w-[100vw] md:w-[400px]"
      placeholder={"Phone Number"}
    />
  );
};

const CaptureOtp = ({ form }) => {
  return (
    <div className="flex space-x-2">
      {[...Array(6)].map((_, index) => (
        <TextField
          key={index}
          variant="outlined"
          inputProps={{ maxLength: 1 }}
          onChange={(e) => {
            const { value } = e.target;
            if (/^\d$/.test(value)) {
              const otpArray = form.values.otp.split('');
              otpArray[index] = value;
              form.setFieldValue('otp', otpArray.join(''));
              if (value !== '' && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
              }
            }
          }}
          value={form.values.otp[index] || ''}
          id={`otp-${index}`}
          style={{ width: '2.5rem', textAlign: 'center' ,padding:"2px" }}
        />
      ))}
    </div>
  );
};
