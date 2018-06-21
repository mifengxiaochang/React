import * as React from 'react';
import AssessmentPanel from './CommonComponents/AssessmentPanel'
import ExportPanel from './CommonComponents/ExportPanel'

import CommonPieChartPanel from '../../Common/PieChartPanel'
import { SubmissionProgressTabType } from '../../../Constants/Constants'
import * as ScheduleService from '../../../Services/ScheduleService'
import { Link } from 'react-router-dom';

const eventArgs = [
    'onSearch',
    'onStop',
    'pieCallBack',
    'getColumns',
    'handleSelectedPageChanged',
    'handleSorting',
    'updatePieChartAndTableDatas',
];
class OverallProgressTab extends React.Component {
    constructor(props) {
        super(props);
        this.init();
    }

    init() {
        this.state = {
            assessmentCount: 0,
            pieChartItems: [
            ],
            pieTitle: '',
            activeIndex: -1,
            tableItemSource: [],
            pageSize: 10,
            pageCount: 0,
            selectedPage: 1,
            pieChartVisible: false,
            isShowTextInSector: true,
        };
        this.selectedModules = [];
        this.qualification = null;
        this.assessment = null;
        this.searchText = '';
        this.sortBy = '';
        this.order = '';
        this.status = [];
        this.isSelectedAllModules = false;
        this.sortableColumns = [
            "",
            "module"
        ];

        eventArgs.forEach((event) => {
            this[event] = this[event].bind(this);
        });
    }

    pageLoading(isLoading) {
        //$$.elementLoading('sa-report-schedule-progressreport', isLoading);
        $$.loading(isLoading);
    }


    getColumns() {
        let columns = [
            {
                header: I18N.getReportingValue('RE_Common_Assessment_Entry'),
                width: 100,
                isResizable: true,
            }, {
                header: I18N.getReportingValue('RE_Common_Modules_Entry'),
                width: 100,
                isResizable: true,
                isSortable: true,
            }, {
                header: I18N.getReportingValue('RE_SC_Datagrid_Cohort_Entry'),
                width: 100,
                isResizable: true,
            }, {
                header: I18N.getReportingValue('RE_Common_School_Entry'),
                width: 100,
                isResizable: true,
            }, {
                header: I18N.getReportingValue('RE_Common_Status_Entry'),
                width: 100,
                isResizable: true,
            }, {
                header: I18N.getReportingValue('RE_SC_Comments_Entry'),
                width: 200,
                isResizable: true,
            }, {
                header: I18N.getReportingValue('RE_SC_Last_Updated_By_Entry'),
                width: 150,
                isResizable: true,
            }, {
                header: I18N.getReportingValue('RE_SC_Last_Updated_Date_Time_Entry'),
                width: 200,
                isResizable: true,
            },
            {
                header: I18N.getReportingValue('RE_SC_Action_Pending_On_Entry'),
                width: 150,
                isResizable: true,
            },
            {
                header: I18N.getReportingValue('RE_SC_Assessement_Module_Manager_Entry'),
                width: 200,
                isResizable: true,
                visibility: 'hide',
            }, {
                header: I18N.getReportingValue('RE_SC_Assessement_Co-Module_Managers_Entry'),
                width: 200,
                isResizable: true,
                isSortable: true,
                visibility: 'hide',
            }, {
                header: I18N.getReportingValue('RE_SC_Assessement_Assessment_Coordinator_Entry'),
                width: 200,
                isResizable: true,
                visibility: 'hide',
            },
        ];
        return columns;
    }

    onSearch(e, args) {
        this.searchText = args.newValue || '';
        this.getTableInfos();
    }

    onStop(e, args) {
        this.searchText = args.newValue || '';
        this.getTableInfos();
    }

    pieCallBack(pieData, isCheck) {
        if (isCheck && pieData) {
            if (pieData.name !== undefined) {
                //status.
                let activeIndex = pieData.activeIndex;
                this.setState({
                    activeIndex
                }, () => {
                    this.status = [pieData.name];
                    this.getTableInfos();
                });
            }
        }
        else if (!isCheck) {
            let activeIndex = -1;
            this.setState({
                activeIndex
            }, () => {
                this.status = [];
                this.getTableInfos();
            });
        }
    }

    handleSelectedPageChanged(e, args) {
        if (args.oldValue.pageSize !== -1 || args.newValue.selectedPage !== args.oldValue.selectedPage) {
            this.getTableInfos(args.newValue.selectedPage, args.newValue.pageSize);
        }
    }

    handleSorting(e, args) {
        if (args &&
            args.newValue &&
            args.newValue.sort) {
            let sortData = args.newValue.sort;
            if (sortData) {
                this.order = sortData.status;
                this.sortBy = this.sortableColumns[sortData.index];
                this.getTableInfos();
            }
        }
    }

