import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import '../assets/css/modal.css';
import backgroundImg from '../assets/images/contact_form/contact_form.jpeg';
import { useAuth } from '../context/AuthContext'; // Import context
import { useLoader } from "../context/LoaderContext";
import { motion, AnimatePresence } from "framer-motion";
const now = new Date();
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const LoginModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();
  const [selectedDateTime, setSelectedDateTime] = useState(startOfToday);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const recaptchaRef = useRef();
  const { login } = useAuth();
  const { setIsLoading } = useLoader();
  const [selectedRole, setSelectedRole] = useState("Contractor");

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    message: '',
    address: '',
    dateTime: null,
    captchaValue: '',
  };

  const validationSchema = Yup.object({
    // name: Yup.string().required('Name is required'),
    email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required'),

    // phone: Yup.string().required('Phone number is required'),
    // message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters long'),
    // address: Yup.string().required('Address is required'),
    // dateTime: Yup.date().required('Please select a date and time').min(startOfToday, 'Date must be today or later'),
    captchaValue: Yup.string().required('Please complete the reCAPTCHA'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    let data
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...values, 
          dateTime: selectedDateTime,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });
      data = await response.json();
      if (response.ok) {
        // alertify.success('User login successful!');
  
        login(data.user, data.token); // ✅ Call context login to set user globally
        resetForm();
        recaptchaRef.current.reset();
        closeModal();
        setTimeout(() => {
          setIsLoading(false);
          closeModal();
          navigate("/dashboard");
        }, 100);
      } else {
        alertify.error('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      alertify.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          // alertify.error('Unable to access your location. Falling back to IP-based location.');
          // fetchIPBasedLocation();
        }
      );
    } else {
      fetchIPBasedLocation();
    }
  };

  const fetchIPBasedLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (error) {
      // alertify.error('Unable to fetch location based on IP address.');
    }
  };

  // useEffect(() => {
  //   fetchLocation();
  // }, []);

  return (
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} // smoother easeOutExpo
      className="bg-white/10 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black/50" // darker backdrop
    >
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gray-500/20  rounded-2xl shadow-2xl p-6 w-full max-w-md modal-content"
    >
          <button className="close-modal" onClick={closeModal}>
            &times;
          </button>
          <h2 className="modal-title">Sign In</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
              <div className=" p-6 rounded-xl space-y-6 ">
                
                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email" className="block text-sm font-large text-gray-900">Email</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-300 text-sm mt-1" />
                </div>
            
                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password" className="block text-sm font-large text-gray-900">Password</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    className="w-full rounded-md px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-300 text-sm mt-1" />
                </div>
            
                {/* ReCAPTCHA */}
                <div className="form-group">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={(value) => setFieldValue('captchaValue', value)}
                  />
                  <ErrorMessage name="captchaValue" component="div" className="text-red-300 text-sm mt-1" />
                </div>
            

                <div className="w-full max-w-xs mx-auto mb-6">
  {/* Label */}
  <AnimatePresence mode="wait">
    <motion.div
      key={selectedRole}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
      className="text-center text-gray-500 font-semibold text-sm mb-3"
    >
      Signing in as: <span className="text-cyan-400">{selectedRole}</span>
    </motion.div>
  </AnimatePresence>

  {/* Toggle Buttons */}
  <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-full p-1 flex justify-between">
    {["Contractor", "Admin", "Real Estate"].map((role, i) => (
      <button
        key={role}
        onClick={() => setSelectedRole(role)}
        className="relative z-10 flex-1 text-sm font-medium text-white py-2 transition-all"
      >
        {role}
      </button>
    ))}

    {/* Animated Slider */}
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-1 bottom-1 w-1/3 rounded-full bg-cyan-600 z-0"
      style={{
        left: ["Contractor", "Admin", "Real Estate"].indexOf(selectedRole) * 33.3333 + "%",
      }}
    />
  </div>
</div>


                                {/* Submit Button */}
                <button
                type="submit"
                disabled={isSubmitting}
                className={` w-full group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all duration-100
                  ${
                    isSubmitting
                      ? "bg-white/30 text-white cursor-not-allowed border-white/20"
                      : "bg-cyan-600 text-white border-neutral-200 hover:bg-cyan-700"
                  }
                  [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]`}
              >
                {isSubmitting ? "Submitting..." : "Sign In"}
              </button>
              </div>
            </Form>
            
            )}
          </Formik>
          </motion.div>
      </motion.div>
        )}
</AnimatePresence>
  );
};

export default LoginModal;
