const mongoose = require('mongoose');
const moment = require('moment');
const validate = require('mongoose-validator');
const AssignmentProgress = require('../models/AssignmentProgress');

// const VALID_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AssignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Assignment name is a required field.'],
    validate: [
      validate({
        validator: 'isLength',
        arguments: [1, 100],
        message: 'Assignment name must be between {ARGS[0]} and {ARGS[1]} characters.',
      }),
    ],
  },
  days: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Assignment days is a required field.'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Assignment due date is a required field.'],
    validate: [
      validate({
        validator: dueDate => !moment(dueDate).isBefore(moment(), 'day'),
        message: 'An assignment due date cannot be before today.',
      }),
    ],
  },
  hours: {
    type: Number,
    required: [true, 'Assignment hours is a required field.'],
    validate: [
      validate({
        validator: hours => hours > 0,
        message: 'Assignment hours must be above 0 hours.',
      }),
    ],
  },
  musicSheetAddr: {
    type: String,
    required: [true, 'Assignment music sheet address is a required field.'],
  },
  fileName: {
    type: String,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  emails: {
    type: [String],
    required: [true, 'Assignment emails is a required field.'],
  },
}, { timestamps: true });

/**
 * Adds the student's assignment progress to the assignment for a given student.
 */
AssignmentSchema.methods.getProgress = async function ({ studentId }) {
  let assignmentProgress = await AssignmentProgress.findOne({ student: studentId, assignment: this._id });
  if (!assignmentProgress) {
    assignmentProgress = new AssignmentProgress({ student: studentId, assignment: this._id });
    await assignmentProgress.save();
  }
  return assignmentProgress.progress;
};

// AssignmentSchema.methods.getWithProgress = async function ({ studentId = '', assignmentIds = [''] }) {
//   const [assignment, assignmentProgress] = await Promise.all([
//     this.findById(assignmentId),
//     AssignmentProgress.findOne({ student: studentId, assignment: this._id }),
//   ]);
//   assignment.progress = { days: assignmentProgress.days };
//   return assignment;
// };

module.exports = mongoose.model('Assignment', AssignmentSchema);
