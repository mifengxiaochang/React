import * as React from 'react';
import OverallProgressTab from './SubmissionProgressReportTabs/OverallProgressTab'
import SubmissionStatusTab from './SubmissionProgressReportTabs/SubmissionStatusTab'
import InformationApprovalTab from './SubmissionProgressReportTabs/InformationApprovalTab'
import { ItemRouterType, SubmissionProgressTabType } from '../../Constants/Constants';
import * as ScheduleService from '../../Services/ScheduleService';
const eventArgs = [
    'handleSelectedTabChanged',
    'handleSelectedModuleChange',
    'handleRefreshModules',
];
export class SubmissionProgressReport extends React.Component {
    constructor(props) {
        super(props);
        this.init();
    }

    init() {
        this.mServices = {
            [ItemRouterType.ScheduleSubmissionProgressReport]: {
                [SubmissionProgressTabType.Progress]: ScheduleService.getProgressModuleFilters,
                [SubmissionProgressTabType.Status]: ScheduleService.getSubmissionModuleFilters,
                [SubmissionProgressTabType.ApprovalStatus]: ScheduleService.getApprovalModuleFilters
            },
        }
        this.state = {
            tabs: [
                { title: I18N.getReportingValue('RE_SC_Overall_Progress_of_Assessment_Information_Submission_Entry'), description: '' },
                { title: I18N.getReportingValue('RE_SC_Assessment_Information_Submission_Status_Entry'), description: '' },
                { title: I18N.getReportingValue('RE_SC_Assessment_Information_Approval_Status_Entry'), description: '' },
            ],
            disabled: false,
            selectedModules: [],
            modules: [],
            submissionProgressTabType: (this.props.initData &&
                this.props.initData.param &&
                this.props.initData.param.tabType) ? this.props.initData.param.tabType : SubmissionProgressTabType.Progress,
        };
        eventArgs.forEach((event) => {
            this[event] = this[event].bind(this);
        });
    }

    componentDidMount() {
        if (this.props.initData &&
            this.props.initData.qualification &&
            this.props.initData.assessment) {
            this.getModuleFilters(ItemRouterType.ScheduleSubmissionProgressReport, this.state.submissionProgressTabType);
        }

    }

    getModuleFilters(module, tab) {
        //if (tab === SubmissionProgressTabType.Progress) {
        //    this.updateSubTabDataSource(true);
        //}
        //else {
        this.pageLoading(true);
        let { qualification, assessment } = this.props.initData;
        let qCategory = "", semesterId = "", assessmentType = "";
        if (qualification && !assessment) {
            qCategory = qualification.qualificationCategory;
            semesterId = qualification.semesterId;
        }
        if (qualification && assessment) {
            qCategory = qualification.qualificationCategory;
            semesterId = qualification.semesterId;
            assessmentType = assessment.name;
        }
        this.mServices[module][tab](qCategory, semesterId, assessmentType).then((jsonData) => {
            let modules = [];
            if (jsonData && jsonData.length > 0 || tab !== this.state.submissionProgressTabType) {
                for (let item of jsonData) {
                    modules.push(Object.assign({}, item, { isChecked: false }));
                }
                this.setState({
                    modules: modules,
                    //selectedModules: modules,
                });
            }
            this.pageLoading(false);
        }).catch((e) => {
            $$.error(`error: ${e}`);
            this.pageLoading(false);
        });
        //}
    }

    handleSelectedTabChanged(e, args) {
        this.setState({
            submissionProgressTabType: args.newValue.index
        }, () => {
            this.props.handleRefreshFilter(ItemRouterType.ScheduleSubmissionProgressReport,
                (args.newValue.index + 1).toString(),
                { tabType: this.state.submissionProgressTabType, needRefreshFilter: true });
        });
    }

    handleSelectedModuleChange(e, args) {
        let isSelectAll = args.newValue.isSelectAll;
        let selectedModules = args.newValue.items;
        let selectedModuleCodes = (args.newValue.items && args.newValue.items.length > 0) ? args.newValue.items.map((m) => m.moduleCode) : [];
        this.setState({
            selectedModules
        }, () => {
            this.updatePieChartTitle(selectedModuleCodes);
            this.updateSubTabDataSource(isSelectAll);
        });
    }

