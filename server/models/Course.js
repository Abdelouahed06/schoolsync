const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  type: { type: String, enum: ['pdf', 'video', 'link'], required: true },
  sourceType: { type: String, enum: ['local', 'url'], required: true },
  path: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        if (this.sourceType === 'url') return /^(https?:\/\/)/.test(v);
        if (this.sourceType === 'local') return v.startsWith('/uploads/');
        return true;
      },
      message: 'Invalid path for resource type'
    }
  },
  name: { type: String, required: true },
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  resources: [resourceSchema],
});

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sections: [sectionSchema],
});

const courseSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }],
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  name: { type: String, required: true },
  description: { type: String },
  modules: [moduleSchema],
}, { timestamps: true });

courseSchema.index({ teacherId: 1 });
courseSchema.index({ classIds: 1 });

module.exports = mongoose.model('Course', courseSchema);