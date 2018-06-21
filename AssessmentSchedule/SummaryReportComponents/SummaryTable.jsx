import * as React from 'react';
import * as Service from '../Service/SummaryReportService';
import ScheduleReportDataGridRow from './ScheduleReportDataGridRow';
import { ItemRouterType } from '../../../Constants/Constants';

const eventsArr = [
    "handleRowDataChanged",
    "handleSorting",
    "handleSelectedPageChanged",
    "handleExportBtnClick",
    "handleGoToModuleDetails"
];


export class SummaryTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPage: 1,
            pageSize: 10,
            pageCount: 5,
            itemSource:[],
          
        };

        eventsArr.map((ev) => {
            this[ev] = this[ev].bind(this);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tableItemSource != this.props.tableItemSource && nextProps.tableItemSource.tableData) {
            this.initTableValue(nextProps.tableItemSource);
        }
    }

    componentWillMount() {
        this._isMounted = true
        
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidMount() {
        if (this.props.tableItemSource.tableData) {
            this.initTableValue(this.props.tableItemSource);
        }
        
    }

    initTableValue(tableItemSource) {
        new Promise(
            (resolve) => {
                this.refreshTable(tableItemSource.tableData);
                this.updatePager(tableItemSource,resolve);
            }
        ).then(() => {
            $$.loading(false);
        }).catch((message) => {
            $$.loading(message);
        });
        
    }

    updatePager(pageItems,resolve) {
        if (pageItems && this._isMounted) {
            let totalCount = pageItems.pageCount;
            let selectedPage = pageItems.selectedPage;
            this.setState({
                pageCount: totalCount,
                selectedPage: selectedPage
            }, () => { resolve() });
        }        
    }

    refreshTable(value) {
        if (value) {
            $$.setState(this, 'assessment-schedule-report-datagrid', {
                itemSource: value,
            });
        }
       
    }

    callback(args,type) {
        this.props.callback && this.props.callback(args, type);
    }

    handleSelectedPageChanged(e, args) {
        if (args.oldValue.selectedPage == -1 || (args.oldValue.selectedPage == args.newValue.selectedPage && args.oldValue.pageSize == args.newValue.pageSize)) {
            return;
        }
        let selectedPageValues = args.newValue;
        if (selectedPageValues) {
            this.setState({
                pageSize: selectedPageValues.pageSize,
                selectedPage: selectedPageValues.selectedPage
            }, () => { this.callback(selectedPageValues, "page");})
            
        }
    }

    handleRowDataChanged(e, args) {
        let rowData = args.newValue.rowData;
        switch (args.parameters.actionType) {
            case 'goToModuleDetails':
                this.handleGoToModuleDetails(rowData);
                break;
            default:
                break;
        }

    }

    handleGoToModuleDetails(data) {
        window.open(window.SANavigationConstant.NAVIGATION_ASSESSMENTREPORTING
            + '/' + ItemRouterType.ScheduleDetailedReport + `?semesterId=${this.props.initData.qualification.semesterId}&qualificationCategory=${this.props.initData.qualification.qualificationCategory}&assessment=${this.props.initData.assessment.name}&moduleId=${data.moduleId}`);
    }

    handleExportBtnClick() {
        //ToDo
    }

    handleSorting(e, args) {

        if (args.newValue.sort) {
            let sortData = args.newValue.sort;
            let param = {};
            param.status = sortData.status;
            param.sortByColumsName = this.getColumns()[sortData.index].header;
            if (param.status !== undefined && param.sortByColumsName !== undefined) {
                this.callback(param, "sort");
            }

        }
    }


    handleViewClick(date) {
      
    }

    getColumns() {
        let columns = [{
            header: I18N.getReportingValue('RE_Common_Action_Entry'),
            width: 90,
            isResizable: true,
            align:"center"
        },{
            header: I18N.getReportingValue('RE_Common_Modules_Entry'),
            width: 100,
            isResizable: true,
            isSortable: true
        },  {
            header: I18N.getReportingValue('RE_Common_School_Entry'),
            width: 100,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_Common_Assessment_Entry'),
            width: 100,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_Assessement_Mode_Entry'),
            width: 145,
            isResizable: true
        }, {
            header: I18N.getReportingValue('RE_SC_SummaryReport_Set_Up_Entry'),
            width: 190,
            isResizable: true,
            align: "right"
        }, {
            header: I18N.getReportingValue('RE_SC_SummaryReport_Student_Enrolled_Entry'),
            width: 220,
            isResizable: true,
            align: "right"
        }];
        return columns;
    }
    
    render() {
        return (
            <div className="margintop10">
                <div>
                    <R.DatagridWithCtrl
                        id="assessment-schedule-report-datagrid"
                        columns={this.getColumns()}
                        items={this.state.itemSource}
                        rowTemplate={ScheduleReportDataGridRow}
                        rowDataChanged={this.handleRowDataChanged}
                        sorting={this.handleSorting}
                    >
                        {
                            //<R.Button isLink iconClass="fi-page-export-a" onClick={this.handleExportBtnClick} text="Export" />
                        }
                    </R.DatagridWithCtrl>
                    <R.Pager
                        selectedPage={this.state.selectedPage}
                        pageSize={this.state.pageSize}
                        pageCount={this.state.pageCount}
                        selectedPageChanged={this.handleSelectedPageChanged}
                    ></R.Pager>
                </div>
            </div>
        );
    }
}

module.exports = SummaryTable;