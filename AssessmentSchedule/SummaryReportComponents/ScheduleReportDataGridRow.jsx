import { Link } from 'react-router-dom';
import { ItemRouterType } from '../../../Constants/Constants';
export default class ScheduleReportDataGridRow extends R.DatagridRow {
    constructor(props) {
        super(props);
       
        this.handleViewModuleClick = this.handleViewModuleClick.bind(this);
        this.handleViewDetail = this.handleViewDetail.bind(this);
    }

    handleViewModuleClick(e, args) {
        window.open(window.SANavigationConstant.NAVIGATION_ASSESSMENTSCHEDULE + "/AssessmentSchedule/Detail?id=8d014cc2-7721-4b8c-84a2-4f23421b1785");
       
    }

    handleViewDetail(e,rowData) {
        
        this.trigger('rowDataChanged', e, {
            actionType: "goToModuleDetails"
        });
    }

    render() {
        var data = this.props.rowData;
        return (
            <div data-part="row">
                <div data-part="cell">
                    <button
                        type="button"
                        className="button button-icon"
                        style={{ backgroundColor: 'transparent' }}
                        onClick={(data) => { this.handleViewDetail(data) }}
                    >
                    {
                        //<Link to={ItemRouterType.ScheduleDetailedReport}>
                            <span style={{ color: '#469DDD' }} className="fi-page-preview-a"></span>
                        //</Link>
                    }
                    </button>
                </div>
                <div data-part="cell">
                    <button
                        className="button button-link button-blue"
                        onClick={this.handleViewModuleClick}
                    >
                        <span className="button-underline">{data.module}</span>
                    </button>
                </div>
                <div data-part="cell">{data.school}</div>
                <div data-part="cell">{data.assessment}</div>
                <div data-part="cell">{data.assessmentMode}</div>
                <div data-part="cell">{data.numberOfStudentSetUp}</div>
                <div data-part="cell">{data.numberOfStudentEnrolled}</div>
            </div>
        );
    }
}