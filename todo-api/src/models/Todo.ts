import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  body: string;
  isCompleted: boolean;
  createDate: Date;
  completeDate?: Date;
  updatedDate: Date;
  priority: 'low' | 'medium' | 'high';
}

const TodoSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  body: {
    type: String,
    required: [true, 'Body is required'],
    trim: true,
    maxlength: [1000, 'Body cannot exceed 1000 characters']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createDate: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  completeDate: {
    type: Date,
    default: null
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

// Update the updatedDate before saving
TodoSchema.pre('save', function() {
  this.updatedDate = new Date();
});

// Set completeDate when isCompleted is set to true
TodoSchema.pre('save', function() {
  if (this.isCompleted && !this.completeDate) {
    this.completeDate = new Date();
  } else if (!this.isCompleted) {
    this.completeDate = undefined;
  }
});

export default mongoose.model<ITodo>('Todo', TodoSchema);
