import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Grid, Checkbox, Button } from 'material-ui';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import { addAssignment } from '../../../../../actions';
import './assignment-form.css';

axios.defaults.withCredentials = true;

class AssignmentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      days: {},
      hours: '',
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      dueDate: '',
      date: moment(),
      musicSheetAddr: '',
      email: '',
      fileName: '',
      disabled: false,
      preview: null,
    };
  }

  // Changes state of items that are handled
  handleStateDataChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // Handles the unchecking and checking of days to practice
  // adds or takes away from array based on state of checked
  // this is what gets passed up to assignments
  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.checked,
    });
    if (event.target.checked) {
      this.setState({
        days: { ...this.state.days, [name]: false },
      });
    }
  };

  //	handles date of the date picker

  handledDateChange = (date) => {
    const dueDate = date.format('l');

    this.setState({
      dueDate,
      date,
    });
  };

  // This is for handling filed upload
  // TODO: Need to make sure this works with server figure out how to send data
  onDrop = (files) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    axios
      .post('/api/teacher/getUploadUrl', formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const { fileName, musicSheetAddr } = response.data;
        this.notify('File Uploaded');
        this.setState({
          preview: files[0].preview,
          fileName,
          musicSheetAddr,
          disabled: true,
        });
      })
      .catch(err => console.log(err));
  };

  notify = (message) => {
    toast.info(message, { position: toast.POSITION.TOP_LEFT });
  }

  addAssignment = () => {
    // emails, name, days, dueDate, hours, musicSheetAddr;
    const {
      email,
      name,
      days,
      dueDate,
      hours,
      musicSheetAddr,
      fileName,
    } = this.state;

    const emails = email.split(',');
    const assignment = {
      emails,
      name,
      days,
      dueDate,
      hours,
      musicSheetAddr,
      fileName,
    };
    this.props.addAssignment(assignment);
    if (!this.state.name || !this.state.email || !this.state.hours || !this.state.musicSheetAddr || !this.state.fileName) {
      return;
    }
    this.notify('Assignment Made');

    this.setState({
      name: '',
      days: {},
      hours: '',
      fileName: '',
      musicSheetAddr: '',
      email: '',
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      preview: null,
    });
  };

  makePayment = () => {
    window.location.href = '/dashboard/billing';
  };

  render() {
    const { preview } = this.state;
    const { isSubscribe } = jwtDecode(window.localStorage.getItem('token'));

    return (
      <div>
        <div className="assignment-form-container">
          <div style={{ margin: 40 }}>
            <Grid container spacing={0} align="center">
              <Grid item xs={12}>
                <fieldset disabled={!isSubscribe}>
                  <input
                    className="title"
                    placeholder="Assignment Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleStateDataChange}
                  />
                  <Grid container spacing={0} justify="center">
                    <Grid item xs={16}>
                      <Checkbox
                        className="daysToPractice"
                        checked={this.state.Sunday}
                        onChange={this.handleChange('Sunday')}
                        value="checkedSunday"
                      />
                      <label htmlFor="checkedSunday">Sunday</label>
                      <Checkbox
                        className="daysToPractice"
                        checked={this.state.Monday}
                        onChange={this.handleChange('Monday')}
                        value="checkedMonday"
                      />
                      <label htmlFor="checkedMonday">Monday</label>
                      <Checkbox
                        className="daysToPractice"
                        checked={this.state.Tuesday}
                        onChange={this.handleChange('Tuesday')}
                        value="checkedTuesday"
                      />
                      <label htmlFor="checkedTuesday">Tuesday</label>
                      <Checkbox
                        className="daysToPractice"
                        checked={this.state.Wednesday}
                        onChange={this.handleChange('Wednesday')}
                        value="checkedWednesday"
                      />
                      <label htmlFor="checkedWednesday">Wednesday</label>
                      <Checkbox
                        className="daysToPractice"
                        checked={this.state.Thursday}
                        onChange={this.handleChange('Thursday')}
                        value="checkedThursday"
                      />
                      <label htmlFor="checkedThursday">Thursday</label>
                      <Checkbox
                        className="daysToPractice"
                        checked={this.state.Friday}
                        onChange={this.handleChange('Friday')}
                        value="checkedFriday"
                      />
                      <label htmlFor="checkedFriday">Friday</label>
                      <Checkbox
                        className="daysToPractice"
                        checked={this.state.Saturday}
                        onChange={this.handleChange('Saturday')}
                        value="checkedSaturday"
                      />
                      <label htmlFor="checkedSaturday">Saturday</label>
                    </Grid>
                  </Grid>
                  <Grid container justify="center">
                    <Grid item />
                    <div className="hours-container">
                      <input
                        className="hours"
                        name="hours"
                        type="text"
                        placeholder="0"
                        value={this.state.hours}
                        onChange={this.handleStateDataChange}
                      />

                    </div>
                    <label htmlFor="hours">hrs</label>
                    <div className="date-container">

                      <label htmlFor="due date">Due Date:</label>
                      <DatePicker
                        selected={this.state.date}
                        onChange={this.handledDateChange}
                      />
                    </div>
                    <Grid item>
                      <div className="fileupload-container">
                        <Dropzone
                          disabled={this.state.disabled}
                          accept="image/*"
                          multiple={false}
                          onDrop={this.onDrop}
                          size={150}
                        >
                        Upload sheet music here!

                        </Dropzone>
                        <ToastContainer autoClose={3000} />
                        <div className="image-preview">
                          {preview &&
                          <img
                            className="image-preview"
                            src={preview}
                            alt="sheet music"
                          />}
                        </div>
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container justify="center">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleStateDataChange}
                    />
                  </Grid>
                </fieldset>
                <div className="button-container">
                  <Grid item>
                    {isSubscribe ?
                      <Button variant="raised" onClick={this.addAssignment}>
                        Submit
                      </Button> :
                      <Button variant="raised" onClick={this.makePayment}>
                        Activate
                      </Button>
                    }
                  </Grid>
                  <Grid item>
                    <Button
                      variant="raised"
                      onClick={() => this.props.history.push('/dashboard/assignments')}
                    >
                      Assignments
                    </Button>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

AssignmentForm.propTypes = {
  addAssignment: PropTypes.func.isRequired,
};

export default connect(null, { addAssignment })(AssignmentForm);
