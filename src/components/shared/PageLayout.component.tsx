import { Button, Container, Nav, Navbar } from 'react-bootstrap';

import AddIcon from '@mui/icons-material/Add';
import PropertyAddModal from '../property/PropertyAdd.component';
import PropertySearch from '../search/PropertySearch.component';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { apiService } from '../../services/api-service';

interface PageLayoutProps {
    children?: React.ReactNode;
}

interface PageLayoutState {
    showSearch: boolean;
    showAddModal: boolean;
}

class PageLayout extends React.Component<PageLayoutProps, PageLayoutState> {
    constructor(props: PageLayoutProps) {
        super(props);
        this.state = {
            showSearch: true,
            showAddModal: false,
        };
    }

    handleSearchClick = () => {
        this.setState({ showSearch: true });
    };

    handleAddClick = () => {
        this.setState({ showAddModal: true });
    };

    handleAddModalClose = () => {
        this.setState({ showAddModal: false });
    };

    render() {
        const { children } = this.props;
        const { showSearch, showAddModal } = this.state;
        return (
            <Container fluid className="d-flex flex-column min-vh-100 p-0" style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
                {/* Navigation Bar */}
                <Navbar bg="primary" variant='dark' expand="lg" className="shadow-sm pl-15">
                    <Container>
                        <Navbar.Brand href="#home">Property Service</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                {/* Add more nav links here if needed */}
                            </Nav>
                            <div className="d-flex align-items-center flex-wrap gap-2">
                                <Button variant="outline-light" onClick={this.handleSearchClick} aria-label="Show Property Search">
                                    <SearchIcon style={{ marginRight: 4 }} />
                                    Search
                                </Button>
                                <Button variant="outline-light" onClick={this.handleAddClick} aria-label="Add Property">
                                    <AddIcon style={{ marginRight: 4 }} />
                                    Add
                                </Button>
                            </div>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                {/* Main Section */}
                <Container as="main" fluid className="d-flex align-items-center justify-content-center">
                    <div className="d-flex">
                        {showSearch ? <PropertySearch /> : children}
                    </div>
                </Container>

                {/* Property Add Modal */}
                <PropertyAddModal
                    show={showAddModal}
                    onClose={this.handleAddModalClose}
                />

                {/* Footer */}
                <footer className="bg-light text-center py-3 mt-auto shadow-sm">
                    <Container>
                        <span>&copy; {new Date().getFullYear()} Property service. All rights reserved.</span>
                    </Container>
                </footer>
            </Container>
        );
    }
}

export default PageLayout;