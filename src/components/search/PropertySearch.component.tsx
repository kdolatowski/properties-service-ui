import '../../styles/search/PropertySearch.scss';

import React, { useState } from 'react';

import { Box } from '@mui/material';
import { PagedResult } from '../../models/search/paged-result.model';
import PropertyFilters from './PropertyFilters.component';
import { PropertyModel } from '../../models/properties/property.model';
import PropertyResults from './PropertyResults.component';
import { PropertySearchCriteria } from '../../models/properties/property-search-criteria.model';
import { getProperties } from '../../services/properties.service';

const PropertySearch: React.FC = () => {
  const [criteria, setCriteria] = useState<PropertySearchCriteria>({});
  const [results, setResults] = useState<PagedResult<PropertyModel>>({ results: [], page: 1, pageSize: 10, totalCount: 0, pagesCount: 0 });
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchCriteria: PropertySearchCriteria) => {
    setCriteria(searchCriteria);
    fetchResults(searchCriteria, 1, results.pageSize);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchResults(criteria, page, pageSize);
  };

  const handleSortChange = (sortCriteria: { sortMember?: string; sortDirection?: 'ascending' | 'descending' }) => {
    fetchResults(criteria, results.page, results.pageSize, sortCriteria);
  };

  const fetchResults = async (searchCriteria: PropertySearchCriteria, page: number, pageSize: number, sortCriteria?: { sortMember?: string; sortDirection?: 'ascending' | 'descending' }) => {
    setLoading(true);
    const query = {
        ...searchCriteria,
        page,
        pageSize,
        ...sortCriteria,
    };
    getProperties(query).then(res => {
        setResults(res);
    })
    .catch(error => {
        setResults({ results: [], page, pageSize, totalCount: 0, pagesCount: 0 });
    })
    .finally(() => {
        setLoading(false);
    });

  };

  return (
    <Box className="d-flex row" sx={{ p: 2 }}>
      <PropertyFilters onSearch={handleSearch} loading={loading} />
      <PropertyResults
        data={results}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </Box>
  );
};

export default PropertySearch;
