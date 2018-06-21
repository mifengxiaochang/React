import * as React from 'react';
import AssessmentPanel from './CommonComponents/AssessmentPanel'
import ExportPanel from './CommonComponents/ExportPanel'
//import PieChartPanel from './CommonComponents/PieChartPanel';
import PieChartPanel from '../../Common/PieChartPanel';
import SubmissionStatusGridRow from './SubmissionStatusGridRow'
import * as ScheduleService from '../../../Services/ScheduleService';
import * as CommonUtil from '../../../Utilities/CommonUtil';

const eventsArr = [
    'handleSearchboxOnSearch',
    'handleSearchboxSearchStop',
    'handleSelectedPageChanged',
    'handleSorting',
    'handlePieCallPack',
    'handleExportClicked'
];

class SubmissionStatusTab extends React.Component {
    constructor(props) {
        super(props);
        eventsArr.map((ev) => {
            this[ev] = this[ev].bind(this);
        });

        this.state = {
            assessmentCount: 0,
            pieTitle: '',
            pieChartItems: [],
            pieActiveIndex: -1,
            gridItems: [],
            pageSize: 10,
            pageCount: 1,
            selectedPage: 1,
        };

        this.searchStr = '';
        this.sortBy = '';
        this.order = '';

        this.semesterId = '';
        this.qualificationCategory = '';
        this.assessmentId = '';
        this.assessmentName = '';
        this.academicYear = -1;
        this.semesterNumber = -1;
        this.selectedModules = [];
        this.isSelectAll = false;
        this.selectedPieStatus = null;
    }

    refreshStatusTabDatas(params = null, isSelectAll = false) {
        if (params.qualification && params.assessment) {
            this.semesterId = params.qualification.semesterId;
            this.qualificationCategory = params.qualification.qualificationCategory;
            this.academicYear = params.qualification.academicYear;
            this.semesterNumber = params.qualification.semesterNumber;
            this.assessmentId = params.assessment.id;
            this.assessmentName = params.assessment.name;
            this.selectedModules = params.selectedModules;
            this.isSelectAll = isSelectAll;
            if (this.semesterId && this.qualificationCategory && this.assessmentId) {
                this.getTabInfo();
            }
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.pageSize != this.state.pageSize ||
            nextState.selectedPage != this.state.selectedPage) {
            this.state.pageSize = nextState.pageSize;
            this.state.selectedPage = nextState.selectedPage;
            this.getTableInfo();
        }
    }

    getTabInfo() {
        if (this.isSelectAll || (this.selectedModules && this.selectedModules.length > 0)) {
            $$.loading(true);
            let pieChartModel = {
                semesterId: this.semesterId,
                qualificationCategory: this.qualificationCategory,
                assessmentType: this.assessmentId,
                moduleIds: this.isSelectAll ? [] : this.selectedModules.map((s) => { return s.moduleId }),
                searchText: this.searchStr
            };

            let tableModel = {
                offset: this.state.selectedPage,
                limit: this.state.pageSize,
                semesterId: this.semesterId,
                qualificationCategory: this.qualificationCategory,
                assessmentType: this.assessmentId,
                moduleIds: this.isSelectAll ? [] : this.selectedModules.map((s) => { return s.moduleId }),
                sortBy: this.sortBy,
                order: this.order,
                searchText: this.searchStr,
                status: this.selectedPieStatus ? [this.selectedPieStatus] : []
            };

            promiseAll(
                ScheduleService.getScheduleSubmissionPieChart(pieChartModel),
                ScheduleService.getScheduleSubmission(tableModel)).then((response) => {
                    this.initPieChart(response[0]);
                    this.initTableItems(response[1]);
                    this.state.assessmentCount = response[1].totalCount;
                    this.setState({});
                    $$.loading(false);
                }).catch(function (e) {
                    $$.error(`error: ${e}`);
                    $$.loading(false);
                });
        } else {
            $$.setState(this, 'submissionprogressreport-submissionstatus-datagrid', {
                assessmentCount: 0,
                pieTitle: '',
                pieChartItems: [],
                gridItems: [],
                pageSize: 10,
                pageCount: 1,
                selectedPage: 1
            });
        }
    }

    getTableInfo() {
        if (this.isSelectAll || (this.selectedModules && this.selectedModules.length > 0)) {
            $$.loading(true);
            let tableModel = {
                offset: this.state.selectedPage,
                limit: this.state.pageSize,
                semesterId: this.semesterId,
                qualificationCategory: this.qualificationCategory,
                assessmentType: this.assessmentId,
                moduleIds: this.isSelectAll ? [] : this.selectedModules.map((s) => { return s.moduleId }),
                sortBy: this.sortBy,
                order: this.order,
                searchText: this.searchStr,
                status: this.selectedPieStatus ? [this.selectedPieStatus] : []
            };
            ScheduleService.getScheduleSubmission(tableModel).then((response) => {
                this.initTableItems(response);
                $$.loading(false);
            }).catch(function (e) {
                $$.error(`error: ${e}`);
                $$.loading(false);
            });
        }
    }