    //New Logic.
    getTableInfos(offset = this.state.selectedPage, limit = this.state.pageSize, needrefreshModules = false) {
        if (this.qualification && this.assessment) {
            let tableData = {
                offset: offset,
                limit: limit,
                semesterId: this.qualification.semesterId,
                qualificationCategory: this.qualification.qualificationCategory,
                assessmentType: this.assessment.id,
                moduleIds: (this.isSelectedAllModules) ? [] : this.selectedModules.map((s) => { return s.moduleId }),
                sortBy: this.sortBy,
                order: this.order,
                searchText: this.searchText,
                status: this.status
            };
            this.pageLoading(true);
            ScheduleService.getSubmissionProgressInfos(tableData).then((jsonData) => {
                if (jsonData) {
                    let tableDatas = jsonData;
                    let [pageCount, tableItemSource, selectedPage, assessmentCount] =
                        [
                            Math.ceil(tableDatas.totalCount / this.state.pageSize),
                            [].concat(tableDatas.items),
                            tableDatas.offset,
                            tableDatas.totalCount
                        ];
                    $$.setState(this, 'sa-schedulereport-submissionprogress-datagrid', {
                        tableItemSource
                    });
                    this.setState({
                        pageCount,
                        selectedPage,
                        assessmentCount
                    });
                }
                this.pageLoading(false);
            }).catch((e) => {
                $$.error(`error: ${e}`);
                this.pageLoading(false);
            });
        }
    }

    getPieChartInfos() {
        if (this.qualification && this.assessment) {
            let pieCharData = {
                semesterId: this.qualification.semesterId,
                qualificationCategory: this.qualification.qualificationCategory,
                assessmentType: this.assessment.id,
                moduleIds: (this.isSelectedAllModules) ? [] : this.selectedModules.map((s) => { return s.moduleId }),
                searchText: this.searchText
            };
            this.pageLoading(true)
            ScheduleService.getSubmissionProgressPieChart(pieCharData).then((jsonData) => {
                if (jsonData) {
                    let [pieTitle, pieChartItems] = ['', []];
                    let pieCharDatas = jsonData;
                    if (pieCharDatas.items && pieCharDatas.items.length > 0) {
                        for (let item of pieCharDatas.items) {
                            pieChartItems.push({
                                name: item.status,
                                count: item.count,
                                color: item.color
                            });
                        }
                    }
                    this.setState({
                        pieChartItems
                    });
                }
                this.pageLoading(false);
            }).catch((e) => {
                $$.error(`error: ${e}`);
                this.pageLoading(false);
            });
        }
    }

    initProgressDatas(params = undefined, isSelectAll = false) {
        if (params) {
            this.qualification = params.qualification;
            this.assessment = params.assessment;
            this.selectedModules = params.selectedModules;
        };
        this.isSelectedAllModules = isSelectAll;
        if (this.selectedModules && this.selectedModules.length > 0) {
            if (!this.state.pieChartVisible) {
                this.setState({
                    pieChartVisible: true
                }, this.updatePieChartAndTableDatas);
            }
            else {
                this.updatePieChartAndTableDatas();
            }
        }
        else {
            this.clearFormDatas();
        }
    }

    updatePieChartAndTableDatas() {
        this.getPieChartInfos();
        this.getTableInfos(this.state.selectedPage, this.state.pageSize);
    }

    clearFormDatas() {
        this.setState({
            assessmentCount: 0,
            pieChartItems: [
            ],
            pieTitle: '',
            pageSize: 10,
            pageCount: 0,
            selectedPage: 1,
            pieChartVisible: false,
            activeIndex: -1,
        });
        $$.setState(this, 'sa-schedulereport-submissionprogress-datagrid', {
            tableItemSource: []
        });
    }

    updatePieChartTitle(qualification, assessment, selectedModuleCodes) {
        if (qualification && assessment && selectedModuleCodes) {
            let [qualificationCategory, academicYear, semesterNumber, assessmentType] =
                [
                    qualification.qualificationCategory,
                    qualification.academicYear,
                    qualification.semesterNumber,
                    assessment.name
                ];
            //let moduleInfos = (!selectedModuleCodes || (selectedModuleCodes && selectedModuleCodes.length === 0)) ?
            //    "" :
            //    (selectedModuleCodes.length < 4 ? selectedModuleCodes.join(" & ") :
            //        selectedModuleCodes.splice(0, 3).join(" & ") + "...");
            let moduleCount = selectedModuleCodes.length;
            let pieTitle = I18N.getReportingValue('RE_SC_Pie_Chart_Title_Entry',
                qualificationCategory, assessmentType, academicYear,
                semesterNumber, moduleCount);
            this.setState({
                pieTitle
            });
        }
    }

