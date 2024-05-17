import mongoose, { Schema, Document } from 'mongoose';

export interface RoleDocument extends Document {
    value: {type: String, unique: true, default: 'USER'}
}

const RoleSchema: Schema<RoleDocument> = new Schema ({
    value: {type: String, unique: true, default: 'USER'}
});

const Role = mongoose.model<RoleDocument>('Role', RoleSchema);
export default Role;