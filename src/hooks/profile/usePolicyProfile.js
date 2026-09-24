import { useQuery } from '@tanstack/react-query';
import { useToast } from '@components/ui/Toast';
import ProfileServices from '@api/services/profileService';
import { API_KEY } from '@constants/apiKey';

// ====================================================== Expired =============================================================

export const useGetMotorExpiredPolicy = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.MOTOR_EXPIRED_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getMotorExpiredPolicy();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetHealthExpiredPolicy = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.HEALTH_EXPIRED_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getHealthExpiredPolicy();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetTravelExpiredPolicy = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.TRAVEL_EXPIRED_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getTravelExpiredPolicy();
        console.log('res', res?.data);

        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetLandExpiredPolicy = () => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.LAND_EXPIRED_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getLandExpiredPolicy();
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

// ====================================================== Cancelled =============================================================

export const useGetMotorCancelledPolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.MOTOR_CANCELLED_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getMotorCancelledPolicy(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetHealthCancelledPolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.HEALTH_CANCELLED_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getHealthCancelledPolicy(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetTravelCancelledPolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.TRAVEL_CANCELLED_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getTravelCancelledPolicy(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

// ===================================================== Expiring =============================================================

export const useGetMotorExpiringPolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.MOTOR_EXPIRING_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getMotorExpiringPolicy(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetHealthExpiringPolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.HEALTH_EXPIRING_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getHealthExpiringPolicy(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetTravelExpiringPolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.TRAVEL_EXPIRING_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getTravelExpiringPolicy(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

// ===================================================== ACTIVE =============================================================

export const useGetMotorActivePolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.MOTOR_ACTIVE_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getMotorActivePolicy(data);
        return res?.data?.data;
      } catch (error) {
        console.log('error motor', error);
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetHealthActivePolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.HEALTH_ACTIVE_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getHealthActivePolicy(data);
        return res?.data?.data;
      } catch (error) {
        console.log('error health', error);
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetTravelActivePolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.TRAVEL_ACTIVE_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getTravelActivePolicy(data);
        return res?.data?.data;
      } catch (error) {
        console.log('error travel', error);
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetLandActivePolicy = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.LAND_ACTIVE_POLICY],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getLandActivePolicy(data);
        return res?.data?.data;
      } catch (error) {
        console.log('error land', error);
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

// ===================================================== DETAILS =============================================================

export const useGetTravelPolicyDetails = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.TRAVEL_EXPIRED_POLICY_DETAILS],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getTravelPolicyDetails(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetHealthPolicyDetails = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.HEALTH_POLICY_DETAILS],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getHealthPolicyDetails(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};

export const useGetMotorPolicyDetails = data => {
  const { showToast } = useToast();

  return useQuery({
    queryKey: [API_KEY.MOTOR_POLICY_DETAILS],
    queryFn: async () => {
      try {
        const res = await ProfileServices.getMotorPolicyDetails(data);
        return res?.data?.data;
      } catch (error) {
        showToast(error?.message, 'error');
      }
    },
    meta: { showLoader: true, showError: false, showLottieLoader: false },
  });
};
