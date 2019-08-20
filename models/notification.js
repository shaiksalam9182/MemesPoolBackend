const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    notification_id: String,
    title:String,
    description:String,
    image:String,
    sent_by:String,
    send_to:String
},{
    timestamps:true
})

module.exports = mongoose.model('Notifications',notificationSchema);