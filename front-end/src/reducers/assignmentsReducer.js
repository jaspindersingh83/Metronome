import {
  GET_ASSIGNMENTS,
  ADD_ASSIGNMENT,
  DELETE_ASSIGNMENT,
  GET_STUDENT_LIST,
} from '../actions';

export default (assignments = [], action) => {
  switch (action.type) {
    case GET_ASSIGNMENTS:
      return assignments;
    case ADD_ASSIGNMENT:
      return [...assignments, action.payload];
    case DELETE_ASSIGNMENT: {
      const id = action.payload;
      return [...assignments.slice (0, id), ...assignments.slice (id + 1)];
    }
    case GET_STUDENT_LIST: {
      console.log('fired from TA');
      const assignmentName = action.payload;
      return assignments;
    }

    default:
      return assignments;
  }
};