    pageLoading(isLoading) {
        //$$.elementLoading('sa-report-schedule-progressreport', isLoading);
        $$.loading(isLoading);
    }

    handleRefreshModules(modules) {
        this.setState({
            modules: modules,
            selectedModules: [],
        });
    }

    updatePieChartTitle(selectedModuleCodes) {
        let [qualification, assessment] = [this.props.initData.qualification, this.props.initData.assessment];
        switch (this.state.submissionProgressTabType) {
            case SubmissionProgressTabType.Progress:
                this.overallProgress && this.overallProgress.updatePieChartTitle(qualification, assessment, selectedModuleCodes);
                break;
            case SubmissionProgressTabType.Status:
                //this.submissionStatus && this.submissionStatus.refreshStatusTabDatas(parameter);
                break;
            case SubmissionProgressTabType.ApprovalStatus:
                //this.informationApproval && this.informationApproval.refreshProgressTabDatas(parameter);
                break;
            default:
                break;
        }
    }

    updateSubTabDataSource(isSelectAll = false) {
        let parameter = {
            qualification: this.props.initData.qualification,
            assessment: this.props.initData.assessment,
            selectedModules: this.state.selectedModules
        };
        switch (this.state.submissionProgressTabType) {
            case SubmissionProgressTabType.Progress:
                this.overallProgress && this.overallProgress.initProgressDatas(parameter, isSelectAll);
                break;
            case SubmissionProgressTabType.Status:
                this.submissionStatus && this.submissionStatus.refreshStatusTabDatas(parameter, isSelectAll);
                break;
            case SubmissionProgressTabType.ApprovalStatus:
                this.informationApproval && this.informationApproval.refreshProgressTabDatas(parameter, isSelectAll);
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div
                id="sa-report-schedule-progressreport-container"
                className="flex-item flex-column-container"
                style={{ height: "100%" }}
            >
                <R.Multicombobox
                    id="reporting-submission-modulefilter"
                    disabled={this.state.disabled}
                    width={220}
                    dataCheckedField="isChecked"
                    dataTextField="moduleCode"
                    selectedItemTemplate={I18N.getReportingValue("RE_Common_Module:_Entry") + " {0}"}
                    selectedItemsTemplate={I18N.getReportingValue("RE_Common_Module:_Entry") + " {0} " + I18N.getReportingValue("RE_Common_Items_Entry")}
                    items={this.state.modules}
                    selectionChanged={this.handleSelectedModuleChange}
                    popupWidth="100%"
                    noneText={I18N.getReportingValue('RE_Common_Module:_Entry') + I18N.getReportingValue("RE_Common_None_Entry")}
                    allText={I18N.getReportingValue('RE_Common_Module:_Entry') + I18N.getReportingValue('RE_Common_All_Entry')}
                    selectAllText={I18N.getReportingValue("RE_Common_All_Entry")}
                />
                <div style={{ marginTop: 20 }}>
                    <R.Tabcontrol
                        isSlideable={true}
                        tabs={this.state.tabs}
                        selectedIndex={this.state.submissionProgressTabType}
                        selectedIndexChanged={this.handleSelectedTabChanged}
                    >
                        <div>
                            <OverallProgressTab
                                ref={ref => this.overallProgress = ref}
                                handleRefreshModules={this.handleRefreshModules}
                            />
                        </div>
                        <div>
                            <SubmissionStatusTab
                                ref={ref => this.submissionStatus = ref}
                            />
                        </div>
                        <div>
                            <InformationApprovalTab
                                loading={this.pageLoading}
                                submissionProgressTabType={this.state.submissionProgressTabType}
                                ref={ref => this.informationApproval = ref}
                            />
                        </div>
                    </R.Tabcontrol>
                </div>
            </div>
        )
    }
}

module.exports = SubmissionProgressReport;