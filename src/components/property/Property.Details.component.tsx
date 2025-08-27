import { Button, Modal } from "react-bootstrap";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
} from "@mui/material";

import { PropertyModel } from "../../models/properties/property.model";
import React from "react";
import { SpaceModel } from "../../models/spaces/space.model";

interface PropertyDetailsProps {
    show: boolean;
    onClose: () => void;
    property: PropertyModel | null;
}

interface PropertyDetailsState {
    spaceSortMember: keyof SpaceModel;
    spaceSortDirection: "asc" | "desc";
    spaceFilter: string;
}

export class PropertyDetailsModal extends React.Component<
    PropertyDetailsProps,
    PropertyDetailsState
> {
    constructor(props: PropertyDetailsProps) {
        super(props);
        this.state = {
            spaceSortMember: "description",
            spaceSortDirection: "asc",
            spaceFilter: "",
        };
    }

    handleSort = (member: keyof SpaceModel) => {
        this.setState((prevState) => ({
            spaceSortMember: member,
            spaceSortDirection:
                prevState.spaceSortMember === member && prevState.spaceSortDirection === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ spaceFilter: event.target.value });
    };

    getFilteredAndSortedSpaces(): SpaceModel[] {
        const { property } = this.props;
        const { spaceSortMember, spaceSortDirection, spaceFilter } = this.state;
        if (!property || !property.spaces) return [];

        let filtered = property.spaces;
        if (spaceFilter) {
            filtered = filtered.filter(
                (space) =>
                    space.description?.toLowerCase().includes(spaceFilter.toLowerCase()) ||
                    space.spaceType?.toLowerCase().includes(spaceFilter.toLowerCase())
            );
        }

        filtered = filtered.slice().sort((a, b) => {
            const aValue = a[spaceSortMember];
            const bValue = b[spaceSortMember];
            if (aValue == null) return 1;
            if (bValue == null) return -1;
            if (typeof aValue === "string" && typeof bValue === "string") {
                return spaceSortDirection === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            if (typeof aValue === "number" && typeof bValue === "number") {
                return spaceSortDirection === "asc" ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });

        return filtered;
    }

    render() {
        const { show, onClose, property } = this.props;
        const { spaceSortMember, spaceSortDirection, spaceFilter } = this.state;
        if (!property) return null;

        return (
            <Modal
                show={show}
                onHide={onClose}
                size="lg"
                aria-labelledby="property-details-modal"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="property-details-modal">
                        Property Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h5>{property.address}</h5>
                        <div>Type: {property.typeName}</div>
                        <div>Price: ${property.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <hr />
                    <h6>Spaces</h6>
                    <TextField
                        label="Quick Filter"
                        variant="outlined"
                        size="small"
                        value={spaceFilter}
                        onChange={this.handleFilterChange}
                        aria-label="Space quick filter"
                        style={{ marginBottom: 12 }}
                    />
                    <Table size="small" aria-label="Spaces table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={spaceSortMember === "description"}
                                        direction={spaceSortDirection}
                                        onClick={() => this.handleSort("description")}
                                        aria-label="Sort by Description"
                                    >
                                        Description
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={spaceSortMember === "spaceType"}
                                        direction={spaceSortDirection}
                                        onClick={() => this.handleSort("spaceType")}
                                        aria-label="Sort by Type"
                                    >
                                        Type
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={spaceSortMember === "size"}
                                        direction={spaceSortDirection}
                                        onClick={() => this.handleSort("size")}
                                        aria-label="Sort by Size"
                                    >
                                        Size
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.getFilteredAndSortedSpaces().map((space) => (
                                <TableRow key={space.id}>
                                    <TableCell>{space.description}</TableCell>
                                    <TableCell>{space.spaceType}</TableCell>
                                    <TableCell>{space.size}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        aria-label="Close property details"
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}