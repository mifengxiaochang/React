import EventHandler from './EventHandler';
import SelectCombobox from './SelectCombobox';
import SearchBox from './SearchBox';
import Export from './Export';

Function.prototype.customArgs = function (arr) {
    let
        newObj = Object.create(this.prototype);
    return this.apply(newObj, arr)
};

export default class DetailedReportMain extends EventHandler {
    constructor(props) {
        super(props)
        this.state = {
            disabled: false,
            items: [],
            moduleItems: [],
            venueItems: [],
            selectedModuleItems: [],
            selectedVenueItems: [],
            pageCount: 15,
            pageSize: 20,
            currentPageIndex: 1,
            itemsCount: 0,
            initData: this.props.initData,
            searchText: '',
            filterSource: [],
        };
    };

    componentDidMount() {
        this.getModuleFilter(this.getModuleFilterCallback)
    };

    //componentWillUnmount() {
    //    this._isMounted = false;
    //};

    render() {
        return <div>
            <div className='detailedreport-flex-item'>
                <SelectCombobox
                    setDefaultTrue={this.newTab}
                    moduleItems={this.state.moduleItems}
                    venueItems={this.state.venueItems}
                    selectedModuleItems={this.state.selectedModuleItems}
                    selectedVenueItems={this.state.selectedVenueItems}
                    //filterSource={this.filterSource}
                    //postRequest={this.postRequest}
                    //refreshDatagrid={this.refreshDatagrid}
                    onModuleSelectionChanged={this.onModuleSelectionChanged}
                    onVenueSelectionChanged={this.onVenueSelectionChanged}
                />
                <SearchBox
                    postRequest={this.postRequest}
                    refreshDatagrid={this.refreshDatagrid}
                    searchClickHandlerCallBack={this.searchClickHandlerCallBack}
                    stopSearchCallBack={this.stopSearchCallBack}
                />
                <div style={{ clear: 'both' }}></div>
                <p style={{ display: 'inline-block', marginTop: '10px', marginBottom: '10px', fontWeight: 'bold', color: '#707070' }}>{I18N.getReportingValue('RE_SC_DetailedReport_Total_Students_Message', this.state.itemsCount)}</p>
            </div>
            <div className='detailedreport-flex-item' style={{ position: 'relative' }}>
                <Export />
                <R.DatagridWithCtrl
                    id="rp-sa-report-detailedreport-datagrid"
                    columns={this.getColumns()}
                    items={this.state.items}
                    rootData={this.getRootData.customArgs([this.state.disabled])}
                    rowTemplate={DataGridRow}
                    rowDataChanged={this.rowDataChanged}
                >
                </R.DatagridWithCtrl>
                <div>
                    <R.Pager
                        pageSize={this.state.pageSize}
                        pageCount={this.state.pageCount}
                        selectedPage={this.state.currentPageIndex}
                        selectedPageChanged={this.selectedPageChanged}
                    />
                </div>
            </div>
        </div>
    };
}



class DataGridRow extends R.DatagridRow {
    constructor(props) {
        super(props);
    }
    render() {
        let
            data = this.props.rowData;
        return <div data-part="row">
            <div data-part="cell">{data.studentId}</div>
            <div data-part="cell">{data.studentName}</div>
            <div data-part="cell">{data.venue}</div>
            <div data-part="cell">{data.seatNumber}</div>
            <div data-part="cell">{data.usedForSpecialArrangement}</div>
            <div data-part="cell">{data.assessmentPackageDownloaded}</div>
            <div data-part="cell">{data.assessmentPackageDownloadDateTime}</div>
        </div>
    }
}
