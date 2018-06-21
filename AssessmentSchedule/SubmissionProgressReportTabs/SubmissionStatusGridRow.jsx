import * as React from 'react';
import { Link } from 'react-router-dom';

const eventsArr = [
    'handleViewModuleDetails',
];
const ModuleDetailsUrl = window.SANavigationConstant.NAVIGATION_ASSESSMENTSCHEDULE + "/AssessmentSchedule/Detail";

export class SubmissionStatusGridRow extends R.DatagridRow {
    constructor(props) {
        super(props);
        eventsArr.map((ev) => {
            this[ev] = this[ev].bind(this);
        });
    }

    handleViewModuleDetails(e, args) {
        window.open(window.SANavigationConstant.NAVIGATION_ASSESSMENTSCHEDULE + "/AssessmentSchedule/Detail?id=" + this.props.rowData.assessmentId);
    }

    render() {
        return (
            <div data-part="row">
                <div data-part="cell">{this.props.rowData.assessment}</div>
                <div data-part="cell">{this.props.rowData.module}</div>
                <div data-part="cell">{this.props.rowData.cohort}</div>
                <div data-part="cell">{this.props.rowData.school}</div>
                <div data-part="cell">{this.props.rowData.status}</div>
                <div data-part="cell">{this.props.rowData.lastUpdatedBy}</div>
                <div data-part="cell">{this.props.rowData.lastUpdatedDateTime}</div>
                <div data-part="cell">{this.props.rowData.deadlineSetBySchool}</div>
                <div data-part="cell">{this.props.rowData.moduleManager}</div>
                <div data-part="cell">{this.props.rowData.coModuleManagers}</div>
                <div data-part="cell">{this.props.rowData.assessmentCoordinator}</div>
            </div>
        )
    }
}

module.exports = SubmissionStatusGridRow;
