import * as React from 'react';
import * as Service from '../Service/AssessmentSheduleService'
import VenueAvailabilityRowTemplate from './VenueAvailabilityRowTemplate'

const funcs = [
    'setInitData',
    'getValueCollectionFromResponse',
    'setDateFilters',
    'setSlotFilters',
    'setVenueFilters',
    'setVenueTypeFilters',
    'initVenues',
    'initAvailabilityVenues',
    'getRequestDataForInitialization',
    'getRequestData',
    'getColumns',
    'handleDataChanged',
    'handleSelectedPageChanged',
    'substitutionFunc',
    'getSelectedNameCollection',
    'dateFiltersChanged',
    'slotFiltersChanged',
    'venueFiltersChanged',
    'venueTypeFiltersChanged',
    'searchBoxSearchHandler',
    'searchBoxStopHandler',
    'getFilterDateRequestData',
    'getFilterSlotRequestData',
    'getFilterVenueRequestData',
    'getFilterVenueTypeRequestData',
    'getSearchRequestData',
    'getPageRequestData',

    'resetVenueTypes'
]

export class VenueAvailability extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initData: {},
            selectedDate: {},
            //filter
            date: "",
            slots: [],
            venueIds: [],
            vanueTypeIds: [],

            items: [],
            offset: 1,
            columns: this.getColumns(),
            //pager
            pageSize: 10,
            pageCount: 8,
            selectedPage: 2,

            dateFilters: [],
            slotFilters: [],
            venueFilters: [],
            venueTypeFilters: []
        }
        for (let item of funcs) {
            if (this[item] != undefined) {
                this[item] = this[item].bind(this);
            }
        }
    }
    componentWillMount() {
        this.setInitData();
        this.initVenues();
    }
    componentDidMount() {

    }

    // Basic obj
    getValueCollectionFromResponse(response) {
        let items = [],
            count = 0;
        if (response instanceof Array) {
            for (let item of response) {
                items.push({
                    name: item,
                    value: count++,
                    isChecked: false
                })
            }
        }
        return items;
    }
    getSelectedNameCollection(items) {
        let result = []
        for (let item of items) {
            if (item.isChecked) {
                result.push(item.name);
            }
        }
        return result;
    }
    getColumns() {
        let columns = [{
            header: I18N.getReportingValue('RE_SC_VA_Venue_Entry'),
            width: 18,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_VA_Venue_Type_Entry'),
            width: 18,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_VA_Slot_Entry'),
            width: 18,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_VA_Date_Entry'),
            width: 18,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_VA_Availability_Indicator_Entry'),
            width: 18,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_VA_In_Use_For_Next_Slot_Entry'),
            width: 20,
            isResizable: true
        }];
        return columns;
    }

    setInitData() {
        this.state.initData = this.props.initData;
    }
    initVenues() {
        let data = this.getRequestDataForInitialization();
        this.initAvailabilityVenues(data);
    }
    getRequestDataForInitialization() {
        let data = this.getRequestData();
        return data;
    }

    // Set filters
    setDateFilters(self, value) {
        $$.setState(self, "reporting-venue-datefilter", {
            dateFilters: value
        });
    }
    setSlotFilters(self, value) {
        $$.setState(self, "reporting-venue-slotfilter", {
            slotFilters: value
        });
    }
    setVenueFilters(self, value) {
        $$.setState(self, "reporting-venue-venuefilter", {
            venueFilters: value
        });
    }
    setVenueTypeFilters(self, value) {
        $$.setState(self, "reporting-venue-venuetypefilter", {
            venueTypeFilters: value
        });
    }

    // Filter handler
    dateFiltersChanged(option, event) {
        // index,value,item
        let newValue = event.newValue,
            date = newValue.item.name,
            data = this.getFilterDateRequestData(date);

        $$.loading(true);
        Service.getVenueAvailability(data).then(function (response) {
            this.serviceBasicCallback(response);

            this.setState({ selectedDate: newValue.item });
            $$.loading(false);
        }.bind(this)).catch((message) => {
            $$.log(message);
            $$.loading(false);
        });
    }
    slotFiltersChanged(option, event) {
        let newValue = event.newValue,
            slot = this.getSelectedNameCollection(newValue.items),
            data = this.getFilterSlotRequestData(slot);
        $$.loading(true);
        Service.getVenueAvailability(data).then(function (response) {
            this.serviceBasicCallback(response);

            $$.loading(false);
        }.bind(this)).catch((message) => {
            $$.log(message);
            $$.loading(false);
        });
    }
    venueFiltersChanged(option, event) {
        let newValue = event.newValue,
            venue = this.getSelectedNameCollection(newValue.items),
            data = this.getFilterVenueRequestData(venue);

        //this.resetVenueTypes();
        //this.setState({});
        $$.loading(true);
        Service.getVenueAvailability(data).then(function (response) {
            this.serviceBasicCallback(response);

            $$.loading(false);
        }.bind(this)).catch((message) => {
            $$.log(message);
            $$.loading(false);
        });
    }
    venueTypeFiltersChanged(option, event) {
        let newValue = event.newValue,
            venueType = this.getSelectedNameCollection(newValue.items),
            data = this.getFilterVenueTypeRequestData(venueType);
        $$.loading(true);
        Service.getVenueAvailability(data).then(function (response) {
            this.serviceBasicCallback(response);

            $$.loading(false);
        }.bind(this)).catch((message) => {
            $$.log(message);
            $$.loading(false);
        });
    }

    resetVenueTypes() {
        let filters = this.state.venueTypeFilters;
        for (let item of filters) {
            item.isChecked = false;
        }
        this.setVenueTypeFilters(this, deepClone(filters));
    }
    deepClone(initalObj) {
        var obj = {};

        obj = JSON.parse(JSON.stringify(initalObj));

        return obj;
    }
    // Search
    searchBoxSearchHandler(params, event) {
        let searchText = event.newValue;
        let data = this.getSearchRequestData(searchText);
        $$.loading(true);
        Service.getVenueAvailability(data).then(function (response) {
            this.serviceBasicCallback(response);

            $$.loading(false);
        }.bind(this)).catch((message) => {
            $$.log(message);
            $$.loading(false);
        });
    }
    searchBoxStopHandler(params, event) {
        let searchText = undefined;
        let data = this.getSearchRequestData(searchText);
        $$.loading(true);
        Service.getVenueAvailability(data).then(function (response) {
            this.serviceBasicCallback(response);

            $$.loading(false);
        }.bind(this)).catch((message) => {
            $$.log(message);
            $$.loading(false);
        });
    }

    // Datagrid
    handleDataChanged() {

    }

    // Pager
    handleSelectedPageChanged(option, event) {
        let selectedPage = event.newValue.pageSize,
            pageSize = event.newValue.pageSize;
        let data = this.getPageRequestData(selectedPage, pageSize);
        this.state.pageSize = pageSize;
        $$.loading(true);
        Service.getVenueAvailability(data).then(function (response) {
            this.serviceBasicCallback(response);

            $$.loading(false);
        }.bind(this)).catch((message) => {
            $$.log(message);
            $$.loading(false);
        });
    }

    // Initialize venues
    initAvailabilityVenues(data) {
        $$.loading(true);
        Service.getVenueAvailabilityFilters(data).then(function (response) {

            let dateFilters = this.getValueCollectionFromResponse(response[0]),
                slotFilters = this.getValueCollectionFromResponse(response[1]),
                venueFilters = this.getValueCollectionFromResponse(response[2]),
                venueTypeFilters = this.getValueCollectionFromResponse(response[3]);

            this.setDateFilters(this, dateFilters);
            this.setSlotFilters(this, slotFilters);
            this.setVenueFilters(this, venueFilters);
            this.setVenueTypeFilters(this, venueTypeFilters);

            $$.loading(false);
        }.bind(this)).catch((message) => {
            $$.log(message);
            $$.loading(false);
        });
    }

    // Initialize request data
    getRequestData() {
        let initData = this.state.initData,
            qualificationCategory = initData.qualification ? initData.qualification.qualificationCategory : "",
            semesterId = initData.qualification ? initData.qualification.semesterId : "",
            name = initData.assessment ? initData.assessment.name : "";

        let data = {
            offset: this.state.offset,
            limit: 10,
            sortBy: "qui dolor cupidatat et irure",
            order: "ut aute",
            searchText: "",

            qualificationCategory: "Demo",
            assessmentType: "Demo",
            semesterId: "Demo",
        }
        return data;
    }
    getFilterDateRequestData(date) {
        let data = this.getRequestData();

        data.date = date;
        data.slots = [];
        data.venueIds = [];
        data.venueTypeIds = [];

        return data;
    }
    getFilterSlotRequestData(slot) {
        let data = this.getRequestData();

        data.date = this.state.selectedDate.name;
        data.slot = slot;
        data.venueIds = [];
        data.venueTypeIds = [];

        return data;
    }
    getFilterVenueRequestData(venue) {
        let data = this.getRequestData();

        data.date = this.state.selectedDate.name;
        data.slot = this.getSelectedNameCollection(this.state.slotFilters);
        data.venueIds = venue;
        data.venueTypeIds = [];

        return data;
    }
    getFilterVenueTypeRequestData(venueType) {
        let data = this.getRequestData();

        data.date = this.state.selectedDate.name;
        data.slot = this.getSelectedNameCollection(this.state.slotFilters);
        data.venueIds = this.getSelectedNameCollection(this.state.venueFilters);
        data.venueTypeIds = venueType;
        data.limit = this.state.pageSize;
        return data;
    }
    getSearchRequestData(searchText) {
        let data = this.getRequestData();

        data.date = this.state.selectedDate.name;
        data.slot = this.getSelectedNameCollection(this.state.slotFilters);
        data.venueIds = this.getSelectedNameCollection(this.state.venueFilters);
        data.venueTypeIds = this.getSelectedNameCollection(this.state.venueTypeFilters);

        data.searchText = searchText;

        return data;
    }
    getPageRequestData(selectedPage, pageSize) {
        let data = this.getRequestData();

        data.date = this.state.selectedDate.name;
        data.slot = this.getSelectedNameCollection(this.state.slotFilters);
        data.venueIds = this.getSelectedNameCollection(this.state.venueFilters);
        data.venueTypeIds = this.getSelectedNameCollection(this.state.venueTypeFilters);

        data.offset = selectedPage;
        data.limit = pageSize;

        return data;
    }

    //
    serviceBasicCallback(response) {
        $$.setState(this, "reporting-venue-datagrid", {
            items: response.items,
        });

        if (response.items.length < 10) {
            this.state.pageCount = 1;
        }
        else {
            this.state.pageCount = Math.floor(Math.random() * (22 - 10) + 11);
        }
        this.setState({
            totalCount: response.totalCount,
            offset: response.offset
        });
    }
    render() {
        return (
            <div id='reporting-venueavailability'>
                <div style={{}}>
                    <div style={{ maxHeight: '70px' }}>
                        <div style={{
                            marginBottom: "10px",
                            minWidth: '750px',
                            marginBottom: '10px',
                            position: 'relative',
                            minWidth: '750px',
                            float: 'left'
                        }}>
                            {/*date*/}
                            <div className="inline-block"
                                style={{ float: 'left' }}
                            >
                                <R.Combobox
                                    id="reporting-venue-datefilter"
                                    width={180}
                                    dataTextField='name'
                                    dataValueField='value'
                                    items={this.state.dateFilters}
                                    selectedItem={this.state.selectedDate}
                                    selectionChanged={this.dateFiltersChanged}
                                    selectedItemTemplate={I18N.getReportingValue('RE_SC_VA_Date_Temp_Entry')}
                                    waterMark={I18N.getReportingValue("RE_SC_VA_DATE:_ENTRY")
                                        + I18N.getReportingValue("RE_Common_None_Entry")}
                                />
                                {/*<R.Multicombobox
                                    id='reporting-venue-datefilter'
                                    disabled={false}
                                    width={140}
                                    dataCheckedField="isChecked"
                                    dataTextField="name"
                                    items={this.state.dateFilters}
                                    selectionChanged={this.dateFiltersChanged}
                                    popupWidth="100%"
                                    selectedItemTemplate={`Date: {0}`}
                                    allText={`Date: All`}
                                />*/}
                            </div>
                            {/*slot*/}
                            <div className="inline-block" style={{ marginLeft: '10px' }}>
                                <R.Multicombobox
                                    id='reporting-venue-slotfilter'
                                    disabled={false}
                                    width={210}
                                    dataCheckedField="isChecked"
                                    dataTextField="name"
                                    items={this.state.slotFilters}
                                    selectionChanged={this.slotFiltersChanged}
                                    popupWidth="210px"
                                    selectedItemTemplate={I18N.getReportingValue('RE_SC_VA_Slot_Temp_Entry')}
                                    allText={I18N.getReportingValue('RE_SC_VA_Slot_All_Temp_Entry')}
                                    noneText={I18N.getReportingValue("RE_SC_VA_SLOT:_ENTRY")
                                        + I18N.getReportingValue("RE_Common_None_Entry")}
                                />
                            </div>
                            {/*venue*/}
                            <div className="inline-block" style={{ marginLeft: '10px' }}>
                                <R.Multicombobox
                                    id='reporting-venue-venuefilter'
                                    disabled={false}
                                    width={140}
                                    dataCheckedField="isChecked"
                                    dataTextField="name"
                                    items={this.state.venueFilters}
                                    selectionChanged={this.venueFiltersChanged}
                                    popupWidth="100%"
                                    selectedItemTemplate={I18N.getReportingValue('RE_SC_VA_Venue_Temp_Entry')}
                                    allText={I18N.getReportingValue('RE_SC_VA_Venue_All_Temp_Entry')}
                                    noneText={I18N.getReportingValue("RE_SC_VA_VENUE:_ENTRY")
                                        + I18N.getReportingValue("RE_Common_None_Entry")}
                                />
                            </div>
                            {/*venue type*/}
                            <div className="inline-block" style={{ marginLeft: '10px' }}>
                                <R.Multicombobox
                                    id='reporting-venue-venuetypefilter'
                                    disabled={false}
                                    width={175}
                                    dataCheckedField="isChecked"
                                    dataTextField="name"
                                    items={this.state.venueTypeFilters}
                                    selectionChanged={this.venueTypeFiltersChanged}
                                    popupWidth="100%"
                                    selectedItemTemplate={I18N.getReportingValue('RE_SC_VA_Venue_Type_Temp_Entry')}
                                    allText={I18N.getReportingValue('RE_SC_VA_Venue_Type_All_Temp_Entry')}
                                    noneText={I18N.getReportingValue("RE_SC_VA_VENUE_TYPE:_ENTRY")
                                        + I18N.getReportingValue("RE_Common_None_Entry")}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ float: 'right', marginBottom: "13px", display: "inline-block" }}>
                        <div className="float-right margiontop5">
                            <R.Searchbox
                                title="input keyword"
                                placeholder={"Search by Modules,Content..."}
                                disabled={false}
                                onSearch={this.searchBoxSearchHandler}
                                onStop={this.searchBoxStopHandler} />
                        </div>
                    </div>
                    <div className="margiontop10">
                        <div className="">
                            <R.DatagridWithCtrl
                                id="reporting-venue-datagrid"
                                columns={this.state.columns}
                                disabled={false}
                                horizontal={$$.datagrid('horizontal').percent}
                                items={this.state.items}
                                rowTemplate={VenueAvailabilityRowTemplate}
                                rowDataChanged={this.handleDataChanged}
                            />

                            <R.Pager
                                pageSize={this.state.pageSize}
                                pageCount={this.state.pageCount}
                                selectedPage={this.state.selectedPage}
                                selectedPageChanged={this.handleSelectedPageChanged}>
                            </R.Pager>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = VenueAvailability;