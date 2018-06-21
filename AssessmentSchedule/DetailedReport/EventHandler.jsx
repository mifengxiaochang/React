//import { ReportingRouterUrl } from '../../../Constants/Constants';

const eventArr = [
    'getColumns',
    'rowDataChanged',
    'postRequest',
    'onModuleSelectionChanged',
    'onVenueSelectionChanged',
    'onSearch',
    'onStop',
    'selectedPageChanged',
    'refreshDatagrid',
    'searchClickHandlerCallBack',
    'stopSearchCallBack',
    'getModuleFilter',
    'getModuleFilterCallback',
    'resetBreadcrumb'
];

const targetComponent = SAComponents.COMPONENT_ASSESSMENTREPORTING;

class EventHandler extends React.Component {
    constructor(props) {
        super(props);
        eventArr.forEach(ev => {
            this[ev] = this[ev].bind(this);
        })
        this.semesterId = "";
        this.qualificationCategory = "";
        this.assessmentType = "";
        this.preModuleId = null;
        this.newTab = false;
    };

    getModuleFilter(callback) {
        $$.loading(true);
        if (this.state.initData.param) {
            this.semesterId = this.state.initData.param.semesterId;
            this.qualificationCategory = this.state.initData ? (this.state.initData.qualification ? this.state.initData.qualification.qualificationCategory : '') : '';
            this.assessmentType = this.state.initData.param.assessment;
            this.preModuleId = this.state.initData.param.moduleId;
            //alert(this.state.initData.param.moduleId);
        } else {
            this.semesterId = this.state.initData ? (this.state.initData.qualification ? this.state.initData.qualification.semesterId : '') : '';
            this.qualificationCategory = this.state.initData ? (this.state.initData.qualification ? this.state.initData.qualification.qualificationCategory : '') : '';
            this.assessmentType = this.state.initData ? (this.state.initData.assessment ? (this.state.initData.assessment.id ? this.state.initData.assessment.id : '') : '') : '';
            this.resetBreadcrumb();
        }
        console.log(this.qualificationCategory);
        console.log(this.state.initData);
        console.log(this.semesterId);
        console.log(this.assessmentType);
        if (this.state.initData.param);
        console.log(this.state.initData.param);
        let
            data = {
                qualificationCategory: this.qualificationCategory,
                semesterId: this.semesterId,
                assessmentType: this.assessmentType
            },
            fetchOption = {
                targetComponent: targetComponent,
                url: 'api/assessmentschedulingdetailedreport/getassessmentschedulingdetailedfilters',
                //url: 'http://yapi.avepoint.net/mock/257/api/schedulestudentdetails/getassessmentschedulingdetailedfilters',
                method: 'POST',
                data: JSON.stringify(data)
            };
        fetchUtil(fetchOption).then(response => {
            callback(response);
        }).then(e => {
            console.log(e);
            $$.loading(false);
        });
    }

    resetBreadcrumb() {
        let breadcrumbs = [
            { Title: I18N.getReportingValue("RE_Common_Home_Entry"), Url: '/' },
            { Title: I18N.getReportingValue("RE_Common_Report_Entry"), Url: window.SANavigationConstant.NAVIGATION_ASSESSMENTREPORTING },
            { Title: I18N.getReportingValue("RE_SC_Schedule_Detailed_Report_Entry"), Url: `/${window.SANavigationConstant.NAVIGATION_ASSESSMENTREPORTING}/ScheduleDetailedReport` }];
        window.CommonUtil.setBreadcrumbs(breadcrumbs);
    };

    getModuleFilterCallback(response) {
        $$.loading(false);
        if (response) {
            console.log(response);
            var
                mhash = {},
                vhash = {},
                tempModuleArr = [],
                tempVenueArr = [];
            this.state.moduleItems.length = 0;
            response.forEach(item => {
                let
                    mitem = {
                        isChecked: false,
                        value: item.moduleCode,
                        isDynamic: false,
                        venues: item.venues
                    };
                if (item.moduleId == this.preModuleId) {
                    this.newTab = true;
                    mitem.isChecked = true;
                    this.state.selectedModuleItems.push(item.moduleCode);
                    item.venues.forEach(v => {
                        this.state.selectedVenueItems.push(v);
                    });
                };
                if (!mhash[item.moduleId]) {
                    mhash[item.moduleId] = true;
                    tempModuleArr.push(mitem)
                    //this.state.selectedModuleItems.push(item.moduleId);
                    //item.venues.forEach(v => {
                    //    if (!vhash[v]) {
                    //        vhash[v] = true;
                    //        this.state.selectedVenueItems.push(v);
                    //    }
                    //})
                }
            });
            this.setState({
                moduleItems: tempModuleArr,
            });
            this.postRequest(this.refreshDatagrid);
        }
    };

