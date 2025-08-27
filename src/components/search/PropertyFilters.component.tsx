import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Button, Col, Row } from 'react-bootstrap';

import { DictionaryBase } from '../../models/commons/dictionary.model';
import { PropertySearchCriteria } from '../../models/properties/property-search-criteria.model';
import React from 'react';
import { getPropertyTypes } from '../../services/dictionaries.service';

interface PropertyFiltersProps {
	onSearch: (criteria: PropertySearchCriteria) => void;
    loading?: boolean;
}

class PropertyFilters extends React.Component<PropertyFiltersProps, {
	typeId: string | '';
	typeOptions: DictionaryBase[];
	address: string;
	priceMin: number | '';
	priceMax: number | '';
}> {
	constructor(props: PropertyFiltersProps) {
		super(props);
		this.state = {
			typeId: '',
			typeOptions: [],
			address: '',
			priceMin: '',
			priceMax: '',
		};
	}

	componentDidMount() {
		getPropertyTypes().then((data) => {
			this.setState({ typeOptions: Array.isArray(data) ? data : [] });
		}).catch((error) => {
			this.setState({ typeOptions: [] })
		});

        this.handleSearch(this.state);
	}

    handleTypeChange = (e: any) => {
		this.setState({ typeId: e.target.value });
	};

	handleAddressChange = (e: any) => {
		this.setState({ address: e.target.value });
	};

	handlePriceMinChange = (e: any) => {
		this.setState({ priceMin: e.target.value === '' ? '' : Number(e.target.value) });
	};

	handlePriceMaxChange = (e: any) => {
		this.setState({ priceMax: e.target.value === '' ? '' : Number(e.target.value) });
	};

	handleSearch = (filter: any) => {
        //console.log(filter);
		this.props.onSearch({
			propertyTypeId: filter.typeId === '' ? undefined : Number(filter.typeId),
			address: filter.address || undefined,
			priceMin: filter.priceMin !== '' ? Number(filter.priceMin) : undefined,
            priceMax: filter.priceMax !== '' ? Number(filter.priceMax) : undefined,
		});
	};

	render() {
		const { typeId, typeOptions, address, priceMin, priceMax } = this.state;
		return (
            <Box className="mt-3">
				<Row className="g-2 align-items-end">
					<Col xs={12} md={4}>
						<TextField
							label="Address"
							value={address}
							onChange={this.handleAddressChange}
							fullWidth
							size="small"
							inputProps={{ 'aria-label': 'Property Address' }}
						/>
					</Col>
                    <Col xs={12} md={4}>
						<FormControl fullWidth size="small" aria-label="Property Type">
							<InputLabel id="type-select-label">Type</InputLabel>
							<Select
								labelId="type-select-label"
								id="type-select"
								value={typeId}
								label="Type"
								onChange={this.handleTypeChange}
								displayEmpty
								inputProps={{ 'aria-label': 'Property Type' }}
							>
								{typeOptions.map(option => (
									<MenuItem key={option.id} value={option.id.toString()} aria-label={option.name}>{option.name}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Col>
					<Col xs={6} md={2}>
						<TextField
							label="Min Price"
							type="number"
							value={priceMin}
							onChange={this.handlePriceMinChange}
							fullWidth
							size="small"
							inputProps={{ 'aria-label': 'Minimum Price' }}
							InputProps={{
								startAdornment: <InputAdornment position="start">$</InputAdornment>,
								inputProps: { min: 0 }
							}}
						/>
					</Col>
					<Col xs={6} md={2}>
						<TextField
							label="Max Price"
							type="number"
							value={priceMax}
							onChange={this.handlePriceMaxChange}
							fullWidth
							size="small"
							inputProps={{ 'aria-label': 'Maximum Price' }}
							InputProps={{
								startAdornment: <InputAdornment position="start">$</InputAdornment>,
								inputProps: { min: 0 }
							}}
						/>
					</Col>
				</Row>
                <Row className='d-flex justify-content-end'>
                    <Col className='pt-2' xs={12} md={2}>
						<Button type="submit" variant="primary" className="w-100" onClick={() => this.handleSearch(this.state)} aria-label="Search Properties" disabled={this.props.loading}>Search</Button>
					</Col>
                </Row>
            </Box>
		);
	}
}

export default PropertyFilters;