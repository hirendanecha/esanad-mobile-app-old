import MotorClaimService from '@api/services/MotorClaimService';
import { useToast } from '@components/ui/Toast';
import { useMutation } from '@tanstack/react-query';

export function useGetGarageList() {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async body => await MotorClaimService.getGarageList(body),
        onSuccess: res => {
            const { data } = res?.data;
            return data;
        },
        onError: error => {
            showToast(error?.response?.data?.message || error?.message || 'Failed to fetch garage list', 'error');
        },
        meta: { showLoader: true, showError: false, showLottieLoader: false },
    });
}

export function useFinalClaimSubmit() {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async body => await MotorClaimService.finalClaimSubmit(body),
        onSuccess: res => {
            const { data } = res?.data;
            return data;
        },
        onError: error => {
            showToast(error?.response?.data?.message || error?.message || 'Failed to submit claim', 'error');
        },
        meta: { showLoader: true, showError: false, showLottieLoader: false },
    });
}

export function useVerifyCarRegistration() {
    const { showToast } = useToast();
    return useMutation({
        mutationFn: async body => await MotorClaimService.verifyCarRegistration(body),
        onSuccess: res => {
            const { data } = res?.data;
            return data;
        },
        onError: error => showToast(error?.response?.data?.message || error?.message || 'Verification failed', 'error'),
        meta: { showLoader: true, showError: false, showLottieLoader: false },
    });
}

export function useVerifyDrivingLicense() {
    const { showToast } = useToast();
    return useMutation({
        mutationFn: async body => await MotorClaimService.verifyDrivingLicense(body),
        onSuccess: res => {
            const { data } = res?.data;
            return data;
        },
        onError: error => showToast(error?.response?.data?.message || error?.message || 'Verification failed', 'error'),
        meta: { showLoader: true, showError: false, showLottieLoader: false },
    });
}

export function useVerifyEmiratesId() {
    const { showToast } = useToast();
    return useMutation({
        mutationFn: async body => await MotorClaimService.verifyEmiratesId(body),
        onSuccess: res => {
            const { data } = res?.data;
            return data;
        },
        onError: error => showToast(error?.response?.data?.message || error?.message || 'Verification failed', 'error'),
        meta: { showLoader: true, showError: false, showLottieLoader: false },
    });
}

export function useVerifyPoliceReport() {
    const { showToast } = useToast();
    return useMutation({
        mutationFn: async body => await MotorClaimService.verifyPoliceReport(body),
        onSuccess: res => {
            const { data } = res?.data;
            return data;
        },
        onError: error => showToast(error?.response?.data?.message || error?.message || 'Verification failed', 'error'),
        meta: { showLoader: true, showError: false, showLottieLoader: false },
    });
}

export function useExtractEmiratesId() {
    const { showToast } = useToast();
    return useMutation({
        mutationFn: async body => await MotorClaimService.extractEmiratesId(body),
        onSuccess: res => {
            const { data } = res?.data;
            return data;
        },
        onError: error => showToast(error?.response?.data?.message || error?.message || 'Emirates ID extraction failed', 'error'),
        meta: { showLoader: true, showError: false, showLottieLoader: false },
    });
}

export function useExtractDrivingLicense() {
    const { showToast } = useToast();
    return useMutation({
        mutationFn: async body => await MotorClaimService.extractDrivingLicense(body),
        onSuccess: res => {
            const { data } = res?.data;
            return data;
        },
        onError: error => showToast(error?.response?.data?.message || error?.message || 'Driving License extraction failed', 'error'),
        meta: { showLoader: true, showError: false, showLottieLoader: false },
    });
}

export function useExtractPoliceReport() {
    const { showToast } = useToast();
    return useMutation({
        mutationFn: async body => await MotorClaimService.extractPoliceReport(body),
        onSuccess: res => {
            const { data } = res?.data;
            return data;
        },
        onError: error => showToast(error?.response?.data?.message || error?.message || 'Police Report extraction failed', 'error'),
        meta: { showLoader: true, showError: false, showLottieLoader: false },
    });
}