    postRequest(callback) {
        $$.loading(true);
        let
            data = {
                offset: parseInt(this.state.currentPageIndex),
                limit: parseInt(this.state.pageSize),
                semesterId: this.semesterId, //qualification type
                qualificationCategory: this.qualificationCategory,//qualification type
                assessmentType: this.assessmentType, //assessments
                moduleIds: this.state.selectedModuleItems,
                venueIds: this.state.selectedVenueItems,
                //sortBy: '',
                //order: '',
                searchText: this.state.searchText
            },
            fetchOption = {
                targetComponent: targetComponent,
                url: 'api/assessmentschedulingdetailedreport/getassessmentschedulingdetailedreport',
                //url: 'http://yapi.avepoint.net/mock/257/api/getassessmentschedulingdetailedreport',
                method: 'POST',
                data: JSON.stringify(data)
            };
        fetchUtil(fetchOption).then(response => {
            $$.loading(false);
            if (response)
                if (response)
                    callback(response);
        }).then(e => {
            console.log(e);
            $$.loading(false);
        });
    };

    refreshDatagrid(response) {
        let
            result = response,
            tempSrc = result.items;
        this.state.itemsCount = response.totalCount;
        this.state.currentPageIndex = response.offset;
        this.state.items.length = 0;
        this.state.pageCount = Math.ceil(this.state.itemsCount / this.state.pageSize);
        let
            obj = {
                items: this.state.items.concat(tempSrc),
            };
        $$.setState(this, 'rp-sa-report-detailedreport-datagrid', obj);
    };

    getColumns() {
        let
            columns = [
                {
                    header: I18N.getReportingValue("RE_Common_Student_Id_Entry"),
                    width: 150
                },
                {
                    header: I18N.getReportingValue("RE_Common_Student_Name_Entry"),
                    header: 'Student Name',
                    width: 150
                },
                {
                    header: I18N.getReportingValue("RE_SC_Schedule_Venue_Entry"),
                    width: 100
                },
                {
                    header: I18N.getReportingValue("RE_SC_Schedule_Seat_Number_Entry"),
                    width: 100
                },
                {
                    header: I18N.getReportingValue("RE_SC_Schedule_Special_Arrangement_Entry"),
                    width: 250
                },
                {
                    header: I18N.getReportingValue("RE_SC_Schedule_Assessment_Package_DownLoaded_Entry"),
                    width: 250
                },
                {
                    header: I18N.getReportingValue("RE_SC_Schedule_Assessment_Package_Download_DateTime_Entry"),
                    width: 300
                }
            ];
        return columns;
    };

    rowDataChanged(e, args) {

    };

    getRootData() {
        let
            disabled = arguments[0];
        return {
            disabled: disabled
        }
    }

    onModuleSelectionChanged(e, args) {
        this.newTab = false;
        let
            newValue = args.newValue.items;
        this.state.selectedModuleItems.length = 0;
        newValue.forEach(item => {
            this.state.selectedModuleItems.push(item.value);
        });
        if (newValue.length == 0) {
            //let
            //    obj = {
            //        items: this.state.items.concat(),
            //    };
            $$.setState(this, 'rp-sa-report-detailedreport-datagrid', {
                items: [],
                moduleItems: args.allValue.items
            });
        } else {
            this.setState({
                moduleItems: args.allValue.items
            });
        }
        //this.postRequest(this.refreshDatagrid);
    };

    onVenueSelectionChanged(e, args) {
        this.newTab = false;
        let
            tempArr = args.newValue.items;
        this.state.selectedVenueItems.length = 0;
        tempArr.forEach(item => {
            this.state.selectedVenueItems.push(item.value);
        });
        this.postRequest(this.refreshDatagrid);
    };

    onSearch(e, args) {
        this.newTab = false;
        let
            searchText = args.newValue;
        this.props.searchClickHandlerCallBack(searchText);
        this.props.postRequest(this.props.refreshDatagrid);
    };

    searchClickHandlerCallBack(searchText) {
        this.state.searchText = searchText;
    };

    onStop(e, args) {
        this.props.stopSearchCallBack();
        this.props.postRequest(this.props.refreshDatagrid);
    };

    stopSearchCallBack() {
        this.state.searchText = '';
    };

    selectedPageChanged(e, args) {
        this.newTab = false;
        let
            newValue = args.newValue.selectedPage,
            oldValue = args.oldValue.selectedPage;
        this.state.currentPageIndex = newValue;
        this.state.pageSize = args.newValue.pageSize;
        this.postRequest(this.refreshDatagrid);
    };
};

export default EventHandler;