import '../../styles/property/PropertyModal.scss';

import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { getPropertyTypes, getSpaceTypes } from '../../services/dictionaries.service';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DictionaryBase } from '../../models/commons/dictionary.model';
import { PropertyModel } from '../../models/properties/property.model';
import React from 'react';
import { SpaceModel } from '../../models/spaces/space.model';
import { addProperty } from '../../services/properties.service';

interface PropertyAddModalProps {
  show: boolean;
  onClose: () => void;
}

class PropertyAddModal extends React.Component<PropertyAddModalProps, {
  typeOptions: DictionaryBase[];
  spaceTypeOptions: DictionaryBase[];
  form: PropertyModel;
  errors: any;
}> {
  defaultSpace: SpaceModel = { id: 0, propertyId: 0, description: '', size: 0, typeId: 0 };

  constructor(props: PropertyAddModalProps) {
    super(props);
    this.state = {
      typeOptions: [],
      spaceTypeOptions: [],
      form: {
        id: 0,
        address: '',
        description: '',
        typeName: '',
        typeId: 0,
        price: 0,
        spaces: [ { ...this.defaultSpace } ]
      },
      errors: {},
    };
  }

  componentDidMount() {
    getPropertyTypes().then((data) => {
      this.setState({ typeOptions: Array.isArray(data) ? data : [] });
    });
    
    getSpaceTypes().then((data: any) => {
      this.setState({ spaceTypeOptions: Array.isArray(data) ? data : [] });
    });
  }

  validate = () => {
    const { form } = this.state;
    const errs: any = {};
    if (!form.address) errs.address = 'Address is required';
    if (!form.typeId) errs.typeId = 'Type is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Valid price required';
    // Only validate spaces if there are any
    if (form.spaces.length > 0) {
      form.spaces.forEach((space, idx) => {
        if (!space.description) errs[`spaceDescription${idx}`] = 'Space description required';
        if (!space.size || isNaN(Number(space.size)) || Number(space.size) <= 0) errs[`spaceSize${idx}`] = 'Valid size required';
      });
    }
    this.setState({ errors: errs });
    return Object.keys(errs).length === 0;
  };

  handleChange = (field: string, value: any) => {
    this.setState(prevState => ({
      form: { ...prevState.form, [field]: value }
    }));
  };

  handleSpaceChange = (idx: number, field: keyof SpaceModel, value: any) => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        spaces: prevState.form.spaces.map((space, i) => i === idx ? { ...space, [field]: value } : space)
      }
    }));
  };

  handleAddSpace = () => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        spaces: [ ...prevState.form.spaces, { ...this.defaultSpace } ]
      }
    }));
  };

  handleRemoveSpace = (idx: number) => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        spaces: prevState.form.spaces.filter((_, i) => i !== idx)
      }
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (this.validate()) {
      const { form } = this.state;
      this.handleAddProperty({
        ...form,
        typeId: Number(form.typeId),
        price: Number(form.price),
        spaces: form.spaces.map(s => ({ ...s, size: Number(s.size) }))
      });
    }
  };

  handleAddProperty = (property: any) => {
      addProperty(property).then(data => {
        this.props.onClose();
      })
      .catch(error => {
        console.error('Error adding property:', error);
      });
    };
  render() {
    const { show, onClose } = this.props;
    const { typeOptions, form, errors } = this.state;
    return (
      <Modal show={show} onHide={onClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add New Property</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <TextField
                  label="Address"
                  value={form.address}
                  onChange={e => this.handleChange('address', e.target.value)}
                  error={!!errors.address}
                  helperText={errors.address}
                  fullWidth
                  required
                  inputProps={{ 'aria-label': 'Property Address' }}
                />
              </Col>
              <Col md={6}>
                <FormControl fullWidth required error={!!errors.typeId}>
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    value={form.typeId}
                    label="Type"
                    onChange={e => this.handleChange('typeId', e.target.value)}
                    inputProps={{ 'aria-label': 'Property Type' }}
                  >
                    <MenuItem value=""><em>Select type...</em></MenuItem>
                    {typeOptions.map(option => (
                      <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                  </Select>
                  {errors.typeId && <div className="text-danger small">{errors.typeId}</div>}
                </FormControl>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <TextField
                  label="Description"
                  value={form.description}
                  onChange={e => this.handleChange('description', e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  inputProps={{ 'aria-label': 'Property Description' }}
                />
              </Col>
              <Col md={6}>
                <TextField
                  label="Price"
                  type="number"
                  value={form.price}
                  onChange={e => this.handleChange('price', e.target.value)}
                  error={!!errors.price}
                  helperText={errors.price}
                  fullWidth
                  required
                  inputProps={{ min: 0, 'aria-label': 'Property Price' }}
                />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={10} md={11} className='align-content-center'><strong>Spaces</strong></Col>
              <Col xs={1} md={1}>
                <IconButton aria-label="Add Space" color="primary" onClick={this.handleAddSpace}>
                      <AddIcon />
                </IconButton>
              </Col>
            </Row>
            <Box className="property-modal-spaces">
            {form.spaces.map((space, idx) => (
              <Row
                key={idx}
                className="mb-2 align-items-center"
                style={{ marginTop: '10px' }} // Add 3px margin between each row
              >
                <Col md={4}>
                  <TextField
                    label="Space Description"
                    value={space.description}
                    onChange={e => this.handleSpaceChange(idx, 'description', e.target.value)}
                    error={!!errors[`spaceDescription${idx}`]}
                    helperText={errors[`spaceDescription${idx}`]}
                    fullWidth
                    required
                    inputProps={{ 'aria-label': `Space Description ${idx + 1}` }}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    label="Size (sq ft)"
                    type="number"
                    value={space.size}
                    onChange={e => this.handleSpaceChange(idx, 'size', e.target.value)}
                    error={!!errors[`spaceSize${idx}`]}
                    helperText={errors[`spaceSize${idx}`]}
                    fullWidth
                    required
                    inputProps={{ min: 0, 'aria-label': `Space Size ${idx + 1}` }}
                  />
                </Col>
                <Col md={3}>
                  <FormControl fullWidth required>
                    <InputLabel id={`space-type-select-label-${idx}`}>Space Type</InputLabel>
                    <Select
                      labelId={`space-type-select-label-${idx}`}
                      value={space.typeId}
                      label="Space Type"
                      onChange={e => this.handleSpaceChange(idx, 'typeId', e.target.value)}
                      inputProps={{ 'aria-label': `Space Type ${idx + 1}` }}
                    >
                      <MenuItem value=""><em>Select type...</em></MenuItem>
                      {this.state.spaceTypeOptions.map(option => (
                        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
                <Col md={2} className="d-flex align-items-center">
                  <IconButton aria-label="Remove Space" color="error" onClick={() => this.handleRemoveSpace(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Col>
              </Row>
            ))}
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose} aria-label="Cancel Add Property">
              Cancel
            </Button>
            <Button variant="primary" type="submit" aria-label="Save Property">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default PropertyAddModal;
