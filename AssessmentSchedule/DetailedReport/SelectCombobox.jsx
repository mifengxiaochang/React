import EventHandler from './EventHandler';

const constant = {
    MODULE_SELECTALL: 'Module: All',
    VENUE_SELECTALL: 'Venue: All'
}

export default class SelectCombobox extends EventHandler {
    constructor(props) {
        super(props);
        //this.state = {
        //    moduleItems: this.props.moduleItems,
        //    selectedModuleItems: this.props.selectedModuleItems,
        //    venueItems: this.props.venueItems,
        //    selectedVenueItems: this.props.selectedVenueItems,
        //    filterSource: this.props.filterSource
        //};
        this.onModuleSelectionChanged = this.onModuleSelectionChanged.bind(this);
        this.onVenueSelectionChanged = this.onVenueSelectionChanged.bind(this);
        this.getVenues = this.getVenues.bind(this);
        this.checkStatus = null;
        this.setDefaultTrue = false;
    };

    componentWillReceiveProps(nextProps) {
        this.setDefaultTrue = nextProps.setDefaultTrue;
        if (this.setDefaultTrue)
            this.initNewTabVenueStatus(nextProps);
        //this.state.moduleItems = nextProps.moduleItems;

        //this.state.venueItems.length = 0;
        //nextProps.venueItems.forEach(item => {
        //    var 
        //        tempItem = Object.assign()
        //    this.state.venueItems.push(item);
        //})
        //this.state.filterSource = nextProps.filterSource;
        //this.state.selectedModuleItems = nextProps.selectedModuleItems;
        //this.state.selectedVenueItems = nextProps.selectedVenueItems;
    };

    onModuleSelectionChanged(e, args) {
        this.checkStatus = null;
        this.props.onModuleSelectionChanged(e, args);
    };

    onVenueSelectionChanged(e, args) {
        this.checkStatus = {};
        args.newValue.items.forEach((item, idx) => {
            this.checkStatus[item.value] = "";
        });
        this.props.onVenueSelectionChanged(e, args);
    };

    initNewTabVenueStatus(nextProps) {
        this.checkStatus = {};
        nextProps.moduleItems.forEach((s, idx) => {
            if (s.isChecked) {
                s.venues.forEach((st, i) => {
                    this.checkStatus[st] = "";
                });
            }
        });
    };

    getVenues() {
        let
            arr = [];
        if (this.props.moduleItems && this.props.moduleItems.length > 0) {
            let
                obj = {};
            this.props.moduleItems.forEach((s, idx) => {
                if (s.isChecked) {
                    s.venues.forEach((st, i) => {
                        obj[st] = "";
                    });
                }
            });
            for (let p in obj) {
                arr.push({ value: p, isChecked: this.checkStatus == null ? false : this.checkStatus.hasOwnProperty(p) });
            };
        }
        return arr;
    };

    render() {
        return <div className='custom-float-left'>
            <div className='detailedreport-combobox'>
                <R.Multicombobox
                    noneText={I18N.getReportingValue('RE_Common_Module:_Entry') + I18N.getReportingValue("RE_Common_None_Entry")}
                    selectedItemTemplate={I18N.getReportingValue("RE_Common_Module:_Entry") + " {0}"}
                    selectedItemsTemplate={I18N.getReportingValue("RE_Common_Module:_Entry") + " {0} " + I18N.getReportingValue("RE_Common_Items_Entry")}
                    selectAllText={I18N.getReportingValue("RE_Common_All_Entry")}
                    allText={I18N.getReportingValue("RE_Common_Module:_Entry") + I18N.getReportingValue("RE_Common_All_Entry")}
                    disabled={false}
                    width={220}
                    dataCheckedField="isChecked"
                    dataTextField="value"
                    dataDynamicField="isDynamic"
                    items={this.props.moduleItems}
                    selectionChanged={this.onModuleSelectionChanged}
                    popupWidth="100%"
                    allText={constant.MODULE_SELECTALL}
                //itemClick={this.itemModuleClick}
                />
            </div>
            <div className='detailedreport-combobox' style={{ marginLeft: '10px' }}>
                <R.Multicombobox
                    noneText={I18N.getReportingValue('RE_SC_Venue:_Entry') + I18N.getReportingValue("RE_Common_None_Entry")}
                    selectedItemTemplate={I18N.getReportingValue("RE_SC_Venue:_Entry") + " {0}"}
                    selectedItemsTemplate={I18N.getReportingValue("RE_SC_Venue:_Entry") + " {0} " + I18N.getReportingValue("RE_Common_Items_Entry")}
                    selectAllText={I18N.getReportingValue("RE_Common_All_Entry")}
                    allText={I18N.getReportingValue("RE_SC_Venue:_Entry") + I18N.getReportingValue("RE_Common_All_Entry")}
                    disabled={false}
                    width={220}
                    dataCheckedField="isChecked"
                    dataTextField="value"
                    dataDynamicField="isDynamic"
                    items={this.getVenues()}
                    selectionChanged={this.onVenueSelectionChanged}
                    popupWidth="100%"
                    allText={constant.VENUE_SELECTALL}
                //itemClick={this.itemVenueClick}
                />
            </div>
        </div>
    };
};