import Razorpay from 'razorpay';
import dotenv from 'dotenv'

dotenv.config()

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// // export { instance };
export default instance;

// import Razorpay from 'razorpay';
// import dotenv from 'dotenv';

// // Load environment variables from .env file
// dotenv.config();

// const key_id = process.env.RAZORPAY_KEY_ID;
// const key_secret = process.env.RAZORPAY_KEY_SECRET;

// if (!key_id || !key_secret) {
//     throw new Error('Both `key_id` and `key_secret` are mandatory');
// }

// const instance = new Razorpay({
//     key_id,
//     key_secret,
// });

// export default instance;