    initPieChart(data) {
        if (data) {
            //let moduleCodes = this.selectedModules.map((s) => { return s.moduleCode });
            let moduleCount = this.selectedModules.length;
            let chartTitle = I18N.getReportingValue('RE_SC_Pie_Chart_Title_Entry',
                this.qualificationCategory, this.assessmentName, this.academicYear,
                this.semesterNumber, moduleCount)
            this.state.pieTitle = chartTitle;
            let itemList = [];
            for (let item of data.items) {
                let chartItem = { name: item.status, value: item.count, color: item.color };
                itemList.push(chartItem);
            }
            this.state.pieChartItems = itemList;
        }
    }

    initTableItems(data) {
        if (data) {
            let totalPage = Math.ceil(data.totalCount / this.state.pageSize);
            $$.setState(this, 'submissionprogressreport-submissionstatus-datagrid', {
                gridItems: [].concat(data.items),
                pageCount: totalPage,
                selectedPage: data.offset
            });
        }
    }

    handleSearchboxOnSearch(e, args) {
        this.searchStr = args.newValue;
        this.getTabInfo();
    }

    handleSearchboxSearchStop(e, args) {
        this.searchStr = '';
        this.getTabInfo();
    }

    handleSelectedPageChanged(e, args) {
        this.setState({
            pageSize: args.newValue.pageSize,
            selectedPage: args.newValue.selectedPage
        });
    }

    handleSorting(e, args) {
        if (args.newValue.sort) {
            this.sortBy = args.newValue.sort.valuePath;
            this.order = args.newValue.sort.status;
            this.getTableInfo();
        }
    }

    handlePieCallPack(data, isCheck) {
        if (isCheck && data) {
            this.setState({
                pieActiveIndex: data.activeIndex
            });
            this.selectedPieStatus = data.name;
            this.getTableInfo();
        }
        else if (!isCheck) {
            this.setState({
                pieActiveIndex: -1
            });
            this.selectedPieStatus = '';
            this.getTableInfo();
        }
    }

    handleExportClicked(e, args) {
        $$.loading(true);
        let query = {
            semesterId: this.semesterId,
            qualificationCategory: this.qualificationCategory,
            assessmentType: this.assessmentId,
            moduleIds: this.selectedModules.map((s) => { return s.moduleId }),
            searchText: this.searchStr,
            sortBy: this.sortBy,
            order: this.order,
        }
        ScheduleService.exportSubmissionStatus(query).then((blob) => {
            CommonUtil.downloadFileByBlob(blob, "report.xlsx");
            $$.loading(false);
        }).catch(function (e) {
            $$.error(`error: ${e}`);
            $$.loading(false);
        });
    }

    getColumns() {
        let columns = [{
            header: I18N.getReportingValue('RE_Common_Assessment_Entry'),
            width: 100,
            isSortable: true,
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
            width: 120,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Last_Updated_By_Entry'),
            width: 150,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Last_Updated_Date_Time_Entry'),
            width: 220,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Deadline_Set_By_School_Entry'),
            width: 300,
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
        }];
        return columns;
    }

    render() {
        let isShowChart = this.state.pieChartItems && this.state.pieChartItems.length > 0;
        return (
            <div>
                <AssessmentPanel
                    assessmentCount={this.state.assessmentCount}
                    onSearch={this.handleSearchboxOnSearch}
                    onStop={this.handleSearchboxSearchStop}
                />
                <ExportPanel
                    exportClicked={this.handleExportClicked}
                />
                <div hidden={!isShowChart}>
                    <PieChartPanel
                        attributes={["color", "name", "value"]}
                        pieTitle={this.state.pieTitle}
                        items={this.state.pieChartItems}
                        centerContent={I18N.getReportingValue('RE_SC_Submission_Status_Entry')}
                        isShowTextInSector={true}
                        activeIndex={this.state.pieActiveIndex}
                        handlePieCallBack={this.handlePieCallPack}
                    />
                </div>
                <R.DatagridWithCtrl
                    id="submissionprogressreport-submissionstatus-datagrid"
                    columns={this.getColumns()}
                    items={this.state.gridItems}
                    rowTemplate={SubmissionStatusGridRow}
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

module.exports = SubmissionStatusTab;
