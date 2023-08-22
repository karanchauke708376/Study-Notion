// Import The Required module
const express = require("express")
const router = express.Router()

const  { capturePayment , verifyPayment , sendPaymentSuccessEmail} = require("../controllers/Payments")
const  { auth, isInstructor, isStudent, isAdmin} = require("../middleware/Auth")

router.post("/capturePayment"  , auth , isStudent , capturePayment );
router.post("/verifyPayment" , auth , isStudent , verifyPayment );
router.post("/sendPaymentSuccessEmail" , auth , isStudent , sendPaymentSuccessEmail );

module.exports = router 