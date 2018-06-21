import * as React from 'react';

const eventArgs = [
    'onSearch',
    'onStop',
];
class AssessmentPanel extends React.Component {
    constructor(props) {
        super(props);

        eventArgs.forEach((event) => {
            this[event] = this[event].bind(this);
        });
    }

    onSearch(e, args) {
        this.props.onSearch && this.props.onSearch(e, args);
    }

    onStop(e, args) {
        this.props.onStop && this.props.onStop(e, args);
    }

    render() {
        return (<div
            className="schedule-submitprogressreport-assessment"
        >
            <div className="schedule-submitprogressreport-searchbox">
                <R.Searchbox
                    title=""
                    placeholder={I18N.getReportingValue('RE_Common_Search_Placeholder_Entry')}
                    disabled={false}
                    onSearch={this.onSearch}
                    onStop={this.onStop} />
            </div>
        </div>)
    }
}

module.exports = AssessmentPanel;