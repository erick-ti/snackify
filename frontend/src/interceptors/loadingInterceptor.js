import axios from "axios";

export const setLoadingInterceptor = ({ showLoading, hideLoading }) => {
    // for setting up interceptor request that goes to server
    axios.interceptors.request.use(
        req => { // onResolve
            showLoading();
            return req;
        },
        error => { // if error, hide loading screen
            hideLoading();
            return Promise.reject(error); // new promise(resolve => {}, reject => reject(error))

        }
    );

    axios.interceptors.response.use(
        res => { // no need to load, so hide loading screen
            hideLoading();
            return res;
        },
        error => {
            hideLoading();
            return Promise.reject(error);
        }
     );
};

export default setLoadingInterceptor;