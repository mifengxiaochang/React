import AssessmentPanel from './CommonComponents/AssessmentPanel'
import ExportPanel from './CommonComponents/ExportPanel'
//import PieChartPanel from './CommonComponents/PieChartPanel'
import PieChartPanel from '../../Common/PieChartPanel';
import * as FetchServices from '../Service/AssessmentSheduleService';
import { SubmissionProgressTabType } from '../../../Constants/Constants'
import * as ScheduleService from '../../../Services/ScheduleService';
import { Link } from 'react-router-dom';

const eventList = [
    "pieCallBack",
    "handleSelectedPageChanged",
    "onSearch",
    "onStop",
    "handleRowDataChanged",
    'handleSorting',
    'handleExportClicked'
];
export class InformationApprovalTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieChartItems: [
                //{ name: 'Pending Approval', value: 0,color:'' },
                //{ name: 'Approved', value: 0, color: ''},
                //{ name: 'Rejected', value: 0, color: '' },
            ],
            tableItems: [],
            pageSize: 10,
            pageCount: 0,
            selectedPage: 1,
            searchText: '',
            pieTitle: '',
            assessmentCount: 0,
            sortBy: '',
            order: '',
            status: [],
            activeIndex: -1,
        }
        this.selectedModules = [];
        this.qualification = null;
        this.assessment = null;
        this.initDataCompleted = false;
        eventList.map(item => {
            this[item] = this[item].bind(this);
        });
    }

    componentDidMount() {
        //if (this.assessment && this.assessment != '' && this.qualification && this.qualification != '') {
        //    this.getApprovalItems();
        //}
    }

    refreshProgressTabDatas(params) {
        if (params.qualification && params.assessment) {
            this.qualification = params.qualification;
            this.assessment = params.assessment;
            this.selectedModules = params.selectedModules;
            if (this.selectedModules.length > 0) {
                this.getApprovalItems();
            } else {
                this.resetPageData();
            }
        }
    }

    resetPageData() {
        this.state.tableItems = [];
        $$.setState(this, "information-approval-datagrid", { tableItems: [] });
        this.setState({
            selectedPage: 1,
            pageCount: 1,
            pieTitle: "",
            pieChartItems: []
        });
    }

    componentWillReceiveProps(nextProps) {
        //if (nextProps &&
        //    nextProps.submissionProgressTabType !== undefined &&
        //    nextProps.submissionProgressTabType === SubmissionProgressTabType.ApprovalStatus) {
        //    if (this.assessment && this.assessment != '' && this.qualification && this.qualification != '') {
        //        this.getApprovalItems();
        //    }
        //}
    }

    getApprovalItems(offset = 1, needResetSelectedPage = true) {
        if (this.qualification && this.assessment) {
            this.props.loading(true);
            let filterModel = this.getfilterModel();
            let pieChartModel = {
                searchText: this.state.searchText
            },
                tableModel = {
                    offset: offset,
                    limit: this.state.pageSize,
                    sortBy: this.state.sortBy,
                    order: this.state.order,
                    searchText: this.state.searchText,
                    status: this.state.status
                }
            promiseAll(FetchServices.getScheduleApprovalPieChart(Object.assign(pieChartModel, filterModel)), FetchServices.getScheduleApproval(Object.assign(tableModel, filterModel))).then(function (response) {
                this.convertPieChart(response[0]);
                this.convertTableItems(response[1]);
                if (needResetSelectedPage) {
                    Object.assign(this.state, { selectedPage: 1 });
                }
                $$.setState(this, "information-approval-datagrid", {}, () => { this.initDataCompleted = true; });
                this.props.loading(false);
            }.bind(this)).catch((e) => {
                $$.error(`error: ${e}`);
                this.props.loading(false);
            });
        }
    }

    getfilterModel() {
        let assessment = this.assessment,
            qualification = this.qualification,
            modulesFilter = this.selectedModules,
            model = {};
        if (assessment && assessment != '' && qualification && qualification != '') {
            model.assessmentType = assessment.id;
            model.semesterId = qualification.semesterId;
            model.qualificationCategory = qualification.qualificationCategory;
        }
        model.moduleIds = this.getModuleIds(modulesFilter);
        return model;
    }

    getModuleIds(modules) {
        let ids = [];
        for (let item of modules) {
            ids.push(item.moduleId);
        }
        return ids;
    }

    convertPieChart(data) {
        if (data != null) {
            //this.state.pieTitle = data.pieTitle;
            //let moduleCodes = this.selectedModules.map((s) => { return s.moduleCode });
            let moduleCount = this.selectedModules.length;
            let chartTitle = I18N.getReportingValue('RE_SC_Pie_Chart_Title_Entry',
                this.qualification.qualificationCategory, this.assessment.name, this.qualification.academicYear,
                this.qualification.semesterNumber, moduleCount)
            this.state.pieTitle = chartTitle;
            let pieItems = [];
            for (let item of data.items) {
                let chartItem = { name: item.status, value: item.count, color: item.color};
                pieItems.push(chartItem);
                //switch (item.status) {
                //    case 'Rejected':
                //        this.state.pieChartItems[2].value += item.count;
                //        this.state.pieChartItems[2].color = $$.chartColors[item.color];
                //        break;
                //    case 'Apprvoed':
                //        this.state.pieChartItems[1].value += item.count;
                //        this.state.pieChartItems[1].color = $$.chartColors[item.color];
                //        break;
                //    case 'Pending Approval':
                //        this.state.pieChartItems[0].value += item.count;
                //        this.state.pieChartItems[0].color = $$.chartColors[item.color];
                //        break;
                //}

            }
            this.state.pieChartItems = [].concat(pieItems);
        }
    }

    convertTableItems(data) {
        if (data != null) {
            this.state.assessmentCount = data.totalCount;
            this.state.pageCount = Math.ceil(data.totalCount / this.state.pageSize);
            this.state.tableItems = [].concat(data.items)
        }
    }

    pieCallBack(pieData, isCheck) {
        if (isCheck && pieData) {
            if (pieData.name !== undefined) {
                //status.
                let activeIndex = pieData.activeIndex;
                this.state.status = [pieData.name];
                this.setState({
                    activeIndex
                }, () => {
                    this.getTableInfo();
                });
            }
        }
        else if (!isCheck) {
            let activeIndex = -1;
            this.state.status = [];
            this.setState({
                activeIndex
            }, () => {
                this.getTableInfo();
            });
        }
    }

    getTableInfo() {
        if (this.qualification && this.assessment) {
            $$.loading(true);
            let tableModel = {
                offset: this.state.selectedPage,
                limit: this.state.pageSize,
                semesterId: this.qualification.semesterId,
                qualificationCategory: this.qualification.qualificationCategory,
                assessmentType: this.assessment.id,
                moduleIds: this.selectedModules.map((s) => { return s.moduleId }),
                sortBy: this.state.sortBy,
                order: this.state.order,
                searchText: this.state.searchText,
                status: this.state.status
            };
            FetchServices.getScheduleApproval(tableModel).then((response) => {
                this.initTableItems(response);
                $$.loading(false);
            }).catch(function (e) {
                $$.error(`error: ${e}`);
                $$.loading(false);
            });
        }
    }

    initTableItems(data) {
        if (data) {
            let totalPage = Math.ceil(data.totalCount / this.state.pageSize);
            $$.setState(this, 'information-approval-datagrid', {
                tableItems: [].concat(data.items),
                pageCount: totalPage,
                selectedPage: data.offset
            });
        }
    }

    handleSelectedPageChanged(e, args) {
        let pageSize = args.newValue.pageSize,
            selectedPage = args.newValue.selectedPage;
        this.setState({
            selectedPage: selectedPage,
            pageSize: pageSize
        }, () => { if (this.initDataCompleted) { this.getTableInfo()} });

    }

    handleSorting(e, args) {
        if (args.newValue.sort) {
            this.state.sortBy = args.newValue.sort.valuePath;
            this.state.order = args.newValue.sort.status;
            this.getTableInfo();
        }
    }

    handleExportClicked(e, args) {
        let query = {
            semesterId: this.qualification.semesterId,
            qualificationCategory: this.qualification.qualificationCategory,
            assessmentType: this.assessment.id,
            moduleIds: this.selectedModules.map((s) => { return s.moduleId }),
            sortBy: this.state.sortBy,
            order: this.state.order,
            searchText: this.state.searchText,
            status: this.state.status
        }
        ScheduleService.exportSubmissionStatus(query);
    }

    getColumns() {
        let columns = [{
            header: I18N.getReportingValue('RE_Common_Assessment_Entry'),
            width: 110,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_Common_Module_Entry'),
            width: 100,
            valuePath: "module",
            isSortable: true,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Datagrid_Cohort_Entry'),
            width: 100,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_Common_School_Entry'),
            width: 100,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_Common_Status_Entry'),
            width: 140,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Comments_Entry'),
            width: 200,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Last_Updated_By_Entry'),
            width: 130,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Last_Updated_Date_Time_Entry'),
            width: 150,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Approval_Deadline_Entry'),
            width: 140,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Assigned_Approver_Entry'),
            width: 140,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Assessement_Module_Manager_Entry'),
            width: 120,
            isResizable: true,
            visibility: 'hide',
        }, {
            header: I18N.getReportingValue('RE_SC_Assessement_Co-Module_Managers_Entry'),
            width: 150,
            isResizable: true,
            isSortable: true,
            visibility: 'hide',
        }, {
            header: I18N.getReportingValue('RE_SC_Assessement_Assessment_Coordinator_Entry'),
            width: 180,
            isResizable: true,
            visibility: 'hide',
        }
        ];
        return columns;
    }

    onSearch(e, args) {
        this.state.searchText = args.newValue || '';
        this.getTableInfo();
    }

    onStop(e, args) {
        this.state.searchText = args.newValue || '';
        this.getTableInfo();
    }

    handleRowDataChanged(e, args) {
        //let rowData = args.newValue.rowData;
        //switch (args.parameters.actionType) {
        //    case 'view':
        //        this.handleViewClick(rowData);
        //        break;
        //    default:
        //        break;
        //}
    }

    render() {
        let isShowChart = this.state.pieChartItems && this.state.pieChartItems.length > 0;
        return (
            <div id='report-information-approval-container'>
                <div>
                    <AssessmentPanel
                        assessmentCount={this.state.assessmentCount}
                        onSearch={this.onSearch}
                        onStop={this.onStop}
                    />
                    <ExportPanel
                        exportClicked={this.handleExportClicked}
                    />
                </div>
                <div hidden={!isShowChart}>
                    <PieChartPanel
                        attributes={["color", "name", "value"]}
                        items={this.state.pieChartItems}
                        pieTitle={this.state.pieTitle}
                        activeIndex={this.state.activeIndex}
                        centerContent={I18N.getReportingValue('RE_SC_Approval_Progress_Entry')}
                        handlePieCallBack={this.pieCallBack}
                        isShowTextInSector={true}
                    />
                </div>
                <R.DatagridWithCtrl
                    id="information-approval-datagrid"
                    columns={this.getColumns()}
                    items={this.state.tableItems}
                    rowTemplate={InformationRow}
                    rowDataChanged={this.handleRowDataChanged}
                    sorting={this.handleSorting}
                >
                </R.DatagridWithCtrl>
                <R.Pager
                    pageSize={this.state.pageSize}
                    pageCount={this.state.pageCount}
                    selectedPage={this.state.selectedPage}
                    selectedPageChanged={this.handleSelectedPageChanged}>
                </R.Pager>
            </div>
        )
    }
}
module.exports = InformationApprovalTab;