    render() {
        let columns = this.getColumns();
        return (
            <div
                id="sa-report-schedule-progressreport-main"
                className="flex-item flex-column-container"
            >
                <AssessmentPanel
                    assessmentCount={this.state.assessmentCount}
                    onSearch={this.onSearch}
                    onStop={this.onStop}
                />
                <ExportPanel
                />
                <div
                    hidden={!this.state.pieChartVisible}
                >
                    <CommonPieChartPanel
                        height={345}
                        items={this.state.pieChartItems}
                        activeIndex={this.state.activeIndex}
                        pieTitle={this.state.pieTitle}
                        centerContent={I18N.getReportingValue('RE_SC_Overall_Entry')}
                        handlePieCallBack={this.pieCallBack}
                        isShowTextInSector={this.state.isShowTextInSector}
                    />
                </div>
                <R.DatagridWithCtrl
                    id="sa-schedulereport-submissionprogress-datagrid"
                    columns={columns}
                    items={this.state.tableItemSource}
                    horizontal={$$.datagrid('horizontal').auto}
                    rowTemplate={OverallProgressRow}
                    sorting={this.handleSorting}
                />
                <R.Pager
                    pageSize={this.state.pageSize}
                    pageCount={this.state.pageCount}
                    selectedPage={this.state.selectedPage}
                    selectedPageChanged={this.handleSelectedPageChanged}
                />
            </div>
        );
    }
}

const scheduleDetailUrl = window.SANavigationConstant.NAVIGATION_ASSESSMENTSCHEDULE + "/AssessmentSchedule/Detail";

const rowEvents = [
    'handleViewModule',
    'getComments',
    'handleShowPopup',
];
class OverallProgressRow extends R.DatagridRow {
    constructor(props) {
        super(props);
        this.state = {
            status: { show: false }
        };
        rowEvents.forEach((event) => {
            this[event] = this[event].bind(this);
        });
    }

    handleViewModule(rowData) {
        let subUrl = `?id=${rowData.assessmentId}`;
        window.open(window.SANavigationConstant.NAVIGATION_ASSESSMENTSCHEDULE + "/AssessmentSchedule/Detail" + subUrl);
    }

    getComments(rowData) {
        let comments = rowData.comments;
        if (comments && comments.length < 50) {
            return comments;
        }
        else if (comments && comments.length >= 50) {
            let popupId = `sa-report-scheduleprogress-popup${rowData.assessmentId}`;
            return (
                <div>
                    <div
                        style={{ wordWrap: "break-word", whiteSpace: "normal" }}
                    >
                        {`${comments.substring(0, 50)}...`}
                    </div>
                    <div
                        className="schedule-submitprogressreport-comments-label"
                        id={popupId}
                        onClick={this.handleShowPopup}
                    >More
                        </div>
                    <R.Popup
                        ofElement={`#${popupId}`}
                        width={300}
                        height={250}
                        status={this.state.status}
                        hasClose={true}
                    >
                        <div className="schedule-submitprogressreport-comments-popup">
                            <div
                                className="schedule-submitprogressreport-comments-popup-commentheader"
                            >
                                Comments:
                            </div>
                            <div
                                className="schedule-submitprogressreport-comments-popup-commentcontent"
                            >
                                {comments}
                            </div>
                        </div>
                    </R.Popup>
                </div>
            );
        }
        return "";
    }

    handleShowPopup() {
        this.setState({
            status: { show: true }
        });
    }

    render() {
        let rowData = this.props.rowData;
        return (
            <div data-part="row">
                <div data-part="cell">{rowData.assessment}</div>
                <div
                    data-part="cell"
                >
                    {/*
                    <span
                        className="text-blue linkDetailItem"
                        onClick={() => { this.handleViewModule(rowData) }}
                    >
                        {rowData.module}</span>
                        */}
                    {rowData.module}
                </div>
                <div data-part="cell">
                    <div>
                        {rowData.cohort}
                    </div>
                </div>
                <div data-part="cell">{rowData.school}</div>
                <div data-part="cell">{rowData.status}</div>
                <div data-part="cell">{this.getComments(rowData)}</div>
                <div data-part="cell">{rowData.lastUpdatedBy}</div>
                <div data-part="cell">{rowData.lastUpdatedDateTime}</div>
                <div data-part="cell">{rowData.actionPendingOn}</div>
                <div data-part="cell">{rowData.moduleManager}</div>
                <div data-part="cell">{rowData.coModuleManagers}</div>
                <div data-part="cell">{rowData.assessmentCoordinator}</div>
            </div>
        )
    }
}

module.exports = OverallProgressTab;