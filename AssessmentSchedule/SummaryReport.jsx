import * as React from 'react';
import * as Service from './Service/SummaryReportService';
import SummaryReportHeader from './SummaryReportComponents/SummaryReportHeader';
import SummaryTable from './SummaryReportComponents/SummaryTable';
import * as CommonUtill from '../../Utilities/CommonUtil'


const eventsArr = [
    "handleStateCallBack",
    "handleModuleSelectedChanged",
    "handleModeSelectedChanged"
];

export class SummaryReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableItemSource: {},

            selectedPage: 1,
            pageSize: 10,
            totalCount: 0,
            sortByColumsName: "",
            sortState: "",
            searchText: "",

            currentModuleIdList: [],
            currentModeList: [],
            moduleFilters: [],
            modeFilters: []

        };

        eventsArr.map((ev) => {
            this[ev] = this[ev].bind(this);
        });

        this.selectedModule = {
            isSelectAll: true,
            moduleFilters: []
        };
        this.selectedMode = {
            isSelectAll: true,
            mode: []
        };
    }

    componentWillMount() {
        this._isMounted = true

    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidMount() {
        $$.isShowLog(true);
        this.initPage();
    }

    initPage() {
        if (!this.props.initData || !this.props.initData.qualification || !this.props.initData.assessment) {
            return;
        }
        let requestData = {};
        requestData.qualificationCategory = this.props.initData.qualification && this.props.initData.qualification.qualificationCategory || "";
        requestData.semesterId = this.props.initData.qualification && this.props.initData.qualification.semesterId || "";
        requestData.assessmentType = this.props.initData.assessment && this.props.initData.assessment.name || "",

        this.getFilters(requestData);
        //this.updateValue();       
    }

    getFilters(requestData) {
       
        if (!CommonUtill.isEmptyObject(requestData)) {
            $$.loading(true);
            Service.getScheduleModuleAndModeFilters(requestData).then((rs) => {

                if (rs && rs.length > 0) {

                    this.selectedModule.isSelectAll = false;
                    this.selectedMode.isSelectAll = false;

                    //let obj = {};
                    //rs.forEach((m, idx) => {
                    //    m.isChecked = false;
                    //    this.selectedModule.moduleFilters.push(m.moduleId);
                    //    m.mode.forEach((s, i) => {
                    //        obj[s] = "";
                    //    });
                    //});

                    //for (let p in obj) {
                    //    this.selectedMode.mode.push(p);
                    //}
                    rs.forEach((module, idx) => { module.isChecked = false; });
                    if (this._isMounted) {
                        //Maybe useful
                        /*this.setState({
                            moduleFilters: rs
                        }, () => {
                            this.updateValue();
                        });
                        */
                        this.state.moduleFilters = rs;
                        this.setState({
                            modulefilters: rs,
                            //selectedPage: 1,
                            //pageCount: 1
                        });
                    }
                }
                $$.loading(false);
            }).catch(msg => {
                $$.log(msg);
                $$.loading(false);
            });
        }

    }

    updateValue() {
        let requestData = {};
        if (!this.props.initData || !this.props.initData.qualification || !this.props.initData.assessment || !this.props.initData.assessment.name || !this.props.initData.qualification.qualificationCategory) {
            return;
        }
        requestData = CommonUtill.deepCopy(this.getRequestData());

        if (!CommonUtill.isEmptyObject(requestData)) {

            $$.loading(true);
            Service.getAssessmentScheduleSummary(requestData)
                .then((data) => {
                    $$.log(data);
                    if (this._isMounted) {
                        let item = {};
                        let pageCount = Math.ceil(data.totalCount / this.state.pageSize);
                        item.tableData = data.items;
                        item.pageCount = pageCount;
                        item.selectedPage = data.offset;
                        //if (data.moduleFilters.length > 0) {
                        //    this.allModuleItems = CommonUtill.deepCopy(data.moduleFilters);
                        //    this.state.currentModuleIdList = data.moduleFilters.filter(m => m.moduleId);
                        //}
                        //if (data.modeFilters && data.modeFilters.length > 0) {
                        //    this.state.currentModeList = data.modeFilters;
                        //}
                        this.setState({
                            totalCount: data.totalCount,
                            tableItemSource: item,
                            //moduleFilters: data.moduleFilters,
                            //modeFilters: data.modeFilters,
                            selectedPage: data.offset,
                        });
                    }
                   
                }).catch(msg => {
                    $$.log(msg);
                    $$.loading(false);
                });
        }
    }

    getRequestData() {
        let data ={};
       
        if (this.props.initData) {
            
            data.offset = parseInt(this.state.selectedPage);
            data.limit = parseInt(this.state.pageSize);
            data.assessmentType = this.props.initData.assessment.name;
            if (this.props.initData.qualification) {
                data.semesterId = this.props.initData.qualification && this.props.initData.qualification.semesterId;//;//this.props.initData.qualification.semesterId;
                data.qualificationCategory = this.props.initData.qualification && this.props.initData.qualification.qualificationCategory || "";
            }
        } 
        data.moduleIds = this.selectedModule.moduleFilters;
        data.mode = this.selectedMode.mode;
        //this.state.currentModuleIdList.length > 0 ? data.moduleIds = this.state.currentModuleIdList : data.moduleIds = [];
        //this.state.currentModeList.length > 0 ? data.Mode = this.state.currentModeList : data.Mode = [];
        this.state.sortByColumsName ? data.sortBy = this.state.sortByColumsName : data.sortBy = "";
        this.state.sortState ? data.order = this.state.sortState : data.order = "";
        this.state.searchText ? data.searchText = this.state.searchText : data.searchText = "";

       return data;
    }

    handleModuleSelectedChanged(args) {
        //if (args.newValue.items.length == 0) {
        //    $$.setState(this, "assessment-schedule-report-datagrid", { itemSource: [] });
        //    this.setState({
        //        selectedPage: 1,
        //        pageCount: 1
        //    });
        //    return;
        //}
        this.selectedModule = {
            isSelectAll: args.newValue.isSelectAll,
            moduleFilters: []
        };
       
        this.selectedMode = {
            isSelectAll: false,
            mode: []
        };

        this.state.moduleFilters = args.allValue.items;
              
        
        let obj = {};
        //if (!args.newValue.isSelectAll) {
        args.newValue.items.forEach((item, idx) => {
            //this.selectedMode.mode.push(item.mode)
            this.selectedModule.moduleFilters.push(item.moduleId);
            item.mode.forEach((i, j) => {
                obj[i] = '';
            })
        });
        //} 
        //for (let p in obj) {
        //    this.selectedMode.mode.push(p);
        //}
       
        this.updateValue();
    }

    handleModeSelectedChanged(args) {
        this.selectedMode = {
            isSelectAll: args.newValue.isSelectAll,
            mode: []
        };
        //if (args.newValue.items.length == 0) {
        //    this.state.gridDatas = [];
            
        //    $$.setState(this, "assessment-schedule-report-datagrid", { itemSource: [] });
        //    this.setState({
        //        selectedPage: 1,
        //        pageCount: 1
        //    });
        //    return;
        //}
       // if (!args.newValue.isSelectAll) {
            args.newValue.items.forEach((item, idx) => {
                this.selectedMode.mode.push(item.name);
            });
        //}
        this.updateValue();
    }

    handleStateCallBack(value, type) {
        switch (type) {
            //case "module":
            //    this.setState({
            //        currentModuleIdList: value
            //    }, () => { this.updateValue() });
            //    break;
            case "mode":
                this.setState({
                    currentModeList: value
                }, () => { this.updateValue() });
                break;
            case "search":
                    this.setState({
                        searchText: value
                    }, () => { this.updateValue() });
                
                break;
            case "sort":
                    this.setState({
                        sortState: value.status,
                        sortByColumsName: value.sortByColumsName === I18N.getReportingValue('RE_Common_Modules_Entry') ? "module" : value.sortByColumsName
                    }, () => { this.updateValue() });
                
                break;
            case "page":
                this.setState({
                    selectedPage: value.selectedPage,
                    pageSize: value.pageSize
                }, () => { this.updateValue() });
                break;
        }
    }
    
    render() {
        return (
            <div id="report-assessment-schedule-summary-report" className="flex-column-container">
                <div className="home-page flex-column-container">
                    <SummaryReportHeader
                        moduleFilters={this.state.moduleFilters}
                        //modeFilters={this.state.modeFilters}
                        callback={this.handleStateCallBack}
                        handleModuleSelectedChanged={this.handleModuleSelectedChanged}
                        handleModeSelectedChanged={this.handleModeSelectedChanged}
                    />
                    <div className="margintop10 text-info">
                        <span>{I18N.getReportingValue('RE_SC_SummaryReport_Total_Students_Message', this.state.totalCount)}</span>
                    </div>
                    <SummaryTable
                        tableItemSource={this.state.tableItemSource}
                        callback={this.handleStateCallBack}
                        {...this.props}
                    />
                </div>
            </div>
        );
    }
}

module.exports = SummaryReport;