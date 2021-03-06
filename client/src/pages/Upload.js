import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Header,
  Message,
  Dimmer,
  Loader
} from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Modal from '../components/AlertModal';

import API from '../utils/API';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      status: null,
      error: null,
      openModal: false,
      instanceId: ''
    };
  }

  onDrop = files => {
    this.setState({
      file: files[0],
      status: 'ready'
    });
  };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  isDisabled = () => {
    if (this.state.status === 'loading' || this.state.status === null) {
      return true;
    } else if (this.state.status === 'ready') {
      return false;
    }
  };

  handleModalClose = () => {
    this.setState({
      openModal: false
    });
  };

  handleClick = event => {
    event.preventDefault();
    this.setState({ status: 'loading', instanceId: '' });
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('userId', localStorage.getItem('fbuid'));
    API.createInstance(formData)
      .then(response => {
        console.log(response);
        this.setState({ file: null, status: null });
        if (response.status === 202) {
          this.setState({
            instanceId: response.data.id,
            openModal: true,
            status: null
          });
        }
      })
      .catch(error =>
        this.setState({
          error
        })
      );
  };

  render() {
    console.log(this.props);
    const dropzoneStyle = {
      margin: '15px auto 15px auto',
      width: '100%',
      height: '400px',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    return (
      <div className="upload-form" style={{ marginTop: '5em' }}>
        <Modal
          isOpen={this.state.openModal}
          instanceId={this.state.instanceId}
          handleClose={this.handleModalClose}
        />

        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="blue" textAlign="center">
              Facebook Ads Previewer
            </Header>
            {this.state.error ? <Message>{this.state.error}</Message> : ''}
            <Dropzone
              style={dropzoneStyle}
              activeStyle={{ ...dropzoneStyle, borderColor: '#2185d0' }}
              accept="text/csv, text/txt, application/vnd.ms-excel, text/x-csv, text/plain"
              onDrop={this.onDrop}
            >
              {this.state.status === 'loading' ? (
                <Dimmer active inverted>
                  <Loader />
                </Dimmer>
              ) : (
                <div>
                  <p style={{ marginTop: '100px' }}>
                    Start by dropping some files here, or click to select files
                    to upload.
                  </p>
                  <p>.csv, .txt, and .tsv files are accepted</p>
                  {this.state.file ? (
                    <p>
                      <strong>File to parse: </strong>
                      {this.state.file.name}
                    </p>
                  ) : (
                    <p />
                  )}
                </div>
              )}
            </Dropzone>
            <Button
              fluid
              color="blue"
              type="submit"
              onClick={this.handleClick}
              disabled={this.isDisabled()}
            >
              Upload
            </Button>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  console.log(state);
  return {
    authentication
  };
}

const connectedUpload = connect(mapStateToProps)(Upload);
export { connectedUpload as Upload };
