import mongoose, { Schema } from "mongoose";
import { IPublisher } from "../interfaces/publisher.interface";

const publisherSchema = new Schema<IPublisher>({
    name: {
        type: String,
        required: true
    }
})

export const Publisher = mongoose.model<IPublisher>("Publisher", publisherSchema)