import * as React from 'react';
require("./Helper");
import DetailedReportMain from './DetailedReportMain';

export class DetailedReport extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className='detailed-report-main'>
            <DetailedReportMain
                initData={this.props.initData}
            />
        </div>
    }
}

module.exports = DetailedReport;