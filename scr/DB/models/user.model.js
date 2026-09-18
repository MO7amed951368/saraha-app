import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 40,
        lowercase: true,
        trim: true
    },

    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 40,
        lowercase: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        index: { name: 'idx-email-unique', unique: true },
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        // set: (value) => {
        //     const newValue = `${value}#${value.length}`
        //     return newValue
        // }
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: 'other',
        required: true,
    },
    age: {
        type: Number,
        required: true,
        max: 50,
        min: [18, 'age must be at least 18 years']
    },  phoneNumber: {
        type: String,
        required: true,
        unique: true
    }

}, {
    virtuals: {
        fullname: {
            get() {
                return `${this.firstname} _ ${this.lastname}`
            }
        }

    },
    // Convert `doc` to a POJO, with virtuals attached
    // toObject: { virtuals: true },

    // Equivalent:
    toJSON: { virtuals: true },
    timestamps: true


})

const User = new mongoose.model('User', userSchema)
export default User

