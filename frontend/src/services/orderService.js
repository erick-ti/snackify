 import axios from 'axios';

 export const createOrder = async order => { // gets 'order' passed from checkout page 
    try {
        const { data } = await axios.post('/api/orders/create', order); // sends data to pathway
        return data;
    } catch (error) {}
 };

 export const getNewOrderForCurrentUser = async () => {
    const { data } = await axios.get('/api/orders/newOrderForCurrentUser');
    return data;
 };

 export const pay = async paymentId => {
    try {
        // gets data (new order) id for current user
        const { data } = await axios.put('/api/orders/pay', { paymentId }); // passes paymentId to server
        return data; // returns new order id
    } catch (error) {}
 };

 export const trackOrderById = async orderId => {
   const { data } = await axios.get('/api/orders/track/' + orderId);
   return data;
 }

 export const getAll = async state => {
   // if state is not null, pass it to server, otherwise pass empty text to server (show all orders)
   const { data } = await axios.get(`/api/orders/${state ?? ''}`);
   return data; // orders coming from server
 };

 export const getAllStatus = async () => {
   const { data } = await axios.get('/api/orders/allstatus');
   return data;
 }