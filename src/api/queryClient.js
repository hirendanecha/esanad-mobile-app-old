import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      meta: { showLoader: false, showError: false, showLottieLoader: false },
    },
    mutations: {
      onError: (error, _variables, _context, mutation) => {
        if (mutation?.meta?.showError !== false) {
          // console.log(error);
        }
      },
      meta: { showLoader: false, showError: false, showLottieLoader: false },
    },
  },
});
