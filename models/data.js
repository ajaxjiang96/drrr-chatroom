let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    messages: {
        type: [String],
        required: true,
        default: []
    },
}, {
    collection: 'users'
});

let messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    }
}, {
    collection: 'messages'
});

mongoose.connect('mongodb://ajax:drrr@ds151059.mlab.com:51059/drrr-chatroom');

let schema = {
    'User': mongoose.model('User', userSchema),
    'Message': mongoose.model('Message', messageSchema)
};
module.exports = schema;