class InformationRow extends R.DatagridRow {
    constructor(props) {
        super(props);
        this.handleViewModule = this.handleViewModule.bind(this);
    }

    handleViewModule() {
        window.open(window.SANavigationConstant.NAVIGATION_ASSESSMENTSCHEDULE + `/AssessmentSchedule/Detail?id=${this.props.rowData.assessmentId}`);
        //this.trigger('rowDataChanged', e, {
        //    actionType: "view"
        //});
    }

    render() {
        var data = this.props.rowData;
        return (
            <div data-part="row">
                <div data-part="cell">{data.assessment}</div>
                <div data-part="cell">{data.module}</div>
                <div data-part="cell">{data.cohort}</div>
                <div data-part="cell">{data.school}</div>
                <div data-part="cell">{data.status}</div>
                <div data-part="cell">{data.comments}</div>
                <div data-part="cell">{data.lastUpdatedBy}</div>
                <div data-part="cell">{data.lastUpdatedDateTime}</div>
                <div data-part="cell">{data.approvalDeadline}</div>
                <div data-part="cell">{data.assignedApprover}</div>
                <div data-part="cell">{data.moduleManager}</div>
                <div data-part="cell">{data.coModuleManagers}</div>
                <div data-part="cell">{data.assessmentCoordinator}</div>
            </div>
        )
    }
}

