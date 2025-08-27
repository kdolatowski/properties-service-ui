import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { PagedResult } from '../../models/search/paged-result.model';
import { PropertyDetailsModal } from '../property/Property.Details.component';
import { PropertyModel } from '../../models/properties/property.model';
import React from 'react';

interface PropertyResultsFilter {
  address?: string;
  typeName?: string;
  minPrice?: number;
  maxPrice?: number;
  sortMember?: string;
  sortDirection?: 'ascending' | 'descending';
}

interface PropertyResultsProps {
  data: PagedResult<PropertyModel>;
  onSortChange?: (filters: PropertyResultsFilter) => void;
  onPageChange?: (page: number, pageSize: number) => void;
}


class PropertyResults extends React.Component<PropertyResultsProps, { sortMember: string; sortDirection: 'asc' | 'desc', rows: { id: number, open: boolean }[], detailsModalOpen: boolean, selectedProperty: PropertyModel | null }> {

  getAveragePrice(): number {
    const { data } = this.props;
    if (!data || !data.results.length) return 0;
    const total = data.results.reduce((sum: number, property: PropertyModel) => sum + property.price, 0);
    return total / data.results.length;
  }

  getTotalSize(propertyId: number): number {
    const { data } = this.props;
    const property = data.results.find((p) => p.id === propertyId);
    return property ? property.spaces.reduce((sum, space) => sum + space.size, 0) : 0;
  }


  constructor(props: PropertyResultsProps) {
    super(props);
    const { data } = props;
    this.state = {
      sortMember: '',
      sortDirection: 'asc',
      rows: data.results.map((item) => ({ id: item.id, open: false })),
      detailsModalOpen: false,
      selectedProperty: null,
    };
  }

  handleExpandRow = (id: number) => {
    const { rows } = this.state;
    this.setState({ rows: rows.map(r => r.id === id ? { ...r, open: !r.open } : r) });
  }

  isRowOpen = (id: number) => {
    const row = this.state.rows.find(r => r.id === id);
    return row ? row.open : false;
  };

  handleSort = (property: string) => {
    const { sortMember: orderBy, sortDirection: order } = this.state;
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    this.setState({ sortMember: property, sortDirection: newOrder });
    if (this.props.onSortChange) {
      this.props.onSortChange({
        sortMember: property,
        sortDirection: newOrder === 'asc' ? 'ascending' : 'descending',
      });
    }
  };

  handleRowClick = (property: PropertyModel, event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    if ((event.target as HTMLElement).closest('button[aria-label="expand row"]')) return;
    this.setState({ detailsModalOpen: true, selectedProperty: property });
  };

  handleCloseDetailsModal = () => {
    this.setState({ detailsModalOpen: false, selectedProperty: null });
  };

  componentDidUpdate(prevProps: PropertyResultsProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        rows: this.props.data.results.map((item) => ({ id: item.id, open: false }))
      });
    }
  }

  render() {
    const { data, onPageChange } = this.props;
    const { sortMember: orderBy, sortDirection: order, detailsModalOpen, selectedProperty } = this.state;
    return (
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer component={Paper} sx={{ mb: 2 }} style={{ height: '70vh' }}>
          <Table aria-label="property results table" size="small">
            <TableHead>
              <TableRow key={`header-${new Date().getTime()}`}>
                <TableCell />
                <TableCell sortDirection={orderBy === 'address' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'address'}
                    direction={orderBy === 'address' ? order : 'asc'}
                    onClick={() => this.handleSort('address')}
                    aria-label="Sort by address"
                  >
                    Address
                  </TableSortLabel>
                </TableCell>
                <TableCell size='small' sortDirection={orderBy === 'typeName' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'typeName'}
                    direction={orderBy === 'typeName' ? order : 'asc'}
                    onClick={() => this.handleSort('typeName')}
                    aria-label="Sort by type"
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center" size='small' sortDirection={orderBy === 'price' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'price'}
                    direction={orderBy === 'price' ? order : 'asc'}
                    onClick={() => this.handleSort('price')}
                    aria-label="Sort by price"
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell align='right' size='small'>Total size (sq. ft)</TableCell>
              </TableRow>
            </TableHead>
        <TableBody>
          {data.results.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                  {row.spaces && row.spaces.length > 0 ? (
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => { this.handleExpandRow(row.id); }}
                    >
                      {this.isRowOpen(row.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  ) : null}
                </TableCell>
                <TableCell
                  scope="row"
                  size='medium'
                  onClick={(e) => this.handleRowClick(row, e)}
                  style={{ cursor: 'pointer' }}
                >
                  {row.address}
                </TableCell>
                <TableCell
                  align="left"
                  size='small'
                  onClick={(e) => this.handleRowClick(row, e)}
                  style={{ cursor: 'pointer' }}
                >
                  {row.typeName}
                </TableCell>
                <TableCell
                  align="left"
                  size='medium'
                  onClick={(e) => this.handleRowClick(row, e)}
                  style={{ cursor: 'pointer' }}
                >
                  {row.description}
                </TableCell>
                <TableCell
                  align="center"
                  size='small'
                  onClick={(e) => this.handleRowClick(row, e)}
                  style={{ cursor: 'pointer' }}
                >
                  ${row.price.toLocaleString()}
                </TableCell>
                <TableCell
                  align="right"
                  size='small'
                  onClick={(e) => this.handleRowClick(row, e)}
                  style={{ cursor: 'pointer' }}
                >
                  {this.getTotalSize(row.id)}
                </TableCell>
              </TableRow>
              {row.spaces && row.spaces.length > 0 && (
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={this.isRowOpen(row.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Spaces
                        </Typography>
                        <Table size="small" aria-label="spaces">
                          <TableHead>
                            <TableRow>
                              <TableCell>Type</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell align="right">Size (sq. ft)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.spaces.map((space) => (
                              <TableRow key={space.id}>
                                <TableCell scope="row">{space.spaceType}</TableCell>
                                <TableCell>{space.description}</TableCell>
                                <TableCell align="right">{space.size}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        <Box>
              <Row className='d-flex justify-content-end'>
                <Col xs={12} md={2} align="right"><strong>Average Price:</strong></Col>
                <Col xs={12} md={1} align="right">${this.getAveragePrice().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
              </Row>
        </Box>
        <TablePagination
          component="div"
          count={data.totalCount}
          page={data.page - 1}
          onPageChange={(_, newPage) => onPageChange && onPageChange(newPage + 1, data.pageSize)}
          rowsPerPage={data.pageSize}
          onRowsPerPageChange={e => onPageChange && onPageChange(data.page, parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          aria-label="pagination"
        />
        <PropertyDetailsModal
          show={detailsModalOpen}
          onClose={this.handleCloseDetailsModal}
          property={selectedProperty}
        />
      </Box>
    );
  }
}

export default PropertyResults;
