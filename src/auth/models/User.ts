import mongoose, { Schema, Document } from 'mongoose';

interface UserDocument extends Document {
    email: string;
    password: string;
    roles: string[];
}

export interface IUser extends Omit<UserDocument, 'password'>  {
    id: string;
}

const UserSchema: Schema<UserDocument> = new Schema({
    // username: {type: String, unique: false}, 
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'Role' }]
});


const User = mongoose.model<UserDocument>('User', UserSchema);
export default User;
