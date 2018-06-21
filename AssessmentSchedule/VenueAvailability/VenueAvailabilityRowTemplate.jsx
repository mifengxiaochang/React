import * as React from 'react';

class VenueAvailabilityRowTemplate extends R.DatagridRow {
    constructor(props) {
        super(props);

    }

    render() {
        var data = this.props.rowData;
        return (
            <div data-part="row">
                <div data-part="cell">{data.venue}</div>
                <div data-part="cell">{data.venueType}</div>
                <div data-part="cell">{data.slot}</div>
                <div data-part="cell">{data.date}</div>
                <div data-part="cell">{data.availabilityIndicator}</div>
                <div data-part="cell">{data.inUseForNextSlot}</div>
            </div>
        )
    }
}

export default VenueAvailabilityRowTemplate;